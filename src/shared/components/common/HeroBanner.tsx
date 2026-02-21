import { type LucideIcon } from "lucide-react";
import { RevealCard } from "./RevealCard";

interface HeroBannerProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  breadcrumb?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function HeroBanner({ icon: Icon, title, subtitle, breadcrumb, actions, children }: HeroBannerProps) {
  return (
    <RevealCard>
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border">
        {children ?? (
          <div className="px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                {breadcrumb && <p className="text-xs text-muted-foreground mb-1">{breadcrumb}</p>}
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
              </div>
            </div>
            {actions}
          </div>
        )}
      </div>
    </RevealCard>
  );
}
