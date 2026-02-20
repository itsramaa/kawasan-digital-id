import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useTemplateDetail } from "@/features/storefront/hooks/useTemplateDetail";
import { useRelatedTemplates } from "@/features/storefront/hooks/useRelatedTemplates";
import { useFAQs } from "@/features/storefront/hooks/useFAQs";
import { useCart } from "@/features/storefront/hooks/useCart";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import {
  Check, Clock, ArrowRight, Sparkles, ShoppingCart,
  ExternalLink, Monitor, Smartphone, RefreshCw, ChevronLeft
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/utils/utils";

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { template, features, isLoading } = useTemplateDetail(id);
  const { addItem } = useCart();
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState(0);
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");

  const { data: relatedTemplates } = useRelatedTemplates(template?.category, template?.id);
  const { data: faqs } = useFAQs(5);

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 aspect-video bg-muted rounded-xl" />
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-10 bg-muted rounded" />)}
              </div>
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (!template) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 text-center text-muted-foreground">
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
  const scopeAddOns = features.filter((f) => !f.is_included && (f.category === "scope" || !f.category));
  const infraAddOns = features.filter((f) => !f.is_included && f.category === "infra");
  const selectedScope = scopeAddOns.filter((f) => selectedFeatureIds.has(f.id));
  const selectedInfra = infraAddOns.filter((f) => selectedFeatureIds.has(f.id));
  const scopeCost = selectedScope.reduce((sum, f) => sum + f.price, 0);
  const infraCost = selectedInfra.reduce((sum, f) => sum + f.price, 0);
  const totalPrice = template.base_price + scopeCost + infraCost;

  const galleryImages: string[] = (template.gallery_images as string[] | undefined)?.length
    ? (template.gallery_images as string[])
    : template.thumbnail_url
      ? [template.thumbnail_url]
      : [];

  const handleAddToCart = async () => {
    const allSelected = [...selectedScope, ...selectedInfra];
    await addItem({
      template_id: template.id,
      template_name: template.name,
      base_price: template.base_price,
      selected_features: allSelected.map((f) => ({ id: f.id, name: f.name, price: f.price })),
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
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10">
        {/* Breadcrumb */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Templates
        </button>

        {/* A. Preview + Info */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Gallery */}
          <div className="lg:col-span-3 space-y-3">
            <div className={cn(
              "rounded-xl bg-muted overflow-hidden flex items-center justify-center border border-border",
              devicePreview === "mobile" ? "max-w-xs mx-auto aspect-[9/16]" : "aspect-video"
            )}>
              {galleryImages.length > 0 ? (
                <img src={galleryImages[selectedImage]} alt={template.name} className="w-full h-full object-cover" />
              ) : (
                <Sparkles className="w-16 h-16 text-muted-foreground/30" />
              )}
            </div>
            {/* Thumbnails + controls */}
            <div className="flex items-center gap-3">
              <div className="flex gap-2 flex-1 overflow-x-auto">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-colors",
                      selectedImage === i ? "border-primary" : "border-border hover:border-primary/40"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
                <button
                  onClick={() => setDevicePreview("desktop")}
                  className={cn("p-1.5 rounded-md transition-colors", devicePreview === "desktop" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevicePreview("mobile")}
                  className={cn("p-1.5 rounded-md transition-colors", devicePreview === "mobile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
            {template.demo_url && (
              <a
                href={template.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" /> View Live Demo
              </a>
            )}
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-2 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                {template.category || "Template"}
              </span>
              <h1 className="text-2xl font-bold text-foreground">{template.name}</h1>
              <p className="text-muted-foreground text-sm">{template.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-2xl font-bold text-primary">
                Rp {template.base_price.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {template.estimated_days && (
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {template.estimated_days} hari</span>
              )}
              {template.revision_limit && (
                <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4" /> {template.revision_limit} revisi</span>
              )}
            </div>

            {/* Sticky Order Summary (appears on mobile below, sticky on desktop) */}
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

        {/* B. Package Includes */}
        {includedFeatures.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Package Includes</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {includedFeatures.map((f) => (
                <div key={f.id} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.name}</p>
                    {f.description && <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* C. Scope Customization */}
        {scopeAddOns.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Scope Customization</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {scopeAddOns.map((f) => (
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
          </section>
        )}

        {/* D. Infrastructure Add-Ons */}
        {infraAddOns.length > 0 && (
          <section className="space-y-4 p-6 rounded-xl bg-muted/50 border border-border">
            <h2 className="text-xl font-bold text-foreground">Infrastructure Add-Ons</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {infraAddOns.map((f) => (
                <label
                  key={f.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 cursor-pointer transition-colors"
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
          </section>
        )}

        {/* F. FAQ */}
        {faqs && faqs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* G. Related Templates */}
        {relatedTemplates && relatedTemplates.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Related Templates</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTemplates.map((t) => (
                <Link
                  key={t.id}
                  to={`/store/templates/${t.id}`}
                  className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {t.thumbnail_url ? (
                      <img src={t.thumbnail_url} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles className="w-8 h-8 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{t.name}</h3>
                    <span className="text-sm font-bold text-primary">Rp {t.base_price.toLocaleString("id-ID")}</span>
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
