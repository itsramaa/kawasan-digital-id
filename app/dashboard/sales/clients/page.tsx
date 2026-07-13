import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ClientsPage() {
  // TODO: fetch clients from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">Manage client accounts and contacts.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No clients found. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
