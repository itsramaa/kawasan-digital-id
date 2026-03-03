import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/landing" className="flex items-center gap-2.5 font-bold text-xl group">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Globe className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="gradient-text">Kawasan Digital</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "relative px-4 py-2 rounded-md text-sm font-medium transition-colors",
                "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:rounded-full after:transition-all after:duration-300",
                location.pathname === l.to
                  ? "text-primary after:w-6 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-6 after:bg-secondary"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity border-0">
            <Link to="/">Storefront</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 pb-4 space-y-1 animate-fade-in">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                location.pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="sm" className="w-full mt-2 bg-gradient-to-r from-primary to-secondary border-0">
            <Link to="/">Storefront</Link>
          </Button>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-sidebar-background via-sidebar-background to-primary/20">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 font-bold text-xl">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-sidebar-primary-foreground">Kawasan Digital</span>
            </div>
            <p className="text-sm leading-relaxed text-sidebar-foreground/70 max-w-sm">
              Partner terpercaya untuk solusi digital bisnis Anda. Kami membantu membangun kehadiran online yang profesional dan berdampak.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 pt-2">
              {["Instagram", "LinkedIn", "WhatsApp"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center text-sidebar-foreground/60 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  title={s}
                >
                  <span className="text-xs font-bold">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sidebar-primary-foreground text-sm uppercase tracking-wider">Navigasi</h4>
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block text-sm text-sidebar-foreground/70 hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sidebar-primary-foreground text-sm uppercase tracking-wider">Kontak</h4>
            <div className="space-y-3 text-sm text-sidebar-foreground/70">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                info@kawasandigital.com
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-3.5 w-3.5 text-secondary" />
                </div>
                +62 812 3456 7890
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                </div>
                Jakarta, Indonesia
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-sidebar-border/50 mt-12 pt-8 text-center text-xs text-sidebar-foreground/40">
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
