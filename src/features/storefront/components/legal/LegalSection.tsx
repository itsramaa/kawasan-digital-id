import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/utils";
import type { ReactNode } from "react";

interface LegalSectionProps {
  id: string;
  number: number;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export function LegalSection({ id, number, title, icon, children }: LegalSectionProps) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <article
      ref={ref}
      id={id}
      className={cn(
        "rounded-xl border border-border bg-card p-6 md:p-8 transition-all duration-700 ease-out scroll-mt-24",
        "hover:border-primary/30 hover:shadow-md",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-7 w-7 rounded-full p-0 flex items-center justify-center text-xs font-bold shrink-0">
            {number}
          </Badge>
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            {icon}
          </div>
        </div>
        <h2 className="text-lg font-semibold text-foreground pt-1">{title}</h2>
      </div>
      <div className="prose prose-sm max-w-none text-muted-foreground pl-0 md:pl-[calc(1.75rem+3rem+0.75rem)]">
        {children}
      </div>
    </article>
  );
}
