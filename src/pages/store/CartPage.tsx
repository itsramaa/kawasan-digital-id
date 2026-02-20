import { Link } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useCart } from "@/features/storefront/hooks/useCart";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

export default function CartPage() {
  const { items, removeItem, totalPrice } = useCart();
  const { user } = useAuth();

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link
              to="/store/templates"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              Browse Templates
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const featuresCost = item.selected_features.reduce((s, f) => s + f.price, 0);
                const itemTotal = item.base_price + featuresCost;
                return (
                  <div key={item.template_id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                          {item.category || "Template"}
                        </span>
                        <h3 className="font-semibold text-foreground">{item.template_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Base: Rp {item.base_price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.template_id)}
                        className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.selected_features.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {item.selected_features.map((f) => (
                          <div key={f.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">+ {f.name}</span>
                            <span>Rp {f.price.toLocaleString("id-ID")}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-border flex justify-between font-semibold text-sm">
                      <span>Subtotal</span>
                      <span className="text-primary">Rp {itemTotal.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary sidebar */}
            <div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 lg:sticky lg:top-24">
                <h3 className="font-semibold text-foreground">Cart Summary</h3>
                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.template_id} className="flex justify-between">
                      <span className="text-muted-foreground truncate mr-2">{item.template_name}</span>
                      <span className="whitespace-nowrap">
                        Rp {(item.base_price + item.selected_features.reduce((s, f) => s + f.price, 0)).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <Link
                  to={user ? "/store/checkout" : `/login?redirect=${encodeURIComponent("/store/checkout")}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  {user ? "Proceed to Checkout" : "Login to Checkout"} <ArrowRight className="w-4 h-4" />
                </Link>
                {!user && (
                  <p className="text-xs text-muted-foreground text-center">
                    Cart items will be saved when you log in.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
