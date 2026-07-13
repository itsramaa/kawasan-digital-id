import { cn } from "@/src/lib/utils";

type Variant = "default" | "organic" | "tech" | "creative" | "minimal";

interface FloatingElementsProps {
  variant?: Variant;
  className?: string;
}

interface ShapeProps {
  className: string;
  style?: React.CSSProperties;
}

const Shape = ({ className, style }: ShapeProps) => (
  <div className={cn("absolute pointer-events-none", className)} style={style} />
);

const defaultElements: ShapeProps[] = [
  // Rings
  { className: "top-[8%] left-[5%] w-20 h-20 rounded-full border-2 border-primary/[0.06] opacity-60", style: { animation: "float-slow 9s ease-in-out infinite" } },
  { className: "top-[35%] right-[8%] w-16 h-16 rounded-full border-2 border-secondary/[0.08] opacity-50", style: { animation: "float-medium 7s ease-in-out infinite 1s" } },
  { className: "bottom-[20%] left-[12%] w-24 h-24 rounded-full border border-accent/[0.05] opacity-50", style: { animation: "float-diagonal 12s ease-in-out infinite 2s" } },
  // Dots
  { className: "top-[18%] right-[20%] w-3 h-3 rounded-full bg-primary/[0.08]", style: { animation: "float-medium 8s ease-in-out infinite 0.5s" } },
  { className: "top-[55%] left-[25%] w-2 h-2 rounded-full bg-secondary/[0.10]", style: { animation: "float-slow 10s ease-in-out infinite 3s" } },
  { className: "bottom-[35%] right-[15%] w-4 h-4 rounded-full bg-accent/[0.06]", style: { animation: "float-diagonal 9s ease-in-out infinite 1.5s" } },
  // Gradient bars
  { className: "top-[45%] left-[3%] w-1 h-16 rounded-full bg-gradient-to-b from-primary/[0.06] to-transparent", style: { animation: "float-slow 11s ease-in-out infinite 2s" } },
  { className: "bottom-[15%] right-[6%] w-1 h-20 rounded-full bg-gradient-to-b from-secondary/[0.05] to-transparent", style: { animation: "float-medium 8s ease-in-out infinite 4s" } },
  // Rounded squares
  { className: "top-[70%] right-[25%] w-10 h-10 rounded-lg border border-primary/[0.05] rotate-12", style: { animation: "spin-slow 30s linear infinite" } },
  { className: "top-[12%] left-[40%] w-8 h-8 rounded-md border border-accent/[0.06] -rotate-6", style: { animation: "spin-slow 25s linear infinite reverse" } },
];

const organicElements: ShapeProps[] = [
  // Soft circles
  { className: "top-[6%] right-[10%] w-28 h-28 rounded-full bg-primary/[0.03] blur-sm", style: { animation: "float-slow 10s ease-in-out infinite" } },
  { className: "top-[40%] left-[5%] w-20 h-20 rounded-full bg-secondary/[0.04] blur-sm", style: { animation: "float-medium 8s ease-in-out infinite 1s" } },
  { className: "bottom-[25%] right-[15%] w-32 h-32 rounded-full bg-accent/[0.03] blur-md", style: { animation: "float-diagonal 14s ease-in-out infinite 3s" } },
  // Rounded blobs
  { className: "top-[22%] left-[18%] w-14 h-14 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-primary/[0.04]", style: { animation: "float-slow 12s ease-in-out infinite 2s" } },
  { className: "bottom-[40%] left-[30%] w-10 h-10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-secondary/[0.05]", style: { animation: "float-medium 9s ease-in-out infinite 1.5s" } },
  { className: "top-[60%] right-[8%] w-12 h-12 rounded-[30%_70%_50%_50%/50%_40%_60%_50%] bg-accent/[0.04]", style: { animation: "float-diagonal 11s ease-in-out infinite 4s" } },
  // Small dots
  { className: "top-[15%] right-[30%] w-2.5 h-2.5 rounded-full bg-primary/[0.08]", style: { animation: "float-medium 7s ease-in-out infinite 0.5s" } },
  { className: "bottom-[18%] left-[20%] w-3 h-3 rounded-full bg-secondary/[0.07]", style: { animation: "float-slow 9s ease-in-out infinite 3s" } },
  // Soft rings
  { className: "top-[75%] left-[8%] w-16 h-16 rounded-full border border-primary/[0.05]", style: { animation: "float-slow 13s ease-in-out infinite 2.5s" } },
  { className: "top-[50%] right-[22%] w-12 h-12 rounded-full border border-accent/[0.06]", style: { animation: "float-medium 10s ease-in-out infinite 1s" } },
];

const techElements: ShapeProps[] = [
  // Squares
  { className: "top-[10%] right-[12%] w-12 h-12 border border-primary/[0.06] rotate-45", style: { animation: "spin-slow 28s linear infinite" } },
  { className: "top-[50%] left-[6%] w-8 h-8 border border-secondary/[0.07] rotate-12", style: { animation: "spin-slow 35s linear infinite reverse" } },
  { className: "bottom-[20%] right-[20%] w-10 h-10 border border-accent/[0.05] -rotate-12", style: { animation: "spin-slow 32s linear infinite" } },
  // Code brackets
  { className: "top-[25%] left-[10%] w-6 h-12 border-l-2 border-t-2 border-b-2 border-primary/[0.06] rounded-l-sm", style: { animation: "float-slow 10s ease-in-out infinite 1s" } },
  { className: "top-[65%] right-[10%] w-6 h-12 border-r-2 border-t-2 border-b-2 border-secondary/[0.06] rounded-r-sm", style: { animation: "float-medium 8s ease-in-out infinite 2s" } },
  // Grid dots
  { className: "top-[35%] right-[30%] w-3 h-3 rounded-full bg-primary/[0.08]", style: { animation: "float-diagonal 9s ease-in-out infinite" } },
  { className: "top-[38%] right-[26%] w-2 h-2 rounded-full bg-primary/[0.06]", style: { animation: "float-diagonal 9s ease-in-out infinite 0.3s" } },
  { className: "top-[32%] right-[26%] w-2 h-2 rounded-full bg-primary/[0.06]", style: { animation: "float-diagonal 9s ease-in-out infinite 0.6s" } },
  // Lines
  { className: "bottom-[30%] left-[15%] w-16 h-px bg-gradient-to-r from-primary/[0.08] to-transparent", style: { animation: "float-slow 11s ease-in-out infinite 3s" } },
  { className: "top-[80%] right-[5%] w-12 h-px bg-gradient-to-r from-secondary/[0.07] to-transparent", style: { animation: "float-medium 7s ease-in-out infinite 4s" } },
  // Small square fill
  { className: "top-[18%] left-[35%] w-4 h-4 bg-accent/[0.05] rotate-45", style: { animation: "spin-slow 20s linear infinite" } },
];

const creativeElements: ShapeProps[] = [
  // Diamonds
  { className: "top-[12%] left-[8%] w-10 h-10 bg-primary/[0.05] rotate-45", style: { animation: "float-slow 9s ease-in-out infinite" } },
  { className: "top-[45%] right-[6%] w-14 h-14 border-2 border-secondary/[0.06] rotate-45", style: { animation: "float-medium 7s ease-in-out infinite 1s" } },
  { className: "bottom-[15%] left-[15%] w-8 h-8 bg-accent/[0.04] rotate-45", style: { animation: "float-diagonal 11s ease-in-out infinite 2s" } },
  // Diagonal lines
  { className: "top-[20%] right-[18%] w-20 h-px bg-gradient-to-r from-primary/[0.08] to-transparent rotate-[30deg]", style: { animation: "float-slow 10s ease-in-out infinite 0.5s" } },
  { className: "bottom-[35%] left-[25%] w-24 h-px bg-gradient-to-r from-secondary/[0.06] to-transparent -rotate-[20deg]", style: { animation: "float-medium 12s ease-in-out infinite 3s" } },
  // Circles
  { className: "top-[30%] left-[20%] w-3 h-3 rounded-full bg-primary/[0.09]", style: { animation: "float-medium 8s ease-in-out infinite 1.5s" } },
  { className: "bottom-[25%] right-[25%] w-4 h-4 rounded-full bg-accent/[0.07]", style: { animation: "float-slow 9s ease-in-out infinite 4s" } },
  // Rings
  { className: "top-[65%] right-[12%] w-18 h-18 rounded-full border border-primary/[0.05]", style: { animation: "spin-slow 25s linear infinite" } },
  { className: "top-[8%] right-[35%] w-6 h-6 rounded-full border border-secondary/[0.07]", style: { animation: "float-diagonal 10s ease-in-out infinite 2s" } },
  // Triangle-ish
  { className: "bottom-[45%] right-[30%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-primary/[0.06]", style: { animation: "float-slow 13s ease-in-out infinite 1s" } },
];

const minimalElements: ShapeProps[] = [
  // Small dots
  { className: "top-[15%] right-[12%] w-2 h-2 rounded-full bg-primary/[0.07]", style: { animation: "float-slow 10s ease-in-out infinite" } },
  { className: "top-[40%] left-[8%] w-1.5 h-1.5 rounded-full bg-secondary/[0.08]", style: { animation: "float-medium 8s ease-in-out infinite 1s" } },
  { className: "bottom-[30%] right-[20%] w-2.5 h-2.5 rounded-full bg-accent/[0.06]", style: { animation: "float-diagonal 12s ease-in-out infinite 2s" } },
  { className: "top-[60%] left-[25%] w-2 h-2 rounded-full bg-primary/[0.05]", style: { animation: "float-slow 11s ease-in-out infinite 3s" } },
  // Thin rings
  { className: "top-[20%] left-[15%] w-12 h-12 rounded-full border border-primary/[0.04]", style: { animation: "float-medium 9s ease-in-out infinite 0.5s" } },
  { className: "bottom-[20%] left-[35%] w-10 h-10 rounded-full border border-secondary/[0.04]", style: { animation: "float-slow 13s ease-in-out infinite 2.5s" } },
  // Thin accent lines
  { className: "top-[50%] right-[5%] w-px h-12 bg-gradient-to-b from-primary/[0.05] to-transparent", style: { animation: "float-slow 10s ease-in-out infinite 4s" } },
  { className: "top-[70%] left-[5%] w-px h-10 bg-gradient-to-b from-accent/[0.04] to-transparent", style: { animation: "float-medium 8s ease-in-out infinite 1.5s" } },
];

const variantMap: Record<Variant, ShapeProps[]> = {
  default: defaultElements,
  organic: organicElements,
  tech: techElements,
  creative: creativeElements,
  minimal: minimalElements,
};

export function FloatingElements({ variant = "default", className }: FloatingElementsProps) {
  const elements = variantMap[variant];

  return (
    <div
      className={cn("fixed inset-0 -z-10 overflow-hidden pointer-events-none", className)}
      aria-hidden="true"
    >
      {elements.map((el, i) => (
        <Shape key={`${variant}-${i}`} className={el.className} style={el.style} />
      ))}
    </div>
  );
}
