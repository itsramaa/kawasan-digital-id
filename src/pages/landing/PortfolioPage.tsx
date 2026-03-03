import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { Button } from "@/shared/components/ui/button";
import { ExternalLink, FolderOpen, ArrowRight, BarChart3, Layers, Globe } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { Link } from "react-router-dom";

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal(0.3);
  const started = useRef(false);
  useEffect(() => {
    if (!isVisible || started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);
  return { ref, count };
}

const portfolioStats = [
  { value: 100, suffix: "+", label: "Proyek Selesai", icon: BarChart3, color: "from-primary to-primary/70" },
  { value: 20, suffix: "+", label: "Teknologi", icon: Layers, color: "from-secondary to-secondary/70" },
  { value: 10, suffix: "+", label: "Industri Dilayani", icon: Globe, color: "from-accent to-accent/70" },
];

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
      <section className="relative py-20 sm:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/3 w-72 h-72 bg-secondary/8 rounded-full blur-3xl" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
          <div className="absolute bottom-10 right-1/3 w-60 h-60 bg-accent/8 rounded-full blur-3xl" style={{ animation: "float-medium 6s ease-in-out infinite 1s" }} />
        </div>
        <div className="max-w-3xl mx-auto px-4">
          <RevealCard>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Proyek-proyek yang telah kami kerjakan untuk klien di berbagai industri.
            </p>
          </RevealCard>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-14 border-y border-border bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            {portfolioStats.map((s, i) => {
              const { ref, count } = useCounter(s.value);
              return (
                <div key={i} ref={ref} className="text-center">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <s.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums">{count}{s.suffix}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === c
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg colored-shadow-primary"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
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
                <RevealCard
                  key={p.id}
                  delay={i * 100}
                  className="group rounded-xl border border-border bg-card overflow-hidden hover-lift glass-card"
                >
                  <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                    {p.thumbnail_url ? (
                      <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm bg-gradient-to-br from-muted to-muted/50">
                        No Preview
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                      {p.demo_url && (
                        <a
                          href={p.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2 rounded-full bg-white text-primary text-sm font-medium flex items-center gap-1.5 hover:scale-105 transition-transform"
                        >
                          View Project <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    {p.category && (
                      <span className="inline-block text-xs font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full px-3 py-0.5 mb-2">
                        {p.category}
                      </span>
                    )}
                    <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
                    {p.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.description}</p>}
                    {p.tech_stack && p.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.tech_stack.map((t) => (
                          <span key={t} className="text-xs bg-muted rounded-full px-2.5 py-0.5 text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </RevealCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Belum ada proyek</h3>
              <p className="text-muted-foreground mb-6">Proyek portfolio akan segera ditampilkan di sini.</p>
              <Button asChild className="gap-2 bg-gradient-to-r from-primary to-secondary border-0">
                <Link to="/landing/contact">Mulai Proyek Bersama Kami <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-95" />
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/5" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
        <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white/5" style={{ animation: "float-medium 6s ease-in-out infinite 1s" }} />

        <div className="relative max-w-3xl mx-auto px-4 text-center text-primary-foreground">
          <RevealCard>
            <h2 className="text-3xl font-bold mb-4">Ingin Proyek Seperti Ini?</h2>
            <p className="opacity-90 mb-8 text-lg">Mari wujudkan ide Anda menjadi website yang memukau.</p>
            <Button asChild size="lg" className="gap-2 bg-white text-primary hover:bg-white/90 text-lg px-8 shadow-lg">
              <Link to="/landing/contact">Mulai Proyek Anda <ArrowRight className="h-5 w-5" /></Link>
            </Button>
          </RevealCard>
        </div>
      </section>
    </LandingLayout>
  );
}
