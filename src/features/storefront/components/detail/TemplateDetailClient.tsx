'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { ServiceTemplate, TemplateFeature } from '@/src/features/storefront/types';
import { useCart } from '@/src/features/storefront/hooks/useCart';
import { DetailBreadcrumb } from './DetailBreadcrumb';
import { DetailGallery } from './DetailGallery';
import { DetailInfoPanel } from './DetailInfoPanel';
import { PackageIncludes } from './PackageIncludes';
import { InfraAddOns } from './InfraAddOns';
import { WhyChooseSection } from './WhyChooseSection';
import { ScopeCustomization } from './ScopeCustomization';
import { DetailFAQ } from './DetailFAQ';
import { RelatedTemplates } from './RelatedTemplates';
import type { StoreFAQ } from '@/src/features/storefront/types';

interface TemplateDetailClientProps {
  template: ServiceTemplate;
  related: ServiceTemplate[];
  features?: TemplateFeature[];
  infraAddOns?: TemplateFeature[];
  scopeAddOns?: TemplateFeature[];
  faqs?: StoreFAQ[];
}

export function TemplateDetailClient({
  template,
  related,
  features = [],
  infraAddOns = [],
  scopeAddOns = [],
  faqs = [],
}: TemplateDetailClientProps) {
  const [selectedInfraIds, setSelectedInfraIds] = useState<Set<string>>(new Set());
  const [selectedScopeIds, setSelectedScopeIds] = useState<Set<string>>(new Set());

  const selectedInfra = infraAddOns.filter((f) => selectedInfraIds.has(f.id));
  const selectedScope = scopeAddOns.filter((f) => selectedScopeIds.has(f.id));
  const totalPrice =
    template.base_price +
    selectedInfra.reduce((s, f) => s + f.price, 0) +
    selectedScope.reduce((s, f) => s + f.price, 0);

  function toggleSet(prev: Set<string>, id: string): Set<string> {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  }

  const router = useRouter();
  const { addItem } = useCart();

  function buildCartItem() {
    return {
      template_id: template.id,
      template_name: template.name,
      base_price: totalPrice,
      category: template.category ?? '',
      thumbnail_url: template.thumbnail_url ?? null,
      estimated_days: template.estimated_days ?? null,
      selected_features: [...selectedScope, ...selectedInfra].map((f) => ({
        id: f.id,
        name: f.name,
        price: f.price,
      })),
    };
  }

  function handleAddToCart() {
    addItem(buildCartItem());
    toast.success('Ditambahkan ke keranjang!');
  }

  function handleCheckout() {
    addItem(buildCartItem());
    router.push('/checkout');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <DetailBreadcrumb category={template.category} templateName={template.name} />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <DetailGallery template={template} galleryImages={template.gallery_images} />
          <PackageIncludes features={features} />
          <InfraAddOns
            addOns={infraAddOns}
            selectedIds={selectedInfraIds}
            onToggle={(id: string) => setSelectedInfraIds((prev) => toggleSet(prev, id))}
          />
          <WhyChooseSection />
          <ScopeCustomization
            addOns={scopeAddOns}
            selectedIds={selectedScopeIds}
            onToggle={(id: string) => setSelectedScopeIds((prev) => toggleSet(prev, id))}
          />
          {/* TODO: DetailFAQ expects StoreFAQ[] — cast as any until prop type is updated */}
          <DetailFAQ faqs={faqs as any} />
          <RelatedTemplates templates={related} />
        </div>
        <div className="lg:col-span-1">
          <DetailInfoPanel
            template={template}
            selectedScope={selectedScope}
            selectedInfra={selectedInfra}
            totalPrice={totalPrice}
            onAddToCart={handleAddToCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
