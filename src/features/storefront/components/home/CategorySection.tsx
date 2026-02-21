import { Link } from "react-router-dom";
import { ShoppingBag, Building2, Layers, Briefcase, PenTool, Store } from "lucide-react";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";

const CATEGORIES = [
  { label: "Ecommerce", icon: ShoppingBag, slug: "Ecommerce" },
  { label: "Company Profile", icon: Building2, slug: "Company Profile" },
  { label: "Landing Page", icon: Layers, slug: "Landing Page" },
  { label: "Portfolio", icon: Briefcase, slug: "Portfolio" },
  { label: "Blog", icon: PenTool, slug: "Blog" },
  { label: "UMKM", icon: Store, slug: "UMKM" },
];

export function CategorySection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`max-w-6xl mx-auto px-4 lg:px-8 py-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Cari Berdasarkan Kategori</h2>
        <p className="text-sm text-muted-foreground mt-1">Temukan solusi website sesuai jenis bisnis Anda</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/store/templates?category=${encodeURIComponent(cat.slug)}`}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <cat.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
