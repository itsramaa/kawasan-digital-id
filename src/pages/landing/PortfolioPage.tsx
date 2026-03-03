import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { Button } from "@/shared/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/shared/utils/utils";

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["showcase_projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("showcase_projects")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const categories = ["Semua", ...new Set(projects?.map((p) => p.category).filter(Boolean) as string[])];
  const filtered = activeCategory === "Semua" ? projects : projects?.filter((p) => p.category === activeCategory);

  return (
    <LandingLayout>
      <section className="py-20 sm:py-28 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <RevealCard>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">Portfolio</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Proyek-proyek yang telah kami kerjakan untuk klien di berbagai industri.
            </p>
          </RevealCard>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    activeCategory === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p, i) => (
                <RevealCard key={p.id} delay={i * 100} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    {p.thumbnail_url ? (
                      <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Preview</div>
                    )}
                  </div>
                  <div className="p-5">
                    {p.category && (
                      <span className="inline-block text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-0.5 mb-2">{p.category}</span>
                    )}
                    <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
                    {p.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.description}</p>}
                    {p.tech_stack && p.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {p.tech_stack.map((t) => (
                          <span key={t} className="text-xs bg-muted rounded px-2 py-0.5 text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    )}
                    {p.demo_url && (
                      <Button asChild variant="outline" size="sm" className="gap-1.5">
                        <a href={p.demo_url} target="_blank" rel="noopener noreferrer">
                          Live Demo <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </RevealCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p>Belum ada proyek yang ditampilkan.</p>
            </div>
          )}
        </div>
      </section>
    </LandingLayout>
  );
}
