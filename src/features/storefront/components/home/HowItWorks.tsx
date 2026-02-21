import {
  Layers, ClipboardList, CreditCard, FileText, MessageCircle,
  Code, RefreshCw, CheckCircle, Rocket, Wrench,
} from "lucide-react";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { Badge } from "@/shared/components/ui/badge";

const PHASES = [
  {
    name: "Fase 1: Pemesanan",
    steps: [
      { number: "01", icon: Layers, title: "Pilih Template / Custom", desc: "Temukan template yang sesuai atau request custom sesuai kebutuhan" },
      { number: "02", icon: ClipboardList, title: "Sesuaikan Paket", desc: "Pilih fitur dan add-on yang Anda butuhkan" },
      { number: "03", icon: CreditCard, title: "Checkout & Pembayaran", desc: "Lakukan pembayaran dengan mudah dan aman" },
    ],
  },
  {
    name: "Fase 2: Persiapan",
    steps: [
      { number: "04", icon: FileText, title: "Input Data Proyek", desc: "Kirimkan detail kebutuhan, konten, dan aset website" },
      { number: "05", icon: MessageCircle, title: "Sesi Diskusi", desc: "Diskusi brief dan konfirmasi scope bersama tim kami" },
    ],
  },
  {
    name: "Fase 3: Pengerjaan",
    steps: [
      { number: "06", icon: Code, title: "Desain & Development", desc: "Tim kami mulai mengerjakan website Anda" },
      { number: "07", icon: RefreshCw, title: "Review & Revisi", desc: "Anda review hasil, berikan feedback untuk penyempurnaan" },
      { number: "08", icon: CheckCircle, title: "Testing & QA", desc: "Pengujian menyeluruh sebelum launch" },
    ],
  },
  {
    name: "Fase 4: Launch",
    steps: [
      { number: "09", icon: Rocket, title: "Serah Terima & Launch", desc: "Website siap live dan diserahkan ke Anda" },
      { number: "10", icon: Wrench, title: "Pemeliharaan & Support", desc: "Dukungan teknis dan maintenance berkelanjutan" },
    ],
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      id="how-it-works"
      className={`bg-muted/30 border-y border-border transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16">
        <h2 className="text-xl font-bold text-foreground text-center mb-2">Cara Kerja</h2>
        <p className="text-sm text-muted-foreground text-center mb-12">
          Dari brief hingga launch dalam 10 langkah
        </p>

        <div className="space-y-10">
          {PHASES.map((phase, pi) => (
            <div key={phase.name} className="space-y-5">
              {/* Phase badge */}
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs font-semibold px-3 py-1">
                  {phase.name}
                </Badge>
                {pi < PHASES.length - 1 && (
                  <div className="flex-1 h-px bg-border" />
                )}
              </div>

              {/* Steps grid */}
              <div className={`grid gap-4 ${phase.steps.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                {phase.steps.map((step) => (
                  <div
                    key={step.number}
                    className="group relative flex gap-4 rounded-xl bg-card border border-border p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    {/* Number + Icon */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <step.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow">
                        {step.number}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">{step.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
