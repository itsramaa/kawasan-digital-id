import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useServiceTemplates } from "@/features/storefront/hooks/useServiceTemplates";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { useWishlist } from "@/features/storefront/hooks/useWishlist";
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, List, Sparkles, Search as SearchIcon, Heart } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { ServiceTemplate } from "@/features/storefront/types";

import { TemplatesHero } from "@/features/storefront/components/templates/TemplatesHero";
import { TemplateFilterSidebar } from "@/features/storefront/components/templates/TemplateFilterSidebar";
import { TemplateCard } from "@/features/storefront/components/templates/TemplateCard";
import { TemplateListItem } from "@/features/storefront/components/templates/TemplateListItem";
import { QuickViewDialog } from "@/features/storefront/components/templates/QuickViewDialog";

type SortOption = "popular" | "newest" | "price-asc" | "price-desc";

const DELIVERY_TESTS: Record<string, (d: number) => boolean> = {
  lt7: (d) => d < 7,
  "7-14": (d) => d >= 7 && d <= 14,
  "14-30": (d) => d > 14 && d <= 30,
  "30+": (d) => d > 30,
};

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
];

export default function TemplatesPage() {
  const { data: templates, isLoading } = useServiceTemplates();
  const { toggle: toggleWishlist, has: isWishlisted, count: wishlistCount } = useWishlist();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [categoryFilter, setCategoryFilter] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [deliveryFilter, setDeliveryFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100_000_000]);
  const [quickViewTemplate, setQuickViewTemplate] = useState<ServiceTemplate | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal(0.05);

  const categories = useMemo(
    () => [...new Set(templates?.map((t) => t.category).filter(Boolean) as string[])],
    [templates]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    templates?.forEach((t) => { if (t.category) counts[t.category] = (counts[t.category] || 0) + 1; });
    return counts;
  }, [templates]);

  const priceExtent = useMemo(() => {
    if (!templates?.length) return [0, 100_000_000] as [number, number];
    const prices = templates.map((t) => t.base_price);
    return [Math.min(...prices), Math.max(...prices)] as [number, number];
  }, [templates]);

  const filtered = useMemo(() => {
    if (!templates) return [];
    let result = [...templates];

    // Wishlist filter
    if (showWishlistOnly) {
      result = result.filter((t) => isWishlisted(t.id));
    }
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) =>
        t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter.length > 0) {
      result = result.filter((t) => t.category && categoryFilter.includes(t.category));
    }
    if (priceRange[0] > priceExtent[0] || priceRange[1] < priceExtent[1]) {
      result = result.filter((t) => t.base_price >= priceRange[0] && t.base_price <= priceRange[1]);
    }
    if (deliveryFilter.length > 0) {
      result = result.filter((t) => {
        if (!t.estimated_days) return false;
        return deliveryFilter.some((df) => DELIVERY_TESTS[df]?.(t.estimated_days!));
      });
    }

    switch (sortBy) {
      case "newest": result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case "price-asc": result.sort((a, b) => a.base_price - b.base_price); break;
      case "price-desc": result.sort((a, b) => b.base_price - a.base_price); break;
      default: result.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    }
    return result;
  }, [templates, categoryFilter, priceRange, priceExtent, deliveryFilter, sortBy, searchQuery, showWishlistOnly, isWishlisted]);

  const activeFilterCount = categoryFilter.length + deliveryFilter.length + (priceRange[0] > priceExtent[0] || priceRange[1] < priceExtent[1] ? 1 : 0);

  const clearFilters = () => {
    setCategoryFilter([]);
    setDeliveryFilter([]);
    setPriceRange(priceExtent);
  };

  const removeChip = (type: "category" | "delivery", val: string) => {
    if (type === "category") setCategoryFilter((p) => p.filter((v) => v !== val));
    else setDeliveryFilter((p) => p.filter((v) => v !== val));
  };

  const filterSidebarProps = {
    categories, categoryFilter, setCategoryFilter,
    deliveryFilter, setDeliveryFilter,
    priceRange, setPriceRange, priceExtent,
    activeFilterCount, clearFilters, categoryCounts,
  };

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Hero */}
        <TemplatesHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalTemplates={templates?.length ?? 0}
          totalCategories={categories.length}
        />

        {/* Top Bar: filters + chips + sort + view toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter
                    {activeFilterCount > 0 && (
                      <span className="flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full min-w-[18px] h-[18px]">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                  <div className="mt-6"><TemplateFilterSidebar {...filterSidebarProps} /></div>
                </SheetContent>
              </Sheet>
            )}
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> templates
            </p>

            {/* Active filter chips */}
            {categoryFilter.map((c) => (
              <button key={c} onClick={() => removeChip("category", c)}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                {c} <X className="w-3 h-3" />
              </button>
            ))}
            {deliveryFilter.map((d) => (
              <button key={d} onClick={() => removeChip("delivery", d)}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium hover:bg-secondary/20 transition-colors"
              >
                {d} <X className="w-3 h-3" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Wishlist toggle */}
            <button
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                showWishlistOnly
                  ? "border-red-500/30 bg-red-500/10 text-red-600"
                  : "border-border hover:bg-muted text-muted-foreground"
              )}
            >
              <Heart className={cn("w-4 h-4", showWishlistOnly && "fill-current")} />
              {wishlistCount > 0 && (
                <span className="text-xs">{wishlistCount}</span>
              )}
            </button>
            {/* View toggle */}
            {!isMobile && (
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn("p-2 transition-colors", viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
                <ChevronDown className="w-4 h-4" />
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[180px]">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors",
                          sortBy === opt.value && "text-primary font-medium"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className="w-60 shrink-0 sticky top-24 self-start space-y-6">
              <TemplateFilterSidebar {...filterSidebarProps} />
            </aside>
          )}

          {/* Content */}
          <div className="flex-1" ref={gridRef}>
            {isLoading ? (
              <div className={cn(
                viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"
              )}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  viewMode === "grid" ? (
                    <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                      <Skeleton className="aspect-video w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-6 w-1/3" />
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex gap-5 rounded-xl border border-border bg-card overflow-hidden">
                      <Skeleton className="w-56 h-36 shrink-0" />
                      <div className="flex-1 py-4 pr-4 space-y-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-1/3" />
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : filtered.length > 0 ? (
              gridVisible && (
                viewMode === "grid" ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((template, idx) => (
                      <TemplateCard key={template.id} template={template} index={idx} onQuickView={setQuickViewTemplate} isWishlisted={isWishlisted(template.id)} onToggleWishlist={toggleWishlist} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filtered.map((template, idx) => (
                      <TemplateListItem key={template.id} template={template} index={idx} onQuickView={setQuickViewTemplate} isWishlisted={isWishlisted(template.id)} onToggleWishlist={toggleWishlist} />
                    ))}
                  </div>
                )
              )
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <SearchIcon className="w-8 h-8 opacity-40" />
                </div>
                <p className="text-lg font-medium text-foreground mb-1">Tidak ada template ditemukan</p>
                <p className="text-sm">Coba ubah filter atau kata kunci pencarian Anda.</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="mt-3 text-sm text-primary hover:underline">
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View */}
      <QuickViewDialog template={quickViewTemplate} onClose={() => setQuickViewTemplate(null)} />
    </StorefrontLayout>
  );
}
