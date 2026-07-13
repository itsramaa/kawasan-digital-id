import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClients } from '@/app/actions/dashboard';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">Manage client accounts and contacts.</p>
      </div>
      {clients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No clients found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {/* TODO: replace with ClientTable client component */}
          {(clients as any[]).map((client) => (
            <Card key={client.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{client.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4 text-sm text-muted-foreground">
                {client.companyName && <span>{client.companyName}</span>}
                {client.email && <span>{client.email}</span>}
                <span>{client.status}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
