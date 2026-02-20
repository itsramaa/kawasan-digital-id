import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, FolderKanban, Sparkles, X } from "lucide-react";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useShowcaseProjects } from "@/features/storefront/hooks/useShowcaseProjects";
import { useServiceTemplates } from "@/features/storefront/hooks/useServiceTemplates";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import type { ShowcaseProject, ServiceTemplate } from "@/features/storefront/types";

function TemplateProductCard({ template }: { template: ServiceTemplate }) {
  return (
    <Link
      to={`/store/templates/${template.id}`}
      className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
    >
      <div className="aspect-video bg-muted flex items-center justify-center">
        {template.thumbnail_url ? (
          <img src={template.thumbnail_url} alt={template.name} className="w-full h-full object-cover" />
        ) : (
          <Sparkles className="w-10 h-10 text-muted-foreground/40" />
        )}
      </div>
      <div className="p-4 space-y-2">
        <Badge variant="secondary" className="text-[10px]">
          {template.category || "Template"}
        </Badge>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {template.name}
        </h3>
        {template.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-primary">
            Rp {template.base_price.toLocaleString("id-ID")}
          </span>
          {template.estimated_days && (
            <span className="text-xs text-muted-foreground">{template.estimated_days} hari</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function CompactProjectCard({ project }: { project: ShowcaseProject }) {
  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all">
      <div className="aspect-video bg-muted flex items-center justify-center">
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <FolderKanban className="w-8 h-8 text-muted-foreground/40" />
        )}
      </div>
      <div className="p-3 space-y-1">
        <h4 className="text-sm font-semibold text-foreground line-clamp-1">{project.title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
      </div>
    </div>
  );
}

export default function StorefrontHome() {
  const { data: templates } = useServiceTemplates();
  const { data: projects } = useShowcaseProjects();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [showBanner, setShowBanner] = useState(true);

  const allTemplates = templates ?? [];
  const showcaseProjects = projects?.slice(0, 3) ?? [];

  const categories = useMemo(() => {
    const cats = new Set(allTemplates.map((t) => t.category).filter(Boolean));
    return ["All", ...Array.from(cats)] as string[];
  }, [allTemplates]);

  const filteredTemplates = useMemo(() => {
    let result = allTemplates;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.base_price - a.base_price);
    } else if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return result;
  }, [allTemplates, searchQuery, categoryFilter, sortBy]);

  return (
    <StorefrontLayout>
      {/* Slim Promo Banner */}
      {showBanner && (
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-2 flex items-center justify-between">
            <p className="text-sm text-foreground">
              🚀 <span className="font-medium">Diskon 20%</span> untuk semua template — gunakan kode{" "}
              <span className="font-mono font-semibold text-primary">LAUNCH20</span>
            </p>
            <button onClick={() => setShowBanner(false)} className="p-1 hover:bg-primary/10 rounded">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            <option value="default">Urutkan</option>
            <option value="price-asc">Harga: Rendah → Tinggi</option>
            <option value="price-desc">Harga: Tinggi → Rendah</option>
            <option value="newest">Terbaru</option>
          </select>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((t) => (
              <TemplateProductCard key={t.id} template={t} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Tidak ada template ditemukan</p>
            <p className="text-sm mt-1">Coba ubah kata kunci atau kategori filter</p>
          </div>
        )}

        {/* Portfolio Compact */}
        {showcaseProjects.length > 0 && (
          <>
            <hr className="border-border" />
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Hasil Kerja Kami</h2>
                <Link
                  to="/store/portfolio"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {showcaseProjects.map((p) => (
                  <CompactProjectCard key={p.id} project={p} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </StorefrontLayout>
  );
}
