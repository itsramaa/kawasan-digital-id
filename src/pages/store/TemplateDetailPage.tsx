import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useTemplateDetail } from "@/features/storefront/hooks/useTemplateDetail";
import { useCart } from "@/features/storefront/hooks/useCart";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Check, Clock, ArrowRight, Sparkles, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { template, features, isLoading } = useTemplateDetail(id);
  const { addItem } = useCart();
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(new Set());

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-muted rounded" />)}
              </div>
              <div className="h-60 bg-muted rounded" />
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (!template) {
    return (
      <StorefrontLayout>
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-20 text-center text-muted-foreground">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Template not found.</p>
        </div>
      </StorefrontLayout>
    );
  }

  const toggleFeature = (fId: string) => {
    setSelectedFeatureIds((prev) => {
      const next = new Set(prev);
      next.has(fId) ? next.delete(fId) : next.add(fId);
      return next;
    });
  };

  const includedFeatures = features.filter((f) => f.is_included);
  const optionalFeatures = features.filter((f) => !f.is_included);
  const selectedOptional = optionalFeatures.filter((f) => selectedFeatureIds.has(f.id));
  const additionalCost = selectedOptional.reduce((sum, f) => sum + f.price, 0);
  const totalPrice = template.base_price + additionalCost;

  const handleAddToCart = async () => {
    await addItem({
      template_id: template.id,
      template_name: template.name,
      base_price: template.base_price,
      selected_features: selectedOptional.map((f) => ({ id: f.id, name: f.name, price: f.price })),
      category: template.category,
    });
    toast.success("Added to cart!");
  };

  const handleProceedCheckout = () => {
    const params = new URLSearchParams({
      template_id: template.id,
      features: Array.from(selectedFeatureIds).join(","),
    });
    navigate(`/store/checkout?${params.toString()}`);
  };

  return (
    <StorefrontLayout>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
            {template.category || "Template"}
          </span>
          <h1 className="text-3xl font-bold text-foreground">{template.name}</h1>
          <p className="text-muted-foreground max-w-2xl">{template.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <span className="text-xl font-bold text-primary">
              Mulai dari Rp {template.base_price.toLocaleString("id-ID")}
            </span>
            {template.estimated_days && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {template.estimated_days} hari
              </span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {includedFeatures.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Included Features</h2>
                <div className="space-y-2">
                  {includedFeatures.map((f) => (
                    <div key={f.id} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{f.name}</p>
                        {f.description && <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>}
                      </div>
                      <span className="ml-auto text-xs text-primary font-medium whitespace-nowrap">Included</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {optionalFeatures.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Optional Add-ons</h2>
                <div className="space-y-2">
                  {optionalFeatures.map((f) => (
                    <label
                      key={f.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedFeatureIds.has(f.id)}
                        onCheckedChange={() => toggleFeature(f.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{f.name}</p>
                        {f.description && <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>}
                      </div>
                      <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                        +Rp {f.price.toLocaleString("id-ID")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-semibold text-foreground">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{template.name}</span>
                  <span>Rp {template.base_price.toLocaleString("id-ID")}</span>
                </div>
                {selectedOptional.map((f) => (
                  <div key={f.id} className="flex justify-between">
                    <span className="text-muted-foreground">{f.name}</span>
                    <span>+Rp {f.price.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={handleProceedCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  Checkout Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
