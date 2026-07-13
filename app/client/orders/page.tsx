import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/src/auth'
import { getClientOrders } from '@/app/actions/client-portal'

export const dynamic = 'force-dynamic'

export default async function ClientOrdersPage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const clientId = (session.user as any).clientId as string
  const orders = await getClientOrders(clientId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pesanan</h1>
        <p className="text-muted-foreground">Riwayat dan status pesanan Anda.</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Tidak ada pesanan ditemukan.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o: any) => (
            <Card key={o.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold">{o.orderNumber ?? o.id}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Total: Rp {Number(o.totalAmount ?? 0).toLocaleString('id-ID')}</span>
                      <span>Tanggal: {o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID') : '—'}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{o.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
