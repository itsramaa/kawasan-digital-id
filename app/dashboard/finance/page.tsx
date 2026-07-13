import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInvoices } from '@/app/actions/dashboard';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
  const invoices = await getInvoices();

  const totalRevenue = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const outstanding = invoices
    .filter((i) => ['Sent', 'Viewed', 'Overdue'].includes(i.status))
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const collectedThisMonth = invoices
    .filter((i) => i.status === 'Paid' && i.paidAt && new Date(i.paidAt) >= startOfMonth)
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const summaryCards = [
    { label: 'Total Revenue', value: `Rp ${totalRevenue.toLocaleString('id-ID')}` },
    { label: 'Outstanding', value: `Rp ${outstanding.toLocaleString('id-ID')}` },
    { label: 'Collected This Month', value: `Rp ${collectedThisMonth.toLocaleString('id-ID')}` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground">Financial overview and reporting.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {/* TODO: replace with InvoiceTable client component */}
            {(invoices as any[]).slice(0, 10).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-2 text-sm">
                <span>{inv.invoiceNumber}</span>
                <span>{inv.client?.name}</span>
                <span>Rp {Number(inv.amount).toLocaleString('id-ID')}</span>
                <span className="text-muted-foreground">{inv.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
