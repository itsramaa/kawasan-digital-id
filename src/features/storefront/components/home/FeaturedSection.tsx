import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import type { ServiceTemplate } from "@/features/storefront/types";

function TemplateCard({ template, index }: { template: ServiceTemplate; index: number }) {
  return (
    <Link
      to={`/templates/${template.id}`}
      className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
        {template.thumbnail_url ? (
          <img src={template.thumbnail_url} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <Sparkles className="w-10 h-10 text-muted-foreground/40" />
        )}
        {index === 0 && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px]">
            Best Seller
          </Badge>
        )}
        {template.category && (
          <Badge variant="secondary" className="absolute top-2 right-2 text-[10px]">
            {template.category}
          </Badge>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {template.name}
        </h3>
        {template.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-primary">
            Rp {template.base_price.toLocaleString("id-ID")}
          </span>
          {template.estimated_days && (
            <span className="text-xs text-muted-foreground">{template.estimated_days} hari</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function FeaturedSection({ templates }: { templates: ServiceTemplate[] }) {
  const { ref, isVisible } = useScrollReveal();

  if (templates.length === 0) return null;
  return (
    <section
      ref={ref}
      className={`max-w-6xl mx-auto px-4 lg:px-8 py-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Template Terlaris</h2>
        <Link to="/templates" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {templates.map((t, i) => (
          <TemplateCard key={t.id} template={t} index={i} />
        ))}
      </div>
    </section>
  );
}
