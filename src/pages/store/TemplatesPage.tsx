import { useState } from "react";
import { Link } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useServiceTemplates } from "@/features/storefront/hooks/useServiceTemplates";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/utils/utils";

export default function TemplatesPage() {
  const { data: templates, isLoading } = useServiceTemplates();
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", ...new Set(templates?.map((t) => t.category).filter(Boolean) as string[])];
  const filtered = filter === "All" ? templates : templates?.filter((t) => t.category === filter);

  return (
    <StorefrontLayout>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">Choose a template and customize it to fit your needs</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
        ) : filtered && filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((template) => (
              <Link
                key={template.id}
                to={`/store/templates/${template.id}`}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {template.thumbnail_url ? (
                    <img src={template.thumbnail_url} alt={template.name} className="w-full h-full object-cover" />
                  ) : (
                    <Sparkles className="w-10 h-10 text-muted-foreground/40" />
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                    {template.category || "Template"}
                  </span>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-bold text-primary">
                      Rp {template.base_price.toLocaleString("id-ID")}
                    </span>
                    {template.estimated_days && (
                      <span className="text-xs text-muted-foreground">• {template.estimated_days} hari</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No templates available yet.</p>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
