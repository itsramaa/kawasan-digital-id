import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuotations } from '@/app/actions/dashboard';

export const dynamic = 'force-dynamic';

export default async function QuotationsPage() {
  const quotations = await getQuotations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quotations</h1>
        <p className="text-muted-foreground">View and manage sales quotations.</p>
      </div>
      {quotations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No quotations found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {/* TODO: replace with QuotationTable client component */}
          {(quotations as any[]).map((q) => (
            <Card key={q.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {q.client?.name ?? 'Unknown Client'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4 text-sm text-muted-foreground">
                <span>Status: {q.status}</span>
                <span>
                  Amount: Rp {Number(q.totalAmount).toLocaleString('id-ID')}
                </span>
                {q.validUntil && (
                  <span>Valid until: {new Date(q.validUntil).toLocaleDateString('id-ID')}</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
