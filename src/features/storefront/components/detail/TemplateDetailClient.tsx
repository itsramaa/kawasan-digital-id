'use client';

import { useState } from 'react';
import type { ServiceTemplate, TemplateFeature } from '@/src/features/storefront/types';
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
            onAddToCart={() => {
              /* TODO: wire cart */
            }}
            onCheckout={() => {
              /* TODO: wire checkout */
            }}
          />
        </div>
      </div>
    </div>
  );
}
