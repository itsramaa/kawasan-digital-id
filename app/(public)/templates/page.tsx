'use client'

export const dynamic = 'force-dynamic';
// TODO: Replace with real data fetching via Server Actions / Prisma
import { useState, useCallback } from 'react';
import type { ServiceTemplate } from '@/src/features/storefront/types';
import { TemplatesHero } from '@/src/features/storefront/components/templates/TemplatesHero';
import { TemplateFilterSidebar } from '@/src/features/storefront/components/templates/TemplateFilterSidebar';
import { TemplateCard } from '@/src/features/storefront/components/templates/TemplateCard';

function noop() {}

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [deliveryFilter, setDeliveryFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [quickViewTarget, setQuickViewTarget] = useState<ServiceTemplate | null>(null);

  // TODO: fetch templates from Server Action
  const templates: ServiceTemplate[] = [];
  const categories: string[] = [];
  const categoryCounts: Record<string, number> = {};

  const clearFilters = useCallback(() => {
    setCategoryFilter([]);
    setDeliveryFilter([]);
    setPriceRange([0, 0]);
  }, []);

  const activeFilterCount = categoryFilter.length + deliveryFilter.length + (priceRange[0] > 0 || priceRange[1] > 0 ? 1 : 0);
  const priceExtent: [number, number] = [0, 0];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <TemplatesHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalTemplates={templates.length}
        totalCategories={categories.length}
      />
      <div className="flex gap-8 mt-8">
        <TemplateFilterSidebar
          categories={categories}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          deliveryFilter={deliveryFilter}
          setDeliveryFilter={setDeliveryFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          priceExtent={priceExtent}
          activeFilterCount={activeFilterCount}
          clearFilters={clearFilters}
          categoryCounts={categoryCounts}
        />
        <div className="flex-1">
          {templates.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>Belum ada template tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((t, i) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  index={i}
                  onQuickView={setQuickViewTarget}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
