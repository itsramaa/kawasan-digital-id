'use client'

export const dynamic = 'force-dynamic';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import { Globe, Menu, X, ShoppingCart, ArrowUp } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Templates', path: '/templates' },
  { label: 'Custom Website', path: '/custom' },
  { label: 'Lacak Pesanan', path: '/orders/track' },
  { label: 'Help & FAQ', path: '/help' },
];

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-all"
      aria-label="Back to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Kawasan Digital</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.path}
                className={cn(
                  'relative px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:rounded-full after:transition-all after:duration-300",
                  isActive(link.path)
                    ? 'text-primary after:w-6 after:bg-primary'
                    : 'text-muted-foreground hover:text-foreground after:w-0 hover:after:w-6 after:bg-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link
              href="/templates"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-opacity border-0"
            >
              Get Started
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="text-sm font-bold">Kawasan Digital</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Solusi website profesional untuk bisnis Anda. Template siap pakai atau custom sesuai kebutuhan.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Services</h4>
              <div className="space-y-2">
                <Link href="/templates" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Templates</Link>
                <Link href="/custom" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Custom Website</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Help</h4>
              <div className="space-y-2">
                <Link href="/orders/track" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Lacak Pesanan</Link>
                <Link href="/help" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                <Link href="/refund" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Kawasan Digital. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">hello@kawasandigital.com</p>
          </div>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
}
