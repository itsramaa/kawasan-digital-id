import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  headline: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, headline, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-card rounded-lg border border-border">
      <div className="p-4 rounded-full bg-muted mb-4">
        <Icon className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <h3 className="font-semibold text-foreground">{headline}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-xs text-center">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
