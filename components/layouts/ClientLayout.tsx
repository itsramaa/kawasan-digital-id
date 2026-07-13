'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, FolderKanban, Receipt, HeadphonesIcon,
  Globe, Menu, X, Server, ShoppingBag, Search, ChevronDown, User, LogOut,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ClientLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Dasbor', path: '/client', icon: LayoutDashboard, exact: true },
  { label: 'Proyek', path: '/client/projects', icon: FolderKanban },
  { label: 'Pesanan', path: '/client/orders', icon: ShoppingBag },
  { label: 'Keuangan', path: '/client/invoices', icon: Receipt },
  { label: 'Infrastruktur', path: '/client/infrastructure', icon: Server },
  { label: 'Bantuan', path: '/client/support', icon: HeadphonesIcon },
];

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.path;
    return pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 hover:bg-muted rounded-md"
              aria-expanded={mobileOpen}
              aria-label="Menu navigasi"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm hidden sm:inline">Kawasan Digital</span>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase tracking-wider hidden sm:inline">
                Client
              </span>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari proyek, invoice..."
                aria-label="Cari proyek, invoice"
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted border-none text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Right: Avatar Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
                C
              </div>
              <span className="text-sm font-medium hidden sm:inline max-w-[120px] truncate">Client</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-popover shadow-lg z-50 py-1">
                <button
                  onClick={() => { router.push('/client/account'); setDropdownOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profil
                </button>
                <button
                  onClick={() => { signOut({ callbackUrl: '/auth/login' }); setDropdownOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex justify-center gap-1 -mb-px" aria-label="Navigasi utama">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-border bg-card px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      <main className="p-4 lg:p-8 max-w-6xl mx-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
}
