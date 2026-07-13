'use client';

import { useState, useCallback } from 'react';
import type { ServiceTemplate } from '@/src/features/storefront/types';
import { TemplatesHero } from './TemplatesHero';
import { TemplateFilterSidebar } from './TemplateFilterSidebar';
import { TemplateCard } from './TemplateCard';

interface TemplatesClientProps {
  templates: ServiceTemplate[];
  categories: string[];
}

export function TemplatesClient({ templates, categories }: TemplatesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [deliveryFilter, setDeliveryFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [quickViewTarget, setQuickViewTarget] = useState<ServiceTemplate | null>(null);

  const clearFilters = useCallback(() => {
    setCategoryFilter([]);
    setDeliveryFilter([]);
    setPriceRange([0, 0]);
  }, []);

  // Derive category counts from the server-provided templates
  const categoryCounts: Record<string, number> = {};
  for (const t of templates) {
    if (t.category) categoryCounts[t.category] = (categoryCounts[t.category] ?? 0) + 1;
  }

  // Client-side filter on top of server-fetched data
  const filtered = templates.filter((t) => {
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(t.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (categoryFilter.length > 0 && !categoryFilter.includes(t.category ?? '')) return false;
    if (priceRange[1] > 0 && (t.base_price < priceRange[0] || t.base_price > priceRange[1])) return false;
    if (deliveryFilter.length > 0 && t.estimated_days != null) {
      const d = t.estimated_days;
      const match = deliveryFilter.some((f) => {
        if (f === 'lt7') return d < 7;
        if (f === '7-14') return d >= 7 && d <= 14;
        if (f === '14-30') return d > 14 && d <= 30;
        if (f === '30+') return d > 30;
        return false;
      });
      if (!match) return false;
    }
    return true;
  });

  const priceExtent: [number, number] = templates.length > 0
    ? [Math.min(...templates.map((t) => t.base_price)), Math.max(...templates.map((t) => t.base_price))]
    : [0, 0];

  const activeFilterCount =
    categoryFilter.length + deliveryFilter.length + (priceRange[0] > 0 || priceRange[1] > 0 ? 1 : 0);

  // Suppress unused variable warning — quickViewTarget used for future QuickViewDialog
  void quickViewTarget;

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
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>Belum ada template tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t, i) => (
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
