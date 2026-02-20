import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { Globe, Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/features/storefront/hooks/useCart";

const navLinks = [
  { label: "Home", path: "/store" },
  { label: "Portfolio", path: "/store/portfolio" },
  { label: "Templates", path: "/store/templates" },
];

export function StorefrontLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
          <Link to="/store" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">AgencyOS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = link.path === "/store"
                ? location.pathname === "/store"
                : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/store/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full min-w-[18px] h-[18px]">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              to="/client"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              My Dashboard
            </Link>
            <Link
              to="/store/templates"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Link to="/store/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
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
            {navLinks.map((link) => {
              const active = link.path === "/store"
                ? location.pathname === "/store"
                : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/client"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              My Dashboard
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Globe className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold">AgencyOS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AgencyOS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
