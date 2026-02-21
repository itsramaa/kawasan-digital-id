import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { Search, Home, Layout, HelpCircle } from "lucide-react";

const suggestions = [
  { to: "/", icon: Home, label: "Beranda", desc: "Kembali ke halaman utama" },
  { to: "/templates", icon: Layout, label: "Templates", desc: "Jelajahi template website" },
  { to: "/help", icon: HelpCircle, label: "Help & FAQ", desc: "Butuh bantuan?" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <StorefrontLayout>
      <div className="flex flex-col items-center justify-center px-4 py-24 text-center space-y-8">
        {/* Illustration */}
        <div className="relative">
          <div className="text-[120px] sm:text-[160px] font-black text-primary/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center animate-fade-in">
              <Search className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-3 max-w-md">
          <h1 className="text-2xl font-bold text-foreground">Halaman Tidak Ditemukan</h1>
          <p className="text-muted-foreground">
            Halaman <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">{location.pathname}</code> tidak ada atau sudah dipindahkan.
          </p>
        </div>

        {/* Suggestions */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-xl w-full">
          {suggestions.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group rounded-xl border border-border bg-card p-5 text-center space-y-2 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{s.label}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default NotFound;
