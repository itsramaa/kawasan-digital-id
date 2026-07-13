import Link from "next/link";
import { Clock, Pencil } from "lucide-react";
import { CheckoutTrustSignals } from "./CheckoutTrustSignals";

interface OrderItem {
  template_id: string;
  template_name: string;
  base_price: number;
  selected_features: Array<{ id: string; name: string; price: number }>;
  category: string | null;
  estimated_days: number | null;
}

interface Props {
  items: OrderItem[];
  total: number;
  showEditLink?: boolean;
}

export function CheckoutOrderSummary({ items, total, showEditLink = true }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden lg:sticky lg:top-24">
      {/* Accent line */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/20" />

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Ringkasan Pesanan</h3>
          {showEditLink && (
            <Link href="/cart" className="text-xs text-primary hover:underline flex items-center gap-1">
              <Pencil className="w-3 h-3" /> Edit Keranjang
            </Link>
          )}
        </div>

        <div className="space-y-3 text-sm">
          {items.map((item) => {
            const featuresCost = item.selected_features.reduce((s, f) => s + f.price, 0);
            const itemTotal = item.base_price + featuresCost;
            return (
              <div key={item.template_id} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-foreground">{item.template_name}</span>
                  <span>Rp {itemTotal.toLocaleString("id-ID")}</span>
                </div>
                {item.category && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{item.category}</span>
                )}
                {item.estimated_days && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Est. {item.estimated_days} hari kerja
                  </p>
                )}
                {item.selected_features.filter(f => f.price > 0).map((f) => (
                  <div key={f.id} className="flex justify-between text-xs text-muted-foreground pl-2">
                    <span>+ {f.name}</span>
                    <span>Rp {f.price.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">Rp {total.toLocaleString("id-ID")}</span>
        </div>

        <CheckoutTrustSignals />
      </div>
    </div>
  );
}
