import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/shared/components/common/NavLink";
import { useAuth } from "@/features/auth/AuthContext";
import {
  LayoutDashboard, TrendingUp, FolderKanban, Receipt,
  HeadphonesIcon, Settings, ChevronDown, ChevronRight,
  Users, Globe, Server, Menu, X, LogOut, Bell,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/shared/utils/utils";

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

/** Quick-navigate dropdown on the logo — admin can jump anywhere */
function LogoDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sections = [
    { label: "Dashboard", path: "/" },
    { label: "Sales Pipeline", path: "/sales" },
    { label: "Clients", path: "/sales/clients" },
    { label: "Quotations", path: "/sales/quotations" },
    { label: "Contracts", path: "/sales/contracts" },
    { label: "Projects", path: "/projects" },
    { label: "Tasks Board", path: "/projects/tasks" },
    { label: "Finance", path: "/finance" },
    { label: "Payments", path: "/finance/payments" },
    { label: "Support", path: "/support" },
    { label: "Infrastructure", path: "/infrastructure" },
    { label: "Settings", path: "/settings" },
    { label: "— Client Portal —", path: "", divider: true },
    { label: "Client Dashboard", path: "/client" },
    { label: "Client Projects", path: "/client/projects" },
    { label: "Client Invoices", path: "/client/invoices" },
    { label: "Client Support", path: "/client/support" },
    { label: "Client Account", path: "/client/account" },
  ] as { label: string; path: string; divider?: boolean }[];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full px-5 py-5 border-b border-sidebar-border hover:bg-sidebar-accent/40 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Globe className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <div className="text-left flex-1">
          <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">Kawasan Digital</h1>
          <p className="text-[10px] text-sidebar-muted uppercase tracking-widest">Operations Portal</p>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-sidebar-muted transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto py-1">
          {sections.map((s, i) =>
            s.divider ? (
              <div key={i} className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-t border-border mt-1 pt-2">
                {s.label.replace(/—/g, "").trim()}
              </div>
            ) : (
              <button
                key={s.path}
                onClick={() => { navigate(s.path); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-md mx-0 transition-colors"
              >
                {s.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  allowedRoles?: string[];
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  {
    label: "Sales",
    path: "/sales",
    icon: TrendingUp,
    allowedRoles: ["super_admin", "sales"],
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
    allowedRoles: ["super_admin", "project_manager", "developer"],
    children: [
      { label: "All Projects", path: "/projects" },
      { label: "Tasks", path: "/projects/tasks" },
    ],
  },
  {
    label: "Finance",
    path: "/finance",
    icon: Receipt,
    allowedRoles: ["super_admin", "finance"],
    children: [
      { label: "Invoices", path: "/finance" },
      { label: "Payments", path: "/finance/payments" },
    ],
  },
  {
    label: "Support",
    path: "/support",
    icon: HeadphonesIcon,
    allowedRoles: ["super_admin", "support"],
  },
  {
    label: "Infrastructure",
    path: "/infrastructure",
    icon: Server,
    allowedRoles: ["super_admin", "infra"],
  },
  { label: "Settings", path: "/settings", icon: Settings, allowedRoles: ["super_admin"] },
];

export function AppSidebar() {
  const location = useLocation();
  const { roles } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Sales", "Projects", "Finance"]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryRole = roles[0] ?? "super_admin";
  const isAdmin = primaryRole === "super_admin";

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const visibleItems = navItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(primaryRole);
  });

  const sidebarContent = (
    <>
      {/* Logo with dropdown for admin */}
      {isAdmin ? (
        <LogoDropdown />
      ) : (
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Globe className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">Kawasan Digital</h1>
            <p className="text-[10px] text-sidebar-muted uppercase tracking-widest">Operations Portal</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {visibleItems.map((item) => {
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

      <UserSection />
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-md shadow-md border border-border"
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