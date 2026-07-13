'use client'

export const dynamic = 'force-dynamic';
// TODO: Wire up cart with Server Actions / Prisma
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckoutOrderSummary } from '@/src/features/storefront/components/CheckoutOrderSummary';
import type { CartItem } from '@/src/features/storefront/hooks/useCart';

export default function CartPage() {
  // TODO: fetch cart from context / Server Action
  const items: CartItem[] = [];
  const total = items.reduce((s, i) => s + i.base_price + i.selected_features.reduce((fs, f) => fs + f.price, 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6" /> Keranjang
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground">Keranjang kamu masih kosong.</p>
          <Button asChild>
            <Link href="/templates">Lihat Templates</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutOrderSummary items={items} total={total} showEditLink={false} />
          </div>
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-xl border border-border p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary border-0">
                <Link href="/checkout">Lanjut ke Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
