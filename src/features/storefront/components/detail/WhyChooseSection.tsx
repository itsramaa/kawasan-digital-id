'use client'

import { Palette, Search, KeyRound, Headphones } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { cn } from "@/src/lib/utils";

const reasons = [
  { icon: Palette, title: "Desain Profesional", desc: "Dibuat oleh tim desainer berpengalaman dengan standar industri terkini." },
  { icon: Search, title: "SEO Optimized", desc: "Struktur kode & konten dioptimalkan untuk mesin pencari sejak awal." },
  { icon: KeyRound, title: "Full Ownership", desc: "Semua source code & aset menjadi milik Anda sepenuhnya setelah selesai." },
  { icon: Headphones, title: "Support Responsif", desc: "Tim kami siap membantu Anda kapan saja selama masa garansi." },
];

export function WhyChooseSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={cn(
        "space-y-6 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <h2 className="text-xl font-bold text-foreground text-center">Mengapa Memilih Template Ini?</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {reasons.map((r) => (
          <div key={r.title} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <r.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
