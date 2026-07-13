import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/src/auth'
import { getClientInvoices } from '@/app/actions/client-portal'

export const dynamic = 'force-dynamic'

export default async function ClientFinancePage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const clientId = (session.user as any).clientId as string
  const invoices = await getClientInvoices(clientId)

  const totalTagihan = invoices.reduce((sum: number, i: any) => sum + Number(i.amount ?? 0), 0)
  const sudahDibayar = invoices
    .filter((i: any) => i.status === 'PAID')
    .reduce((sum: number, i: any) => sum + Number(i.amount ?? 0), 0)
  const belumDibayar = totalTagihan - sudahDibayar

  const stats = [
    { title: 'Total Tagihan', value: `Rp ${totalTagihan.toLocaleString('id-ID')}` },
    { title: 'Sudah Dibayar', value: `Rp ${sudahDibayar.toLocaleString('id-ID')}` },
    { title: 'Belum Dibayar', value: `Rp ${belumDibayar.toLocaleString('id-ID')}` },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Keuangan</h1>
        <p className="text-muted-foreground">Ringkasan keuangan dan tagihan Anda.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
