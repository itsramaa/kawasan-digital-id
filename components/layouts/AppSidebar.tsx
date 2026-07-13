'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, TrendingUp, FolderKanban, Receipt,
  HeadphonesIcon, Settings, ChevronDown, ChevronRight,
  Globe, Server, Menu, X, LogOut,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  allowedRoles?: string[];
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    label: 'Sales',
    path: '/dashboard/sales',
    icon: TrendingUp,
    allowedRoles: ['super_admin', 'sales'],
    children: [
      { label: 'Pipeline', path: '/dashboard/sales' },
      { label: 'Clients', path: '/dashboard/sales/clients' },
      { label: 'Quotations', path: '/dashboard/sales/quotations' },
      { label: 'Contracts', path: '/dashboard/sales/contracts' },
    ],
  },
  {
    label: 'Projects',
    path: '/dashboard/projects',
    icon: FolderKanban,
    allowedRoles: ['super_admin', 'project_manager', 'developer'],
    children: [
      { label: 'All Projects', path: '/dashboard/projects' },
    ],
  },
  {
    label: 'Finance',
    path: '/dashboard/finance',
    icon: Receipt,
    allowedRoles: ['super_admin', 'finance'],
    children: [
      { label: 'Overview', path: '/dashboard/finance' },
      { label: 'Payments', path: '/dashboard/finance/payments' },
    ],
  },
  {
    label: 'Support',
    path: '/dashboard/support',
    icon: HeadphonesIcon,
    allowedRoles: ['super_admin', 'support'],
  },
  {
    label: 'Infrastructure',
    path: '/dashboard/infrastructure',
    icon: Server,
    allowedRoles: ['super_admin', 'infra'],
  },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings, allowedRoles: ['super_admin'] },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Sales', 'Projects', 'Finance']);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Globe className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">Kawasan Digital</h1>
          <p className="text-[10px] text-sidebar-muted uppercase tracking-widest">Operations Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const expanded = expandedGroups.includes(item.label);
          const active = isActive(item.path);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.label}>
              {hasChildren ? (
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {expanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-sidebar-muted" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-sidebar-muted" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )}

              {hasChildren && expanded && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                  {item.children!.map((child) => (
                    <Link
                      key={child.path}
                      href={child.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block px-3 py-2 rounded-md text-[13px] transition-colors',
                        pathname === child.path
                          ? 'text-sidebar-accent-foreground bg-sidebar-accent/60 font-medium'
                          : 'text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/30'
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-xs font-bold text-sidebar-primary">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">Staff</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="p-1.5 hover:bg-sidebar-accent rounded-md text-sidebar-muted hover:text-sidebar-accent-foreground"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-md shadow-md border border-border"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-foreground/40" onClick={() => setMobileOpen(false)}>
          <div
            className="w-64 h-full bg-sidebar flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-sidebar-foreground"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
