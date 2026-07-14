'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/src/features/storefront/hooks/useCart';

export default function CartPage() {
  const { items, totalPrice, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" /> Keranjang
        </h1>
        <div className="text-center py-20 space-y-4">
          <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground">Keranjang kamu masih kosong.</p>
          <Button asChild>
            <Link href="/templates">Lihat Templates</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6" /> Keranjang
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Item list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const featuresTotal = item.selected_features.reduce((s, f) => s + f.price, 0);
            const itemTotal = item.base_price + featuresTotal;

            return (
              <div
                key={item.template_id}
                className="rounded-xl border border-border bg-card overflow-hidden flex gap-4 p-4"
              >
                {/* Thumbnail */}
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.template_name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-primary/40" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-foreground truncate">{item.template_name}</span>
                    <button
                      onClick={() => removeItem(item.template_id)}
                      className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Hapus ${item.template_name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {item.category && (
                    <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                  )}

                  {item.selected_features.length > 0 && (
                    <ul className="text-xs text-muted-foreground space-y-0.5 mt-1">
                      {item.selected_features.map((f) => (
                        <li key={f.id} className="flex justify-between">
                          <span>+ {f.name}</span>
                          {f.price > 0 && <span>Rp {f.price.toLocaleString('id-ID')}</span>}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="text-sm font-bold text-primary pt-1">
                    Rp {itemTotal.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 lg:sticky lg:top-24">
            <h2 className="font-semibold text-foreground">Ringkasan</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary border-0">
              <Link href="/checkout">Lanjut ke Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
