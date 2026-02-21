import { Link } from "react-router-dom";
import { Sparkles, Clock, Star, Flame, ArrowRight, Eye } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import type { ServiceTemplate } from "@/features/storefront/types";

interface Props {
  template: ServiceTemplate;
  index: number;
  onQuickView: (t: ServiceTemplate) => void;
}

function isNew(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 30 * 24 * 60 * 60 * 1000;
}

export function TemplateListItem({ template, index, onQuickView }: Props) {
  return (
    <div
      className="group flex gap-5 rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
    >
      {/* Thumbnail */}
      <div className="w-56 shrink-0 bg-muted flex items-center justify-center relative">
        {template.thumbnail_url ? (
          <img src={template.thumbnail_url} alt={template.name} className="w-full h-full object-cover" />
        ) : (
          <Sparkles className="w-8 h-8 text-muted-foreground/40" />
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {template.is_featured && (
            <Badge className="bg-amber-500/90 text-white border-0 text-[10px] gap-1">
              <Flame className="w-3 h-3" /> Best Seller
            </Badge>
          )}
          {isNew(template.created_at) && (
            <Badge className="bg-emerald-500/90 text-white border-0 text-[10px]">New</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-4 pr-4 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
              {template.category || "Template"}
            </span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">{template.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{template.description}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-primary">
              Rp {template.base_price.toLocaleString("id-ID")}
            </span>
            {template.estimated_days && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {template.estimated_days} hari
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuickView(template)}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium flex items-center gap-1 hover:bg-muted transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
            <Link
              to={`/templates/${template.id}`}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 hover:bg-primary/90 transition-colors"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
