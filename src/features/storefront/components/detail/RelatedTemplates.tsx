import { Link } from "react-router-dom";
import { Sparkles, Star, Clock } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { cn } from "@/shared/utils/utils";
import type { ServiceTemplate } from "../../types";

interface RelatedTemplatesProps {
  templates: ServiceTemplate[];
}

export function RelatedTemplates({ templates }: RelatedTemplatesProps) {
  const { ref, isVisible } = useScrollReveal();

  if (templates.length === 0) return null;

  return (
    <section
      ref={ref}
      className={cn(
        "space-y-4 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <h2 className="text-xl font-bold text-foreground">Related Templates</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {templates.map((t) => (
          <Link
            key={t.id}
            to={`/templates/${t.id}`}
            className="min-w-[220px] lg:min-w-0 rounded-xl border border-border bg-card overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30"
          >
            <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
              {t.thumbnail_url ? (
                <img src={t.thumbnail_url} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <Sparkles className="w-8 h-8 text-muted-foreground/40" />
              )}
              {t.is_featured && (
                <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[10px] font-semibold">
                  <Star className="w-2.5 h-2.5 fill-current" /> Best Seller
                </span>
              )}
            </div>
            <div className="p-3 space-y-1.5">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{t.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">Rp {t.base_price.toLocaleString("id-ID")}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {t.category && (
                    <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t.category}</span>
                  )}
                  {t.estimated_days && (
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{t.estimated_days}d</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
