import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useShowcaseProjects } from "@/features/storefront/hooks/useShowcaseProjects";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import {
  FolderKanban, ExternalLink, Target, Lightbulb, TrendingUp, Users,
  Search, ChevronRight, Home, Layers, Calendar, ArrowRight, Sparkles, Code2,
} from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { ShowcaseProject } from "@/features/storefront/types";
import { format } from "date-fns";

/* ─── Scroll Reveal Wrapper ─── */
function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Case study section count helper ─── */
function caseStudyCount(p: ShowcaseProject) {
  return [p.client_background, p.challenge, p.solution, p.result].filter(Boolean).length;
}

/* ═══════════════════════════════════════════════════════════════════════════
   DETAIL PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
function ShowcaseDetail({ projectId }: { projectId: string }) {
  const { data: projects } = useShowcaseProjects();
  const project = projects?.find((p) => p.id === projectId);

  if (!project) {
    return (
      <StorefrontLayout>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 text-center">
          <FolderKanban className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground">Project tidak ditemukan.</p>
          <Link to="/store/showcase" className="text-sm text-primary hover:underline mt-4 inline-block">
            ← Kembali ke Portfolio
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const sections = [
    { icon: Users, title: "Latar Belakang Klien", content: project.client_background },
    { icon: Target, title: "Tantangan", content: project.challenge },
    { icon: Lightbulb, title: "Solusi", content: project.solution },
    { icon: TrendingUp, title: "Hasil", content: project.result },
  ].filter((s) => s.content);

  const relatedProjects = projects
    ?.filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3) || [];

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-10">
        {/* Breadcrumb */}
        <Reveal>
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <Link to="/store" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link to="/store/showcase" className="hover:text-foreground transition-colors">Portfolio</Link>
            {project.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <span className="hover:text-foreground transition-colors">{project.category}</span>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{project.title}</span>
          </nav>
        </Reveal>

        {/* Hero Image */}
        <Reveal>
          <div className="relative rounded-xl overflow-hidden bg-muted border border-border group">
            {project.thumbnail_url ? (
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center">
                <FolderKanban className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
            {/* Overlay badges */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="text-xs font-medium text-primary-foreground bg-primary px-2.5 py-1 rounded-full">
                {project.category || "Project"}
              </span>
              {project.tech_stack && project.tech_stack.length > 0 && (
                <span className="text-xs font-medium text-foreground bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Code2 className="w-3 h-3" />
                  {project.tech_stack.length} tech
                </span>
              )}
            </div>
          </div>
        </Reveal>

        {/* Project Info */}
        <Reveal>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
            {project.description && (
              <p className="text-muted-foreground text-lg leading-relaxed">{project.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
              {project.category && (
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary" />
                  {project.category}
                </span>
              )}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-primary" />
                  {project.tech_stack.length} teknologi
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                {format(new Date(project.created_at), "dd MMM yyyy")}
              </span>
            </div>
          </div>
        </Reveal>

        {/* Case Study Sections */}
        {sections.length > 0 && (
          <div className="space-y-5">
            {sections.map((section, idx) => (
              <Reveal key={section.title} delay={idx * 100}>
                <div className="rounded-xl border border-border bg-card p-6 space-y-3 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">{String(idx + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <section.icon className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line pl-[52px]">{section.content}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <Reveal>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Tech Stack
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {project.tech_stack.map((t) => (
                  <span
                    key={t}
                    className="text-sm bg-muted px-3 py-2 rounded-lg font-mono text-foreground text-center hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Demo Link */}
        {project.demo_url && (
          <Reveal>
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              Lihat Live Demo <ExternalLink className="w-4 h-4" />
            </a>
          </Reveal>
        )}

        {/* CTA Section */}
        <Reveal>
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 text-center space-y-4">
            <Sparkles className="w-8 h-8 text-primary mx-auto" />
            <h3 className="text-xl font-bold text-foreground">Tertarik Membuat Project Serupa?</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Mulai dari template siap pakai atau konsultasi untuk project custom sesuai kebutuhan bisnis Anda.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                to="/store/templates"
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm inline-flex items-center gap-2"
              >
                Lihat Templates <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/store/custom"
                className="px-5 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors text-sm"
              >
                Custom Project
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <Reveal>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Project Terkait</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedProjects.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/store/showcase/${rp.id}`}
                    className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                      {rp.thumbnail_url ? (
                        <img src={rp.thumbnail_url} alt={rp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <FolderKanban className="w-8 h-8 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="p-3 space-y-1">
                      <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {rp.category || "Project"}
                      </span>
                      <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{rp.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </StorefrontLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LISTING PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function ShowcasePage() {
  const { id } = useParams();
  const { data: projects, isLoading } = useShowcaseProjects();
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const cats = projects?.map((p) => p.category).filter(Boolean) as string[];
    return ["All", ...new Set(cats)];
  }, [projects]);

  const categoryCount = useMemo(() => {
    const map: Record<string, number> = { All: projects?.length || 0 };
    projects?.forEach((p) => {
      const cat = p.category || "";
      if (cat) map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, [projects]);

  const filtered = useMemo(() => {
    let result = projects || [];
    if (filter !== "All") result = result.filter((p) => p.category === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tech_stack?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [projects, filter, searchQuery]);

  const uniqueCategories = new Set(projects?.map((p) => p.category).filter(Boolean));

  if (id) return <ShowcaseDetail projectId={id} />;

  return (
    <StorefrontLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/5 via-transparent to-primary/3 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 space-y-6">
            <Reveal>
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  <FolderKanban className="w-3.5 h-3.5" />
                  Portfolio
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Karya & Studi Kasus Terbaik Kami
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Jelajahi portofolio project yang telah kami kerjakan — lengkap dengan tantangan, solusi, dan hasil nyata yang dicapai.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[240px] max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari project, teknologi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                {!isLoading && projects && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FolderKanban className="w-4 h-4 text-primary" />
                      <strong className="text-foreground">{projects.length}</strong> project
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-primary" />
                      <strong className="text-foreground">{uniqueCategories.size}</strong> kategori
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-6 pb-12">
          {/* Category Filter */}
          <Reveal>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                    filter === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                  )}
                >
                  {cat}
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                      filter === cat ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-muted-foreground",
                    )}
                  >
                    {categoryCount[cat] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Search result count */}
          {searchQuery.trim() && (
            <p className="text-sm text-muted-foreground">
              Ditemukan <strong className="text-foreground">{filtered.length}</strong> project
            </p>
          )}

          {/* Loading */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <Skeleton className="aspect-video w-full rounded-none" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-1 pt-1">
                      <Skeleton className="h-4 w-12 rounded" />
                      <Skeleton className="h-4 w-14 rounded" />
                      <Skeleton className="h-4 w-10 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, idx) => (
                <Reveal key={project.id} delay={idx * 80}>
                  <Link
                    to={`/store/showcase/${project.id}`}
                    className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 block"
                  >
                    <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden relative">
                      {project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <FolderKanban className="w-10 h-10 text-muted-foreground/40" />
                      )}
                      {/* Case study count badge */}
                      {caseStudyCount(project) > 0 && (
                        <span className="absolute top-3 right-3 text-[10px] font-medium bg-background/80 backdrop-blur-sm text-foreground px-2 py-0.5 rounded-full">
                          {caseStudyCount(project)} studi kasus
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {project.category || "Project"}
                      </span>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.tech_stack?.slice(0, 4).map((t) => (
                          <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">
                            {t}
                          </span>
                        ))}
                        {(project.tech_stack?.length ?? 0) > 4 && (
                          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                            +{(project.tech_stack?.length ?? 0) - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="text-center py-16 space-y-4">
                <FolderKanban className="w-14 h-14 mx-auto text-muted-foreground/30" />
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium">Belum ada project untuk ditampilkan</p>
                  <p className="text-sm text-muted-foreground/70">
                    {searchQuery.trim() ? "Coba kata kunci lain atau hapus filter pencarian." : "Project portfolio akan segera ditambahkan."}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Link
                    to="/store/templates"
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5"
                  >
                    Lihat Templates <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/store/custom"
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Custom Project
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
}
