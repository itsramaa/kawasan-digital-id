import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { useState } from "react";
import { Menu, X, Globe, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const navLinks = [
  { to: "/landing", label: "Home" },
  { to: "/landing/about", label: "Tentang Kami" },
  { to: "/landing/services", label: "Layanan" },
  { to: "/landing/portfolio", label: "Portfolio" },
  { to: "/landing/contact", label: "Kontak" },
];

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/landing" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Globe className="h-6 w-6" />
          <span>Kawasan Digital</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-3">
            <Link to="/">Storefront</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background px-4 pb-4 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-2.5 rounded-md text-sm font-medium",
                location.pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="sm" className="w-full mt-2">
            <Link to="/">Storefront</Link>
          </Button>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-sidebar-background text-sidebar-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl text-sidebar-primary-foreground">
              <Globe className="h-6 w-6 text-primary" />
              Kawasan Digital
            </div>
            <p className="text-sm leading-relaxed opacity-70 max-w-sm">
              Partner terpercaya untuk solusi digital bisnis Anda. Kami membantu membangun kehadiran online yang profesional dan berdampak.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sidebar-primary-foreground text-sm uppercase tracking-wider">Navigasi</h4>
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="block text-sm opacity-70 hover:opacity-100 transition-opacity">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sidebar-primary-foreground text-sm uppercase tracking-wider">Kontak</h4>
            <div className="space-y-2 text-sm opacity-70">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@kawasandigital.com</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +62 812 3456 7890</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Jakarta, Indonesia</div>
            </div>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-12 pt-8 text-center text-xs opacity-50">
          © {new Date().getFullYear()} Kawasan Digital. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
