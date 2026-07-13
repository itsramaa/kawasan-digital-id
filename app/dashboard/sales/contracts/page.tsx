import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ContractsPage() {
  // TODO: fetch contracts from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
        <p className="text-muted-foreground">Manage signed and pending contracts.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No contracts found. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
