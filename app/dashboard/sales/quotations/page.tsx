import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function QuotationsPage() {
  // TODO: fetch quotations from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quotations</h1>
        <p className="text-muted-foreground">View and manage sales quotations.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No quotations found. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
