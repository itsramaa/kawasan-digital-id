import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useTemplateDetail } from "@/features/storefront/hooks/useTemplateDetail";
import { useRelatedTemplates } from "@/features/storefront/hooks/useRelatedTemplates";
import { useFAQs } from "@/features/storefront/hooks/useFAQs";
import { useCart } from "@/features/storefront/hooks/useCart";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { DetailBreadcrumb } from "@/features/storefront/components/detail/DetailBreadcrumb";
import { DetailGallery } from "@/features/storefront/components/detail/DetailGallery";
import { DetailInfoPanel } from "@/features/storefront/components/detail/DetailInfoPanel";
import { PackageIncludes } from "@/features/storefront/components/detail/PackageIncludes";
import { ScopeCustomization } from "@/features/storefront/components/detail/ScopeCustomization";
import { InfraAddOns } from "@/features/storefront/components/detail/InfraAddOns";
import { WhyChooseSection } from "@/features/storefront/components/detail/WhyChooseSection";
import { DetailFAQ } from "@/features/storefront/components/detail/DetailFAQ";
import { RelatedTemplates } from "@/features/storefront/components/detail/RelatedTemplates";
import { DetailSkeleton } from "@/features/storefront/components/detail/DetailSkeleton";

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { template, features, isLoading } = useTemplateDetail(id);
  const { addItem } = useCart();
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(new Set());

  const { data: relatedTemplates } = useRelatedTemplates(template?.category, template?.id);
  const { data: faqs } = useFAQs(5);

  if (isLoading) {
    return (
      <StorefrontLayout>
        <DetailSkeleton />
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
      thumbnail_url: template.thumbnail_url ?? null,
      estimated_days: template.estimated_days ?? null,
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
        <DetailBreadcrumb category={template.category} templateName={template.name} />

        <div className="grid lg:grid-cols-5 gap-8">
          <DetailGallery template={template} galleryImages={galleryImages} />
          <DetailInfoPanel
            template={template}
            selectedScope={selectedScope}
            selectedInfra={selectedInfra}
            totalPrice={totalPrice}
            onAddToCart={handleAddToCart}
            onCheckout={handleProceedCheckout}
          />
        </div>

        <PackageIncludes features={includedFeatures} />

        <ScopeCustomization
          addOns={scopeAddOns}
          selectedIds={selectedFeatureIds}
          onToggle={toggleFeature}
        />

        <InfraAddOns
          addOns={infraAddOns}
          selectedIds={selectedFeatureIds}
          onToggle={toggleFeature}
        />

        <WhyChooseSection />

        {faqs && <DetailFAQ faqs={faqs} />}

        {relatedTemplates && <RelatedTemplates templates={relatedTemplates} />}
      </div>
    </StorefrontLayout>
  );
}
