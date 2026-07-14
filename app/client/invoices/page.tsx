import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/src/auth'
import { getClientInvoices } from '@/app/actions/client-portal'

export const dynamic = 'force-dynamic'

export default async function ClientInvoicesPage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const clientId = (session.user as any).clientId as string | undefined
  if (!clientId) redirect('/auth/login')

  const invoices = (await getClientInvoices(clientId)) ?? []

  const totalUnpaid = invoices
    .filter((i: any) => i.status !== 'PAID')
    .reduce((sum: number, i: any) => sum + Number(i.amount ?? 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invoice</h1>
        <p className="text-muted-foreground">Tagihan dan riwayat pembayaran Anda.</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Belum Dibayar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-destructive">
            Rp {totalUnpaid.toLocaleString('id-ID')}
          </p>
        </CardContent>
      </Card>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Tidak ada invoice ditemukan.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv: any) => (
            <Card key={inv.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold">{inv.invoiceNumber ?? inv.id}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Jumlah: Rp {Number(inv.amount ?? 0).toLocaleString('id-ID')}</span>
                      <span>Jatuh Tempo: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('id-ID') : '—'}</span>
                      {inv.paidAt && (
                        <span>Dibayar: {new Date(inv.paidAt).toLocaleDateString('id-ID')}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant={inv.status === 'PAID' ? 'default' : 'destructive'}>{inv.status ?? '—'}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
