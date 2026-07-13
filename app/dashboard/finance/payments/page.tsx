import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function PaymentsPage() {
  // TODO: fetch payments from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Track incoming and outgoing payments.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No payments found. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
