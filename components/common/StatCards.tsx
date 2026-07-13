import { type LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { RevealCard } from "./RevealCard";

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bg?: string;
}

interface StatCardsProps {
  stats: StatItem[];
  delay?: number;
  columns?: string;
}

export function StatCards({ stats, delay = 100, columns = "grid-cols-2 lg:grid-cols-4" }: StatCardsProps) {
  return (
    <RevealCard delay={delay}>
      <div className={cn("grid gap-4", columns)} role="group" aria-label="Ringkasan statistik">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3" aria-label={`${s.label}: ${s.value}`}>
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", s.bg || "bg-muted")}>
                <s.icon className={cn("w-5 h-5", s.color || "text-primary")} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold truncate">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </RevealCard>
  );
}
