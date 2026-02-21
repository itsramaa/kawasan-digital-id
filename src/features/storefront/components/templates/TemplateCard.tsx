import { Link } from "react-router-dom";
import { Sparkles, Eye, ArrowRight, Clock, ShoppingCart, Star, Flame } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import type { ServiceTemplate } from "@/features/storefront/types";

interface TemplateCardProps {
  template: ServiceTemplate;
  index: number;
  onQuickView: (t: ServiceTemplate) => void;
}

function isNew(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 30 * 24 * 60 * 60 * 1000;
}

export function TemplateCard({ template, index, onQuickView }: TemplateCardProps) {
  return (
    <div
      className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <div className="aspect-video bg-muted flex items-center justify-center relative">
        {template.thumbnail_url ? (
          <img src={template.thumbnail_url} alt={template.name} className="w-full h-full object-cover" />
        ) : (
          <Sparkles className="w-10 h-10 text-muted-foreground/40" />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {template.is_featured && (
            <Badge className="bg-amber-500/90 text-white border-0 text-[10px] gap-1">
              <Flame className="w-3 h-3" /> Best Seller
            </Badge>
          )}
          {isNew(template.created_at) && (
            <Badge className="bg-emerald-500/90 text-white border-0 text-[10px]">New</Badge>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.preventDefault(); onQuickView(template); }}
            className="px-3 py-1.5 rounded-lg bg-white/90 text-foreground text-xs font-medium flex items-center gap-1 hover:bg-white transition-colors hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
          <Link
            to={`/templates/${template.id}`}
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 hover:bg-primary/90 transition-colors hover:scale-105"
          >
            Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <Link to={`/templates/${template.id}`} className="block p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
            {template.category || "Template"}
          </span>
          {/* Rating placeholder */}
          <div className="flex items-center gap-0.5 ml-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{template.name}</h3>
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
  );
}
