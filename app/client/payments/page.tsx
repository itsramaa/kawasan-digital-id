import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ClientPaymentsPage() {
  // TODO: fetch payment history for this client from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pembayaran</h1>
        <p className="text-muted-foreground">Riwayat transaksi dan status pembayaran.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Tidak ada riwayat pembayaran. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
