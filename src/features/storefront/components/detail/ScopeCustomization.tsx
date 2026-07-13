import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Sparkles } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { cn } from "@/src/lib/utils";
import type { TemplateFeature } from "../../types";

interface ScopeCustomizationProps {
  addOns: TemplateFeature[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function ScopeCustomization({ addOns, selectedIds, onToggle }: ScopeCustomizationProps) {
  const { ref, isVisible } = useScrollReveal();

  if (addOns.length === 0) return null;

  const maxPrice = Math.max(...addOns.map((f) => f.price));

  return (
    <section
      ref={ref}
      className={cn(
        "space-y-4 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
        <Sparkles className="w-5 h-5 text-primary" /> Scope Customization
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <TooltipProvider delayDuration={300}>
          {addOns.map((f) => (
            <label
              key={f.id}
              className={cn(
                "relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                selectedIds.has(f.id)
                  ? "border-primary/50 bg-primary/5 shadow-[0_0_12px_-3px_hsl(var(--primary)/0.2)]"
                  : "border-border hover:border-primary/30 hover:scale-[1.01]"
              )}
            >
              <Checkbox
                checked={selectedIds.has(f.id)}
                onCheckedChange={() => onToggle(f.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{f.name}</p>
                  {f.price === maxPrice && addOns.length > 1 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600">
                      Popular
                    </span>
                  )}
                </div>
                {f.description && (
                  <div className="flex items-start gap-1 mt-0.5">
                    <p className="text-xs text-muted-foreground line-clamp-2">{f.description}</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0 mt-0.5 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        {f.description}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                +Rp {f.price.toLocaleString("id-ID")}
              </span>
            </label>
          ))}
        </TooltipProvider>
      </div>
    </section>
  );
}
