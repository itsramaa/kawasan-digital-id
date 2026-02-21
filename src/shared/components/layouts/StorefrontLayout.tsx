import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { Globe, Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/features/storefront/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Templates", path: "/templates" },
  { label: "Custom Website", path: "/custom" },
  { label: "Portfolio", path: "/showcase" },
  { label: "Help / FAQ", path: "/help" },
];

export function StorefrontLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isActive = (link: { path: string }) => {
    if (link.path === "/") return location.pathname === "/";
    return location.pathname.startsWith(link.path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Kawasan Digital</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(link)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full min-w-[18px] h-[18px]">
                  {itemCount}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                My Dashboard
              </Link>
            ) : (
              <Link
                to="/templates"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full min-w-[18px] h-[18px]">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 hover:bg-muted rounded-lg"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(link) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                My Dashboard
              </Link>
            ) : (
              <Link
                to="/templates"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <Globe className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm font-bold">Kawasan Digital</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Solusi website profesional untuk bisnis Anda. Template siap pakai atau custom sesuai kebutuhan.
              </p>
            </div>

            {/* Services */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Services</h4>
              <div className="space-y-2">
                <Link to="/templates" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Templates</Link>
                <Link to="/custom" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Custom Website</Link>
                <Link to="/showcase" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
              </div>
            </div>

            {/* Help */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Help</h4>
              <div className="space-y-2">
                <Link to="/help" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Legal</h4>
              <div className="space-y-2">
                <span className="block text-xs text-muted-foreground">Privacy Policy</span>
                <span className="block text-xs text-muted-foreground">Terms of Service</span>
                <span className="block text-xs text-muted-foreground">Refund Policy</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Kawasan Digital. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              hello@kawasandigital.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
