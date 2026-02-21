import { DollarSign, Tag, Clock, Star } from "lucide-react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Slider } from "@/shared/components/ui/slider";

interface FilterProps {
  categories: string[];
  categoryFilter: string[];
  setCategoryFilter: (v: string[]) => void;
  deliveryFilter: string[];
  setDeliveryFilter: (v: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  priceExtent: [number, number];
  activeFilterCount: number;
  clearFilters: () => void;
  categoryCounts: Record<string, number>;
}

const DELIVERY_OPTIONS = [
  { label: "< 7 hari", value: "lt7" },
  { label: "7–14 hari", value: "7-14" },
  { label: "14–30 hari", value: "14-30" },
  { label: "30+ hari", value: "30+" },
];

function toggleArray(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

export function TemplateFilterSidebar({
  categories, categoryFilter, setCategoryFilter,
  deliveryFilter, setDeliveryFilter,
  priceRange, setPriceRange, priceExtent,
  activeFilterCount, clearFilters, categoryCounts,
}: FilterProps) {
  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" /> Price Range
        </h3>
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
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" /> Category
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={categoryFilter.includes(cat)}
                onCheckedChange={() => setCategoryFilter(toggleArray(categoryFilter, cat))}
              />
              <span className="text-sm text-foreground flex-1 group-hover:text-primary transition-colors">{cat}</span>
              <span className="text-[10px] font-medium bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {categoryCounts[cat] ?? 0}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Delivery Time */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" /> Delivery Time
        </h3>
        <div className="space-y-2">
          {DELIVERY_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={deliveryFilter.includes(opt.value)}
                onCheckedChange={() => setDeliveryFilter(toggleArray(deliveryFilter, opt.value))}
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating placeholder */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" /> Rating
        </h3>
        <p className="text-xs text-muted-foreground italic">Coming soon</p>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearFilters} className="text-sm text-primary hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );
}
