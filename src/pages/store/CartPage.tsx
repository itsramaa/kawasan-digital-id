import { useState } from "react";
import { Link } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useCart } from "@/features/storefront/hooks/useCart";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import {
  Trash2, ShoppingBag, ArrowRight, Pencil, Clock, Tag,
  Shield, Award, Headphones, Check, Sparkles, Layout, Globe,
  ChevronRight, Home, MessageCircle,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export default function CartPage() {
  const { items, removeItem, totalPrice } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState("");

  const heroReveal = useScrollReveal();
  const contentReveal = useScrollReveal();
  const crossSellReveal = useScrollReveal();

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    toast.info("Fitur kupon segera hadir!");
  };

  const totalEstDays = items.reduce((max, item) => {
    if (item.estimated_days && item.estimated_days > max) return item.estimated_days;
    return max;
  }, 0);

  const totalBase = items.reduce((s, i) => s + i.base_price, 0);
  const totalAddons = items.reduce(
    (s, i) => s + i.selected_features.reduce((fs, f) => fs + f.price, 0), 0
  );

  return (
    <StorefrontLayout>
      {/* Hero */}
      <section
        ref={heroReveal.ref}
        className={`bg-gradient-to-br from-primary/5 via-transparent to-primary/3 border-b border-border transition-all duration-700 ${heroReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1"><Home className="w-3 h-3" /> Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Keranjang</span>
          </nav>
          <Badge variant="secondary" className="mb-3 gap-1.5">
            <ShoppingBag className="w-3 h-3" /> Shopping Cart
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {items.length === 0
              ? "Keranjang Belanja"
              : `${items.length} Layanan Siap Dipesan`}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {items.length === 0
              ? "Keranjang Anda masih kosong. Jelajahi layanan kami!"
              : "Tinjau pesanan Anda sebelum melanjutkan ke checkout."}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
        {items.length === 0 ? (
          /* ─── Empty State ─── */
          <div
            ref={contentReveal.ref}
            className={`text-center py-16 space-y-6 transition-all duration-700 ${contentReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
              <ShoppingBag className="w-10 h-10 text-primary/50" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Belum Ada Item</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                Mulai jelajahi template website profesional atau buat website custom sesuai kebutuhan bisnis Anda.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
              {[
                { to: "/templates", icon: Layout, title: "Template Website", desc: "Siap pakai, cepat online" },
                { to: "/custom", icon: Globe, title: "Custom Website", desc: "Desain sesuai keinginan" },
              ].map((card) => (
                <Link
                  key={card.to}
                  to={card.to}
                  className="group rounded-xl border border-border bg-card p-5 text-left hover:border-primary/30 hover:shadow-md transition-all duration-300"
                >
                  <card.icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-sm text-foreground">{card.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* ─── Cart Content ─── */
          <div
            ref={contentReveal.ref}
            className={`grid lg:grid-cols-3 gap-8 transition-all duration-700 ${contentReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <TooltipProvider>
                {items.map((item, idx) => {
                  const featuresCost = item.selected_features.reduce((s, f) => s + f.price, 0);
                  const itemTotal = item.base_price + featuresCost;
                  return (
                    <div
                      key={item.template_id}
                      className="group rounded-xl border border-border bg-card p-5 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt={item.template_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-7 h-7 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1.5">
                              <Badge variant="secondary" className="text-[10px] px-2 py-0">
                                {item.category || "Template"}
                              </Badge>
                              <h3 className="font-semibold text-foreground">{item.template_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Base: Rp {item.base_price.toLocaleString("id-ID")}
                              </p>
                              {item.estimated_days && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-primary/60" /> Est. {item.estimated_days} hari
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    to={`/templates/${item.template_id}`}
                                    className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>Edit Add-ons</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => removeItem(item.template_id)}
                                    className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Hapus dari keranjang</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>

                          {item.selected_features.length > 0 && (
                            <div className="mt-3 space-y-1">
                              {item.selected_features.map((f) => (
                                <div key={f.id} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground flex items-center gap-1.5">
                                    <Check className="w-3 h-3 text-primary/60" /> {f.name}
                                  </span>
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
              </TooltipProvider>
            </div>

            {/* ─── Summary Sidebar ─── */}
            <div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 lg:sticky lg:top-24 relative overflow-hidden">
                {/* accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

                <h3 className="font-semibold text-foreground pt-1">Ringkasan Pesanan</h3>

                {/* Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Harga dasar ({items.length} item)</span>
                    <span>Rp {totalBase.toLocaleString("id-ID")}</span>
                  </div>
                  {totalAddons > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Add-on / Fitur tambahan</span>
                      <span>Rp {totalAddons.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                  {totalEstDays > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Est. pengerjaan</span>
                      <span>{totalEstDays} hari</span>
                    </div>
                  )}
                </div>

                {/* Coupon */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Kode Kupon
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Masukkan kode"
                      className="flex-1 min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      Pakai
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>

                {/* CTA */}
                <Link
                  to={user ? "/checkout" : `/login?redirect=${encodeURIComponent("/checkout")}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  {user ? "Lanjut ke Checkout" : "Login untuk Checkout"} <ArrowRight className="w-4 h-4" />
                </Link>
                {!user && (
                  <p className="text-xs text-muted-foreground text-center">
                    Item keranjang akan tersimpan saat Anda login.
                  </p>
                )}
                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                  <MessageCircle className="w-3 h-3" /> Gratis konsultasi sebelum mulai
                </p>

                {/* Trust Signals */}
                <div className="border-t border-border pt-3 space-y-2">
                  {[
                    { icon: Shield, text: "Pembayaran Aman & Terverifikasi" },
                    { icon: Award, text: "Garansi Revisi" },
                    { icon: Headphones, text: "Support 24/7" },
                  ].map((t) => (
                    <div key={t.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <t.icon className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                      <span>{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Cross-sell ─── */}
        {items.length > 0 && (
          <section
            ref={crossSellReveal.ref}
            className={`mt-12 pt-8 border-t border-border transition-all duration-700 ${crossSellReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Mungkin Anda Tertarik</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Tingkatkan project Anda dengan layanan tambahan.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { to: "/templates", icon: Layout, title: "Jelajahi Template Lain", desc: "Temukan template profesional untuk kebutuhan lainnya." },
                { to: "/custom", icon: Globe, title: "Buat Website Custom", desc: "Butuh sesuatu yang unik? Buat dari nol sesuai visi Anda." },
              ].map((card) => (
                <Link
                  key={card.to}
                  to={card.to}
                  className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <card.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{card.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </StorefrontLayout>
  );
}
