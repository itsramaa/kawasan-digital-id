import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useShowcaseProjects } from "@/features/storefront/hooks/useShowcaseProjects";
import { FolderKanban, ExternalLink, ArrowLeft, Target, Lightbulb, TrendingUp, Users } from "lucide-react";
import { cn } from "@/shared/utils/utils";

function ShowcaseDetail({ projectId }: { projectId: string }) {
  const { data: projects } = useShowcaseProjects();
  const project = projects?.find((p) => p.id === projectId);

  if (!project) {
    return (
      <StorefrontLayout>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 text-center">
          <FolderKanban className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground">Project not found.</p>
          <Link to="/store/showcase" className="text-sm text-primary hover:underline mt-4 inline-block">
            ← Back to Portfolio
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const sections = [
    { icon: Users, title: "Client Background", content: project.client_background },
    { icon: Target, title: "Challenge", content: project.challenge },
    { icon: Lightbulb, title: "Solution", content: project.solution },
    { icon: TrendingUp, title: "Result", content: project.result },
  ].filter((s) => s.content);

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <Link to="/store/showcase" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>

        {/* Hero */}
        <div className="space-y-4">
          {project.thumbnail_url && (
            <div className="aspect-video rounded-xl overflow-hidden bg-muted border border-border">
              <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {project.category || "Project"}
            </span>
            <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
            {project.description && (
              <p className="text-muted-foreground text-lg">{project.description}</p>
            )}
          </div>
        </div>

        {/* Case Study Sections */}
        {sections.length > 0 && (
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="rounded-xl border border-border bg-card p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((t) => (
                <span key={t} className="text-sm bg-muted px-3 py-1.5 rounded-lg font-mono text-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Demo Link */}
        {project.demo_url && (
          <a
            href={project.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            View Live Demo <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </StorefrontLayout>
  );
}

export default function ShowcasePage() {
  const { id } = useParams();
  const { data: projects, isLoading } = useShowcaseProjects();
  const [filter, setFilter] = useState<string>("All");

  if (id) return <ShowcaseDetail projectId={id} />;

  const categories = ["All", ...new Set(projects?.map((p) => p.category).filter(Boolean) as string[])];
  const filtered = filter === "All" ? projects : projects?.filter((p) => p.category === filter);

  return (
    <StorefrontLayout>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground mt-1">Case studies from projects we've delivered</p>
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
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <Link
                key={project.id}
                to={`/store/showcase/${project.id}`}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
              >
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
                  <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.tech_stack?.map((t) => (
                      <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No projects to show yet.</p>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
