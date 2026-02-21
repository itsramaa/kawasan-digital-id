import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUp, ChevronRight, Shield, FileText, RotateCcw } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/utils";

interface TocItem {
  id: string;
  label: string;
}

interface CrossNavItem {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  tocItems: TocItem[];
  crossNavItems: CrossNavItem[];
  children: ReactNode;
}

const legalPages: Record<string, { title: string; description: string; icon: ReactNode }> = {
  "/privacy": { title: "Privacy Policy", description: "Kebijakan privasi kami", icon: <Shield className="h-5 w-5" /> },
  "/terms": { title: "Terms of Service", description: "Syarat & ketentuan layanan", icon: <FileText className="h-5 w-5" /> },
  "/refund": { title: "Refund Policy", description: "Kebijakan pengembalian dana", icon: <RotateCcw className="h-5 w-5" /> },
};

export function LegalPageLayout({ title, description, lastUpdated, tocItems, crossNavItems, children }: LegalPageLayoutProps) {
  const location = useLocation();
  const [activeId, setActiveId] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0.1 }
    );
    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocItems]);

  const currentPage = legalPages[location.pathname];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/5 via-transparent to-primary/3 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Legal</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {currentPage?.icon || <Shield className="h-5 w-5" />}
            </div>
            <Badge variant="secondary" className="text-xs">
              Terakhir diperbarui: {lastUpdated}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        </div>
      </section>

      {/* Content with TOC sidebar */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex gap-10">
          {/* TOC Sidebar — desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Daftar Isi</p>
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "block text-sm py-1.5 px-3 rounded-md transition-colors",
                    activeId === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* TOC Mobile — horizontal pills */}
          <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-colors",
                    activeId === item.id
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "text-muted-foreground border-border hover:border-primary/20"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            {children}

            {/* Cross navigation */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm font-semibold text-muted-foreground mb-4">Dokumen Legal Lainnya</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {crossNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/15 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed bottom-6 right-6 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 z-50",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
