import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic'

// TODO: fetch order details from Prisma using searchParams.orderId

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold">Pesanan Berhasil!</h1>
      <p className="text-muted-foreground">
        Terima kasih atas pesanan Anda. Tim kami akan segera menghubungi Anda.
      </p>
      {orderId && (
        <p className="text-sm text-muted-foreground">
          Order ID: <span className="font-mono font-semibold">{orderId}</span>
        </p>
      )}
      <div className="flex gap-3 justify-center">
        <Button asChild variant="outline">
          <Link href="/orders/track">Lacak Pesanan</Link>
        </Button>
        <Button asChild className="bg-gradient-to-r from-primary to-secondary border-0">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
