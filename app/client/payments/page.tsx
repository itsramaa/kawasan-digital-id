import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/src/auth'
import { getClientInvoices } from '@/app/actions/client-portal'

export const dynamic = 'force-dynamic'

export default async function ClientPaymentsPage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const clientId = (session.user as any).clientId as string | undefined
  if (!clientId) redirect('/auth/login')

  const invoices = (await getClientInvoices(clientId)) ?? []
  const paid = invoices.filter((i: any) => i.status === 'PAID')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pembayaran</h1>
        <p className="text-muted-foreground">Riwayat transaksi dan status pembayaran.</p>
      </div>

      {paid.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Tidak ada riwayat pembayaran.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {paid.map((inv: any) => (
            <Card key={inv.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold">{inv.invoiceNumber ?? inv.id}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Jumlah: Rp {Number(inv.amount ?? 0).toLocaleString('id-ID')}</span>
                      {inv.paidAt && (
                        <span>Dibayar: {new Date(inv.paidAt).toLocaleDateString('id-ID')}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant="default">PAID</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
