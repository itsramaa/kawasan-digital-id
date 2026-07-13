import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ClientFinancePage() {
  // TODO: fetch financial summary for this client from Prisma
  const stats = [
    { title: 'Total Tagihan', value: '—' },
    { title: 'Sudah Dibayar', value: '—' },
    { title: 'Belum Dibayar', value: '—' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Keuangan</h1>
        <p className="text-muted-foreground">Ringkasan keuangan dan tagihan Anda.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
