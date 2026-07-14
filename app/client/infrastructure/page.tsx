import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/src/auth'
import { getClientDomains, getClientHostings } from '@/app/actions/client-portal'

export const dynamic = 'force-dynamic'

export default async function ClientInfrastructurePage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const clientId = (session.user as any).clientId as string | undefined
  if (!clientId) redirect('/auth/login')

  const [domains, hostings] = await Promise.all([
    getClientDomains(clientId),
    getClientHostings(clientId),
  ])

  const safeDomainsArr = domains ?? []
  const safeHostingsArr = hostings ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Infrastruktur</h1>
        <p className="text-muted-foreground">Server, domain, dan layanan aktif Anda.</p>
      </div>

      {/* Domains */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Domain</h2>
        {safeDomainsArr.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Tidak ada domain ditemukan.
            </CardContent>
          </Card>
        ) : (
          safeDomainsArr.map((d: any) => (
            <Card key={d.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold">{d.name ?? d.domainName ?? '—'}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {d.expiresAt && (
                        <span>Kadaluarsa: {new Date(d.expiresAt).toLocaleDateString('id-ID')}</span>
                      )}
                      {d.registrar && <span>Registrar: {d.registrar}</span>}
                    </div>
                  </div>
                  <Badge variant="outline">{d.status ?? 'ACTIVE'}</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Hostings */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Hosting</h2>
        {safeHostingsArr.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Tidak ada hosting ditemukan.
            </CardContent>
          </Card>
        ) : (
          safeHostingsArr.map((h: any) => (
            <Card key={h.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold">{h.name ?? h.packageName ?? '—'}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {h.expiresAt && (
                        <span>Kadaluarsa: {new Date(h.expiresAt).toLocaleDateString('id-ID')}</span>
                      )}
                      {h.server && <span>Server: {h.server}</span>}
                      {h.plan && <span>Plan: {h.plan}</span>}
                    </div>
                  </div>
                  <Badge variant="outline">{h.status ?? 'ACTIVE'}</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
