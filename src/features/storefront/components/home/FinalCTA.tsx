import { Link } from "react-router-dom";
import { MessageCircle, Shield, Award, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";

const TRUST_ITEMS = [
  { icon: Shield, label: "Garansi Uang Kembali" },
  { icon: Award, label: "100+ Proyek Selesai" },
  { icon: Clock, label: "Support 24/7" },
];

export function FinalCTA() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`bg-primary transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 text-center space-y-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground">
          Start Your Website Today
        </h2>
        <p className="text-primary-foreground/80 max-w-lg mx-auto">
          Mulai perjalanan digital bisnis Anda bersama Kawasan Digital.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link to="/templates">Browse Templates</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/how-it-works">
              <MessageCircle className="w-4 h-4" /> Konsultasi Gratis
            </Link>
          </Button>
        </div>
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 pt-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-primary-foreground/70 text-sm">
              <item.icon className="w-4 h-4" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
