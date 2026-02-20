import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useServiceTemplates } from "@/features/storefront/hooks/useServiceTemplates";
import { Sparkles, SlidersHorizontal, X, Clock, Eye, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Slider } from "@/shared/components/ui/slider";
import type { ServiceTemplate } from "@/features/storefront/types";

type SortOption = "popular" | "newest" | "price-asc" | "price-desc";

const DELIVERY_OPTIONS = [
  { label: "< 7 hari", value: "lt7", test: (d: number) => d < 7 },
  { label: "7–14 hari", value: "7-14", test: (d: number) => d >= 7 && d <= 14 },
  { label: "14–30 hari", value: "14-30", test: (d: number) => d > 14 && d <= 30 },
  { label: "30+ hari", value: "30+", test: (d: number) => d > 30 },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
];

export default function TemplatesPage() {
  const { data: templates, isLoading } = useServiceTemplates();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get("category");

  const [categoryFilter, setCategoryFilter] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [deliveryFilter, setDeliveryFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100_000_000]);
  const [quickViewTemplate, setQuickViewTemplate] = useState<ServiceTemplate | null>(null);
  const [sortOpen, setSortOpen] = useState(false);

  const categories = useMemo(
    () => [...new Set(templates?.map((t) => t.category).filter(Boolean) as string[])],
    [templates]
  );

  const priceExtent = useMemo(() => {
    if (!templates?.length) return [0, 100_000_000] as [number, number];
    const prices = templates.map((t) => t.base_price);
    return [Math.min(...prices), Math.max(...prices)] as [number, number];
  }, [templates]);

  const filtered = useMemo(() => {
    if (!templates) return [];
    let result = [...templates];

    if (categoryFilter.length > 0) {
      result = result.filter((t) => t.category && categoryFilter.includes(t.category));
    }
    if (priceRange[0] > priceExtent[0] || priceRange[1] < priceExtent[1]) {
      result = result.filter((t) => t.base_price >= priceRange[0] && t.base_price <= priceRange[1]);
    }
    if (deliveryFilter.length > 0) {
      result = result.filter((t) => {
        if (!t.estimated_days) return false;
        return deliveryFilter.some((df) => DELIVERY_OPTIONS.find((o) => o.value === df)?.test(t.estimated_days!));
      });
    }

    switch (sortBy) {
      case "newest": result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case "price-asc": result.sort((a, b) => a.base_price - b.base_price); break;
      case "price-desc": result.sort((a, b) => b.base_price - a.base_price); break;
      default: result.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    }
    return result;
  }, [templates, categoryFilter, priceRange, priceExtent, deliveryFilter, sortBy]);

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const activeFilterCount = categoryFilter.length + deliveryFilter.length + (priceRange[0] > priceExtent[0] || priceRange[1] < priceExtent[1] ? 1 : 0);

  const clearFilters = () => {
    setCategoryFilter([]);
    setDeliveryFilter([]);
    setPriceRange(priceExtent);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Price Range</h3>
        <Slider
          min={priceExtent[0]}
          max={priceExtent[1]}
          step={100000}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Rp {priceRange[0].toLocaleString("id-ID")}</span>
          <span>Rp {priceRange[1].toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={categoryFilter.includes(cat)}
                onCheckedChange={() => setCategoryFilter(toggleArray(categoryFilter, cat))}
              />
              <span className="text-sm text-foreground">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Delivery Time */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Delivery Time</h3>
        <div className="space-y-2">
          {DELIVERY_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={deliveryFilter.includes(opt.value)}
                onCheckedChange={() => setDeliveryFilter(toggleArray(deliveryFilter, opt.value))}
              />
              <span className="text-sm text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearFilters} className="text-sm text-primary hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">Choose a template and customize it to fit your needs</p>
        </div>

        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">{filterContent}</div>
                </SheetContent>
              </Sheet>
            )}
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> templates
            </p>
          </div>

          {/* Sort Dropdown */}
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

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className="w-60 shrink-0 space-y-6">
              {filterContent}
            </aside>
          )}

          {/* Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-xl border border-border bg-card animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-20" />
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-6 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((template) => (
                  <div
                    key={template.id}
                    className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="aspect-video bg-muted flex items-center justify-center relative">
                      {template.thumbnail_url ? (
                        <img src={template.thumbnail_url} alt={template.name} className="w-full h-full object-cover" />
                      ) : (
                        <Sparkles className="w-10 h-10 text-muted-foreground/40" />
                      )}
                      {/* Quick View overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => { e.preventDefault(); setQuickViewTemplate(template); }}
                          className="px-3 py-1.5 rounded-lg bg-white/90 text-foreground text-xs font-medium flex items-center gap-1 hover:bg-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Quick View
                        </button>
                        <Link
                          to={`/store/templates/${template.id}`}
                          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 hover:bg-primary/90 transition-colors"
                        >
                          Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                    <Link to={`/store/templates/${template.id}`} className="block p-4 space-y-2">
                      <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                        {template.category || "Template"}
                      </span>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{template.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-lg font-bold text-primary">
                          Rp {template.base_price.toLocaleString("id-ID")}
                        </span>
                        {template.estimated_days && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {template.estimated_days} hari
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No templates match your filters.</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="mt-2 text-sm text-primary hover:underline">
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Dialog */}
      <Dialog open={!!quickViewTemplate} onOpenChange={(open) => !open && setQuickViewTemplate(null)}>
        <DialogContent className="max-w-lg">
          {quickViewTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>{quickViewTemplate.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {quickViewTemplate.thumbnail_url ? (
                    <img src={quickViewTemplate.thumbnail_url} alt={quickViewTemplate.name} className="w-full h-full object-cover" />
                  ) : (
                    <Sparkles className="w-10 h-10 text-muted-foreground/40" />
                  )}
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                    {quickViewTemplate.category || "Template"}
                  </span>
                  <p className="text-sm text-muted-foreground">{quickViewTemplate.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      Rp {quickViewTemplate.base_price.toLocaleString("id-ID")}
                    </span>
                    {quickViewTemplate.estimated_days && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {quickViewTemplate.estimated_days} hari
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  to={`/store/templates/${quickViewTemplate.id}`}
                  onClick={() => setQuickViewTemplate(null)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  View Full Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </StorefrontLayout>
  );
}
