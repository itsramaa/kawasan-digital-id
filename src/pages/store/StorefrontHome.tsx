import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, FolderKanban, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useShowcaseProjects } from "@/features/storefront/hooks/useShowcaseProjects";
import { useServiceTemplates } from "@/features/storefront/hooks/useServiceTemplates";
import type { ShowcaseProject, ServiceTemplate } from "@/features/storefront/types";

function ProjectCard({ project }: { project: ShowcaseProject }) {
  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
      <div className="aspect-video bg-muted flex items-center justify-center">
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <FolderKanban className="w-10 h-10 text-muted-foreground/40" />
        )}
      </div>
      <div className="p-4 space-y-2">
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {project.category || "Project"}
        </span>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {project.tech_stack?.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: ServiceTemplate }) {
  return (
    <Link to={`/store/templates/${template.id}`} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
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
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            Rp {template.base_price.toLocaleString("id-ID")}
          </span>
          {template.estimated_days && (
            <span className="text-xs text-muted-foreground">• {template.estimated_days} hari</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function StorefrontHome() {
  const { data: projects } = useShowcaseProjects();
  const { data: templates } = useServiceTemplates();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const featuredProjects = projects?.slice(0, 3) ?? [];
  const allTemplates = templates ?? [];

  return (
    <StorefrontLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-20 lg:py-32">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Build Your Digital <span className="text-primary">Presence</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From custom web apps to landing pages — choose a template, customize features, and get started in minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/store/templates"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Browse Templates <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/store/portfolio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border font-semibold hover:bg-muted transition-colors"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "50+", label: "Projects Delivered" },
            { value: "30+", label: "Happy Clients" },
            { value: "99%", label: "Satisfaction Rate" },
            { value: "24/7", label: "Support" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 lg:px-8 py-16 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Our Work</h2>
              <p className="text-muted-foreground mt-1">Recent projects we've delivered</p>
            </div>
            <Link to="/store/portfolio" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}

      {/* Featured Templates Carousel */}
      {allTemplates.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 lg:px-8 py-16 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Popular Templates</h2>
              <p className="text-muted-foreground mt-1">Start building with our ready-made solutions</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={scrollPrev} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={scrollNext} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link to="/store/templates" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 ml-2">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {allTemplates.map((t) => (
                <div key={t.id} className="flex-[0_0_100%] sm:flex-[0_0_48%] lg:flex-[0_0_31.5%] min-w-0">
                  <TemplateCard template={t} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-16">
        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-8 lg:p-12 text-center space-y-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose a template, customize it to your needs, and we'll bring your vision to life.
          </p>
          <Link
            to="/store/templates"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Browse Templates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </StorefrontLayout>
  );
}
