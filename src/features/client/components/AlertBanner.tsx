import { cn } from "@/shared/utils/utils";
import { AlertTriangle, Info, XCircle } from "lucide-react";

interface AlertBannerProps {
  variant: "critical" | "warning" | "info";
  title: string;
  description?: string;
  className?: string;
}

const config = {
  critical: { icon: XCircle, bg: "bg-status-error/10 border-status-error/30 text-status-error" },
  warning: { icon: AlertTriangle, bg: "bg-status-warning/10 border-status-warning/30 text-status-warning" },
  info: { icon: Info, bg: "bg-status-info/10 border-status-info/30 text-status-info" },
};

export function AlertBanner({ variant, title, description, className }: AlertBannerProps) {
  const { icon: Icon, bg } = config[variant];
  return (
    <div className={cn("flex items-start gap-3 px-4 py-3 rounded-lg border", bg, className)}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-xs opacity-80 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
