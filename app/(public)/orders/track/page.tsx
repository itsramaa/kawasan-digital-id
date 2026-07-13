'use client'

export const dynamic = 'force-dynamic';
// TODO: Wire up order tracking with Server Action / Prisma
import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!orderId.trim()) return;
    // TODO: call Server Action to fetch order by ID
    setSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <Package className="w-12 h-12 mx-auto text-primary" />
        <h1 className="text-3xl font-bold">Lacak Pesanan</h1>
        <p className="text-muted-foreground text-sm">Masukkan Order ID untuk melihat status pesanan Anda.</p>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Contoh: ORD-20240101-XXXX"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} className="bg-gradient-to-r from-primary to-secondary border-0">
          <Search className="w-4 h-4 mr-2" /> Cari
        </Button>
      </div>

      {searched && (
        <div className="rounded-xl border border-border p-6 text-center text-muted-foreground text-sm">
          {/* TODO: render real order status */}
          Pesanan dengan ID <span className="font-mono font-semibold">{orderId}</span> tidak ditemukan.
        </div>
      )}
    </div>
  );
}
