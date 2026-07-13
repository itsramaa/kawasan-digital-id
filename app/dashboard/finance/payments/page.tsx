import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPayments } from '@/app/actions/dashboard';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Track incoming and outgoing payments.</p>
      </div>
      {payments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No payments found.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {/* TODO: replace with PaymentTable client component */}
            {(payments as any[]).map((pay) => (
              <div key={pay.id} className="flex items-center justify-between py-2 text-sm">
                <span>{pay.invoice?.client?.name ?? '—'}</span>
                <span>{pay.referenceNumber ?? '—'}</span>
                <span>Rp {Number(pay.amount).toLocaleString('id-ID')}</span>
                <span>{pay.paymentMethod ?? '—'}</span>
                <span className="text-muted-foreground">{pay.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
