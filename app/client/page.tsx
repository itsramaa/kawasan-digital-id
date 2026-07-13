import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ClientDashboardPage() {
  // TODO: fetch client summary from Prisma (projects, invoices, tickets)
  const stats = [
    { title: 'Active Projects', value: '—' },
    { title: 'Unpaid Invoices', value: '—' },
    { title: 'Open Tickets', value: '—' },
    { title: 'Services Active', value: '—' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dasbor</h1>
        <p className="text-muted-foreground">Selamat datang di portal klien Kawasan Digital.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
