import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getContracts } from '@/app/actions/dashboard';

export const dynamic = 'force-dynamic';

export default async function ContractsPage() {
  const contracts = await getContracts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
        <p className="text-muted-foreground">Manage signed and pending contracts.</p>
      </div>
      {contracts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No contracts found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {/* TODO: replace with ContractTable client component */}
          {(contracts as any[]).map((c) => (
            <Card key={c.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4 text-sm text-muted-foreground">
                <span>{c.client?.name ?? '—'}</span>
                <span>Status: {c.status}</span>
                <span>
                  Value: Rp {Number(c.totalValue).toLocaleString('id-ID')}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
