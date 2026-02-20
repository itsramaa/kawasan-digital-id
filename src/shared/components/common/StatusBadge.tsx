import { cn } from "@/shared/utils/utils";
import { LucideIcon } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  variant?: "success" | "warning" | "error" | "info" | "hold" | "neutral";
  className?: string;
}

const variantStyles: Record<string, string> = {
  success: "bg-status-success/10 text-status-success border-status-success/20",
  warning: "bg-status-warning/10 text-status-warning border-status-warning/20",
  error: "bg-status-error/10 text-status-error border-status-error/20",
  info: "bg-status-info/10 text-status-info border-status-info/20",
  hold: "bg-status-hold/10 text-status-hold border-status-hold/20",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, variant = "neutral", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        variant === "success" && "bg-status-success",
        variant === "warning" && "bg-status-warning",
        variant === "error" && "bg-status-error",
        variant === "info" && "bg-status-info",
        variant === "hold" && "bg-status-hold",
        variant === "neutral" && "bg-muted-foreground",
      )} />
      {status}
    </span>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function KPICard({ title, value, change, changeType = "neutral", icon: Icon }: KPICardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-medium",
              changeType === "positive" && "text-status-success",
              changeType === "negative" && "text-status-error",
              changeType === "neutral" && "text-muted-foreground",
            )}>
              {change}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
