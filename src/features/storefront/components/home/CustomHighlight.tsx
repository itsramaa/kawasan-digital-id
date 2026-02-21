import { Link } from "react-router-dom";
import { ChevronRight, CheckCircle2, Palette, ShieldCheck, Search, Code2, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";

const FEATURES = [
  { icon: Palette, label: "Desain Eksklusif" },
  { icon: ShieldCheck, label: "Full Ownership" },
  { icon: Search, label: "SEO Ready" },
  { icon: Code2, label: "Clean Code" },
  { icon: Headphones, label: "Support Prioritas" },
];

const GRID_ICONS = [Palette, Code2, Search, ShieldCheck, Headphones, Sparkles];

export function CustomHighlight() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      id="custom-section"
      className={`bg-muted/50 border-y border-border transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 space-y-5">
          <Badge variant="secondary">Custom Project</Badge>
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
            Butuh Website yang Unik?
          </h2>
          <p className="text-muted-foreground max-w-lg">
            Tim kami siap membangun website custom sesuai kebutuhan spesifik bisnis Anda — dari desain hingga deployment.
          </p>
          <ul className="space-y-2">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                {f.label}
              </li>
            ))}
          </ul>
          <Button asChild size="lg">
            <Link to="/custom">
              Mulai Project Custom <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        {/* Gradient icon grid */}
        <div className="w-full lg:w-80 h-56 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 border border-border p-6 grid grid-cols-3 gap-4">
          {GRID_ICONS.map((Icon, i) => (
            <div
              key={i}
              className="rounded-xl bg-background/60 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform duration-300"
            >
              <Icon className="w-6 h-6 text-primary/60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
