import { useState } from "react";
import { Link } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useCart } from "@/features/storefront/hooks/useCart";
import { Trash2, ShoppingBag, ArrowRight, Pencil, Clock, Tag } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";

export default function CartPage() {
  const { items, removeItem, totalPrice } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    toast.info("Coupon feature coming soon!");
  };

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <h1 className="text-2xl font-bold text-foreground">
          Shopping Cart{items.length > 0 && ` (${items.length} item${items.length > 1 ? "s" : ""})`}
        </h1>

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
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        {item.thumbnail_url ? (
                          <img src={item.thumbnail_url} alt={item.template_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                              {item.category || "Template"}
                            </span>
                            <h3 className="font-semibold text-foreground">{item.template_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Base: Rp {item.base_price.toLocaleString("id-ID")}
                            </p>
                            {item.estimated_days && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {item.estimated_days} hari pengerjaan
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/store/templates/${item.template_id}`}
                              className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
                              title="Edit Add-ons"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => removeItem(item.template_id)}
                              className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

                {/* Coupon */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      Apply
                    </button>
                  </div>
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
