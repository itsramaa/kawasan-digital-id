import { Link } from "react-router-dom";
import { Clock, ArrowRight, ExternalLink, Check, ShoppingCart, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { useTemplateDetail } from "@/features/storefront/hooks/useTemplateDetail";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { ServiceTemplate } from "@/features/storefront/types";

interface Props {
  template: ServiceTemplate | null;
  onClose: () => void;
}

export function QuickViewDialog({ template, onClose }: Props) {
  const { features, isLoading: featuresLoading } = useTemplateDetail(template?.id);
  const includedFeatures = features.filter((f) => f.is_included);

  return (
    <Dialog open={!!template} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        {template && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{template.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Image */}
              <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {template.thumbnail_url ? (
                  <img src={template.thumbnail_url} alt={template.name} className="w-full h-full object-cover" />
                ) : (
                  <Sparkles className="w-10 h-10 text-muted-foreground/40" />
                )}
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{template.category || "Template"}</Badge>
                {template.estimated_days && (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" /> {template.estimated_days} hari
                  </Badge>
                )}
                {template.demo_url && (
                  <a
                    href={template.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Live Demo
                  </a>
                )}
              </div>

              <p className="text-sm text-muted-foreground">{template.description}</p>

              {/* Included features */}
              {featuresLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ) : includedFeatures.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Yang Termasuk:</h4>
                  <ul className="space-y-1.5">
                    {includedFeatures.map((f) => (
                      <li key={f.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{f.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Price */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-2xl font-bold text-primary">
                  Rp {template.base_price.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  to={`/store/templates/${template.id}`}
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  View Full Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
