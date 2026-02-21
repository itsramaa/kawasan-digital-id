import { Zap, FileText, Gauge, Shield } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";

const ADDONS = [
  { icon: Zap, name: "SEO Setup", desc: "Optimasi mesin pencari agar website mudah ditemukan", popular: true, price: "Mulai 500rb" },
  { icon: FileText, name: "Extra Page", desc: "Tambahan halaman sesuai kebutuhan bisnis Anda", popular: false, price: "Mulai 300rb" },
  { icon: Gauge, name: "Speed Optimization", desc: "Percepat loading website untuk pengalaman terbaik", popular: true, price: "Mulai 400rb" },
  { icon: Shield, name: "Maintenance Plan", desc: "Perawatan rutin & update keamanan bulanan", popular: false, price: "Mulai 200rb/bln" },
];

export function AddOnSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`max-w-6xl mx-auto px-4 lg:px-8 py-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <h2 className="text-xl font-bold text-foreground mb-6">Tingkatkan Website Anda</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ADDONS.map((addon) => (
          <div
            key={addon.name}
            className="relative p-5 rounded-xl border border-border bg-card space-y-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {addon.popular && (
              <Badge className="absolute top-3 right-3 bg-primary/10 text-primary text-[10px] border-0">
                Popular
              </Badge>
            )}
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <addon.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">{addon.name}</h3>
            <p className="text-xs text-muted-foreground">{addon.desc}</p>
            <p className="text-xs font-medium text-primary">{addon.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
