import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/src/auth'
import { getClientContracts } from '@/app/actions/client-portal'

export const dynamic = 'force-dynamic'

export default async function ClientContractsPage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const clientId = (session.user as any).clientId as string | undefined
  if (!clientId) redirect('/auth/login')

  const contracts = (await getClientContracts(clientId)) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kontrak</h1>
        <p className="text-muted-foreground">Kontrak layanan Anda dengan Kawasan Digital.</p>
      </div>

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Tidak ada kontrak ditemukan.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {contracts.map((c: any) => (
            <Card key={c.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold">{c.title ?? '—'}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {c.signedAt && (
                        <span>Ditandatangani: {new Date(c.signedAt).toLocaleDateString('id-ID')}</span>
                      )}
                      {c.totalValue != null && (
                        <span>Nilai: Rp {Number(c.totalValue).toLocaleString('id-ID')}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">{c.status ?? '—'}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
