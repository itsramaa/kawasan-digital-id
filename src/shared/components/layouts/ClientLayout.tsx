import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/shared/components/common/NavLink";
import { useAuth } from "@/features/auth/AuthContext";
import { LayoutDashboard, FolderKanban, Receipt, HeadphonesIcon, User, Globe, LogOut, Menu, X, FileText, CreditCard, Server, ShoppingBag } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { useState } from "react";

interface ClientLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", path: "/dashboard/projects", icon: FolderKanban },
  { label: "Orders", path: "/dashboard/orders", icon: ShoppingBag },
  { label: "Contracts", path: "/dashboard/contracts", icon: FileText },
  { label: "Invoices", path: "/dashboard/invoices", icon: Receipt },
  { label: "Payments", path: "/dashboard/payments", icon: CreditCard },
  { label: "Infrastructure", path: "/dashboard/infrastructure", icon: Server },
  { label: "Support", path: "/dashboard/support", icon: HeadphonesIcon },
  { label: "Account", path: "/dashboard/account", icon: User },
];

export function ClientLayout({ children }: ClientLayoutProps) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border px-4 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1.5 hover:bg-muted rounded-md">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm">Kawasan Digital</span>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase tracking-wider">Client</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{profile?.full_name}</span>
            <button onClick={signOut} className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-1 -mb-px">
          {navItems.map((item) => {
            const active = item.path === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </header>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-border bg-card px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const active = item.path === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
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
