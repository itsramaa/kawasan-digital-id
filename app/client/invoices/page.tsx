import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ClientInvoicesPage() {
  // TODO: fetch invoices for this client from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invoice</h1>
        <p className="text-muted-foreground">Tagihan dan riwayat pembayaran Anda.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Tidak ada invoice ditemukan. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
