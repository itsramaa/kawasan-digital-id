import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { cn } from "@/shared/utils/utils";

interface RevealCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function RevealCard({ children, className = "", delay = 0 }: RevealCardProps) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
