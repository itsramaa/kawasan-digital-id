import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const routeLabels: Record<string, string> = {
  "": "Dashboard",
  sales: "Sales",
  clients: "Clients",
  quotations: "Quotations",
  contracts: "Contracts",
  projects: "Projects",
  tasks: "Tasks",
  finance: "Finance",
  payments: "Payments",
  support: "Support",
  infrastructure: "Infrastructure",
  settings: "Settings",
  client: "Portal",
  invoices: "Invoices",
  account: "Account",
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname();

  const crumbs: BreadcrumbItem[] = items ?? (() => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, i) => ({
      label: routeLabels[part] || part.charAt(0).toUpperCase() + part.slice(1),
      path: i < parts.length - 1 ? "/" + parts.slice(0, i + 1).join("/") : undefined,
    }));
  })();

  if (crumbs.length === 0) return null;

  return (
    <nav className={cn("flex items-center gap-1.5 text-xs text-muted-foreground mb-4", className)}>
      <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 opacity-50" />
          {crumb.path ? (
            <Link href={crumb.path} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}