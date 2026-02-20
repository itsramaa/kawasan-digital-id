import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import {
  LayoutDashboard,
  TrendingUp,
  FolderKanban,
  Receipt,
  HeadphonesIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  FileText,
  Handshake,
  ListTodo,
  Milestone as MilestoneIcon,
  CreditCard,
  TicketIcon,
  Globe,
  Server,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

function UserSection() {
  const { profile, roles, signOut } = useAuth();
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";
  const roleLabel = roles.length > 0 ? roles[0].replace(/_/g, " ") : "User";

  return (
    <div className="border-t border-sidebar-border px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-xs font-bold text-sidebar-primary">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{profile?.full_name || "User"}</p>
          <p className="text-[11px] text-sidebar-muted truncate capitalize">{roleLabel}</p>
        </div>
        <button onClick={signOut} className="p-1.5 hover:bg-sidebar-accent rounded-md text-sidebar-muted hover:text-sidebar-accent-foreground" title="Sign out">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  {
    label: "Sales",
    path: "/sales",
    icon: TrendingUp,
    children: [
      { label: "Pipeline", path: "/sales" },
      { label: "Clients", path: "/sales/clients" },
      { label: "Quotations", path: "/sales/quotations" },
      { label: "Contracts", path: "/sales/contracts" },
    ],
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
    children: [
      { label: "All Projects", path: "/projects" },
      { label: "Tasks", path: "/projects/tasks" },
    ],
  },
  {
    label: "Finance",
    path: "/finance",
    icon: Receipt,
    children: [
      { label: "Invoices", path: "/finance" },
      { label: "Payments", path: "/finance/payments" },
    ],
  },
  {
    label: "Support",
    path: "/support",
    icon: HeadphonesIcon,
  },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Sales", "Projects", "Finance"]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Globe className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">AgencyOS</h1>
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
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
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
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )}

              {/* Children */}
              {hasChildren && expanded && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                  {item.children!.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-3 py-2 rounded-md text-[13px] transition-colors",
                        location.pathname === child.path
                          ? "text-sidebar-accent-foreground bg-sidebar-accent/60 font-medium"
                          : "text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/30"
                      )}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <UserSection />
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-md shadow-md border border-border"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-foreground/40" onClick={() => setMobileOpen(false)}>
          <div
            className="w-64 h-full bg-sidebar flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-sidebar-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
