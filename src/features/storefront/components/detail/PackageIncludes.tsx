import { Check, Package } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { cn } from "@/src/lib/utils";
import type { TemplateFeature } from "../../types";

interface PackageIncludesProps {
  features: TemplateFeature[];
}

export function PackageIncludes({ features }: PackageIncludesProps) {
  const { ref, isVisible } = useScrollReveal();

  if (features.length === 0) return null;

  return (
    <section
      ref={ref}
      className={cn(
        "space-y-4 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
        <Package className="w-5 h-5 text-primary" /> Package Includes
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((f) => (
          <div
            key={f.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
          >
            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{f.name}</p>
              {f.description && <p className="text-xs text-muted-foreground mt-0.5">{f.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
