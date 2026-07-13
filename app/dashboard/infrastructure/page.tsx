import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDomains, getHostings } from '@/app/actions/dashboard';

export const dynamic = 'force-dynamic';

export default async function InfrastructurePage() {
  const [domains, hostings] = await Promise.all([getDomains(), getHostings()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Infrastructure</h1>
        <p className="text-muted-foreground">Monitor servers, domains, and services.</p>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Domains ({domains.length})</h2>
        {domains.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">No domains found.</CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {/* TODO: replace with DomainTable client component */}
            {(domains as any[]).map((d) => (
              <Card key={d.id}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-base">{d.domainName}</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 text-sm text-muted-foreground">
                  <span>{d.client?.name}</span>
                  {d.registrar && <span>Registrar: {d.registrar}</span>}
                  <span>Expires: {new Date(d.expiryDate).toLocaleDateString('id-ID')}</span>
                  <span>{d.status}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Hosting ({hostings.length})</h2>
        {hostings.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">No hosting records found.</CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {/* TODO: replace with HostingTable client component */}
            {(hostings as any[]).map((h) => (
              <Card key={h.id}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-base">{h.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 text-sm text-muted-foreground">
                  <span>{h.client?.name}</span>
                  {h.provider && <span>Provider: {h.provider}</span>}
                  {h.serverType && <span>Type: {h.serverType}</span>}
                  {h.ipAddress && <span>IP: {h.ipAddress}</span>}
                  <span>{h.status}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
