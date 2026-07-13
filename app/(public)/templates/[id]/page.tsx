'use client'

export const dynamic = 'force-dynamic';
// TODO: Replace with real data fetching via Server Actions / Prisma
import { useState } from 'react';
import { use } from 'react';
import type { ServiceTemplate, TemplateFeature, StoreFAQ } from '@/src/features/storefront/types';
import { DetailBreadcrumb } from '@/src/features/storefront/components/detail/DetailBreadcrumb';
import { DetailGallery } from '@/src/features/storefront/components/detail/DetailGallery';
import { DetailInfoPanel } from '@/src/features/storefront/components/detail/DetailInfoPanel';
import { PackageIncludes } from '@/src/features/storefront/components/detail/PackageIncludes';
import { InfraAddOns } from '@/src/features/storefront/components/detail/InfraAddOns';
import { WhyChooseSection } from '@/src/features/storefront/components/detail/WhyChooseSection';
import { ScopeCustomization } from '@/src/features/storefront/components/detail/ScopeCustomization';
import { DetailFAQ } from '@/src/features/storefront/components/detail/DetailFAQ';
import { RelatedTemplates } from '@/src/features/storefront/components/detail/RelatedTemplates';

interface Props {
  params: Promise<{ id: string }>;
}

export default function TemplateDetailPage({ params }: Props) {
  const { id } = use(params);

  const [selectedInfraIds, setSelectedInfraIds] = useState<Set<string>>(new Set());
  const [selectedScopeIds, setSelectedScopeIds] = useState<Set<string>>(new Set());

  // TODO: fetch template + features from Prisma server action
  const template: ServiceTemplate = {
    id,
    name: 'Template',
    description: null,
    thumbnail_url: null,
    category: null,
    base_price: 0,
    estimated_days: null,
    is_active: true,
    is_featured: false,
    display_order: 0,
    created_at: new Date().toISOString(),
    demo_url: null,
    revision_limit: null,
    gallery_images: [],
  };

  const features: TemplateFeature[] = [];
  const infraAddOns: TemplateFeature[] = [];
  const scopeAddOns: TemplateFeature[] = [];
  const faqs: StoreFAQ[] = [];

  const selectedInfra = infraAddOns.filter((f) => selectedInfraIds.has(f.id));
  const selectedScope = scopeAddOns.filter((f) => selectedScopeIds.has(f.id));
  const totalPrice = template.base_price +
    selectedInfra.reduce((s, f) => s + f.price, 0) +
    selectedScope.reduce((s, f) => s + f.price, 0);

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
            onToggle={(id: string) =>
              setSelectedInfraIds((prev) => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
              })
            }
          />
          <WhyChooseSection />
          <ScopeCustomization
            addOns={scopeAddOns}
            selectedIds={selectedScopeIds}
            onToggle={(id: string) =>
              setSelectedScopeIds((prev) => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
              })
            }
          />
          <DetailFAQ faqs={faqs} />
          <RelatedTemplates templates={[]} />
        </div>
        <div className="lg:col-span-1">
          <DetailInfoPanel
            template={template}
            selectedScope={selectedScope}
            selectedInfra={selectedInfra}
            totalPrice={totalPrice}
            onAddToCart={() => { /* TODO: wire cart */ }}
            onCheckout={() => { /* TODO: wire checkout */ }}
          />
        </div>
      </div>
    </div>
  );
}
