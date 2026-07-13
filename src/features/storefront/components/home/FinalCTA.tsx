import Link from "next/link";
import { MessageCircle, Shield, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/src/features/storefront/hooks/useScrollReveal";

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
      className={`relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-95" />
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/5" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
      <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white/5" style={{ animation: "float-medium 6s ease-in-out infinite 1s" }} />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center space-y-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground">
          Start Your Website Today
        </h2>
        <p className="text-primary-foreground/80 max-w-lg mx-auto">
          Mulai perjalanan digital bisnis Anda bersama Kawasan Digital.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
            <Link href="/templates">Browse Templates</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 text-primary-foreground hover:bg-white/10">
            <Link href="/custom">
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
