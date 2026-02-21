import { Link } from "react-router-dom";
import { ArrowRight, FolderKanban } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import type { ShowcaseProject } from "@/features/storefront/types";

export function ShowcaseSection({ projects }: { projects: ShowcaseProject[] }) {
  const { ref, isVisible } = useScrollReveal();

  if (projects.length === 0) return null;
  return (
    <section
      ref={ref}
      className={`max-w-6xl mx-auto px-4 lg:px-8 py-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Hasil Kerja Kami</h2>
        <Link to="/store/showcase" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <Link
            key={p.id}
            to={`/store/showcase/${p.id}`}
            className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
              {p.thumbnail_url ? (
                <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <FolderKanban className="w-8 h-8 text-muted-foreground/40" />
              )}
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground line-clamp-1 flex-1">{p.title}</h4>
                {p.category && (
                  <Badge variant="secondary" className="text-[10px] flex-shrink-0">{p.category}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
              {p.tech_stack && p.tech_stack.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {p.tech_stack.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
