import { ReactNode, useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { Globe, Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from "@/features/storefront/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Templates", path: "/templates" },
  { label: "Custom Website", path: "/custom" },
  { label: "Portfolio", path: "/showcase" },
];

const helpCenterLinks = [
  { label: "How It Works", path: "/how-it-works" },
  { label: "Help / FAQ", path: "/help" },
];

function HelpCenterDropdown({ location }: { location: ReturnType<typeof useLocation> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getNavTo = (link: { path: string; hash?: string }) => {
    if (link.hash && link.path === location.pathname) return link.hash;
    if (link.hash) return link.path + link.hash;
    return link.path;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        Help Center
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-popover shadow-lg z-50 py-1">
          {helpCenterLinks.map((link) => (
            <Link
              key={link.label}
              to={getNavTo(link)}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function StorefrontLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileHelpOpen, setMobileHelpOpen] = useState(false);
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

  const getNavTo = (link: { path: string }) => {
    return link.path;
  };

  const getHelpNavTo = (link: typeof helpCenterLinks[number]) => {
    if ('hash' in link && (link as any).hash && link.path === location.pathname) return (link as any).hash;
    if ('hash' in link && (link as any).hash) return link.path + (link as any).hash;
    return link.path;
  };

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
                to={getNavTo(link)}
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
            <HelpCenterDropdown location={location} />
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
                to={getNavTo(link)}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(link) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            {/* Help Center accordion */}
            <button
              onClick={() => setMobileHelpOpen(!mobileHelpOpen)}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Help Center
              <ChevronDown className={cn("w-4 h-4 transition-transform", mobileHelpOpen && "rotate-180")} />
            </button>
            {mobileHelpOpen && (
              <div className="pl-4 space-y-1">
                {helpCenterLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={getHelpNavTo(link)}
                    onClick={() => { setMobileOpen(false); setMobileHelpOpen(false); }}
                    className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
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
                <Link to="/how-it-works" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
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
