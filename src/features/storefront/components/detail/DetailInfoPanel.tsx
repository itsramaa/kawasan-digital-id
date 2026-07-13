import { Clock, RefreshCw, ArrowRight, ShoppingCart, Star, ShieldCheck, Undo2 } from "lucide-react";
import type { ServiceTemplate, TemplateFeature } from "../../types";

interface DetailInfoPanelProps {
  template: ServiceTemplate;
  selectedScope: TemplateFeature[];
  selectedInfra: TemplateFeature[];
  totalPrice: number;
  onAddToCart: () => void;
  onCheckout: () => void;
}

export function DetailInfoPanel({
  template,
  selectedScope,
  selectedInfra,
  totalPrice,
  onAddToCart,
  onCheckout,
}: DetailInfoPanelProps) {
  const hintPrice = Math.round(template.base_price * 1.25);

  return (
    <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start space-y-5">
      <div className="space-y-2">
        <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
          {template.category || "Template"}
        </span>
        <h1 className="text-2xl font-bold text-foreground">{template.name}</h1>
        <p className="text-muted-foreground text-sm">{template.description}</p>
      </div>

      {/* Star rating placeholder */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
        <span className="text-xs text-muted-foreground ml-1.5">(5.0)</span>
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-2xl font-bold text-primary">
          Rp {template.base_price.toLocaleString("id-ID")}
        </span>
        <span className="text-base text-muted-foreground line-through">
          Rp {hintPrice.toLocaleString("id-ID")}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {template.estimated_days && (
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {template.estimated_days} hari</span>
        )}
        {template.revision_limit && (
          <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4" /> {template.revision_limit} revisi</span>
        )}
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" /> Garansi Uang Kembali
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
          <Undo2 className="w-3.5 h-3.5" /> Revisi Gratis
        </span>
      </div>

      {/* Order Summary */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Template Base</span>
            <span>Rp {template.base_price.toLocaleString("id-ID")}</span>
          </div>
          {selectedScope.length > 0 && (
            <>
              <p className="text-xs font-medium text-muted-foreground pt-1">Scope Add-Ons</p>
              {selectedScope.map((f) => (
                <div key={f.id} className="flex justify-between pl-2">
                  <span className="text-muted-foreground">{f.name}</span>
                  <span>+Rp {f.price.toLocaleString("id-ID")}</span>
                </div>
              ))}
            </>
          )}
          {selectedInfra.length > 0 && (
            <>
              <p className="text-xs font-medium text-muted-foreground pt-1">Infrastructure</p>
              {selectedInfra.map((f) => (
                <div key={f.id} className="flex justify-between pl-2">
                  <span className="text-muted-foreground">{f.name}</span>
                  <span>+Rp {f.price.toLocaleString("id-ID")}</span>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="border-t border-border pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">Rp {totalPrice.toLocaleString("id-ID")}</span>
        </div>
        <div className="space-y-2">
          <button
            onClick={onAddToCart}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
          <button
            onClick={onCheckout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Checkout Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
