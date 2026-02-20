import { useState } from "react";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useShowcaseProjects } from "@/features/storefront/hooks/useShowcaseProjects";
import { FolderKanban, ExternalLink } from "lucide-react";
import { cn } from "@/shared/utils/utils";

export default function ShowcasePage() {
  const { data: projects, isLoading } = useShowcaseProjects();
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", ...new Set(projects?.map((p) => p.category).filter(Boolean) as string[])];
  const filtered = filter === "All" ? projects : projects?.filter((p) => p.category === filter);

  return (
    <StorefrontLayout>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Our Showcase</h1>
          <p className="text-muted-foreground mt-1">Projects we've delivered for our clients</p>
        </div>

        {/* Filters */}
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
              <div key={project.id} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
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
                  <h3 className="font-semibold text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.tech_stack?.map((t) => (
                      <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">{t}</span>
                    ))}
                  </div>
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                    >
                      View Demo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
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
