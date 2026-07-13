import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ClientOrdersPage() {
  // TODO: fetch orders for this client from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pesanan</h1>
        <p className="text-muted-foreground">Riwayat dan status pesanan Anda.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Tidak ada pesanan ditemukan. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
