import { Link } from "react-router-dom";
import { Layers, ClipboardList, CreditCard, Send, Rocket, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";

const STEPS = [
  { icon: Layers, title: "Pilih Template / Custom", desc: "Temukan template yang sesuai atau request custom" },
  { icon: ClipboardList, title: "Sesuaikan Paket", desc: "Pilih fitur dan add-on yang Anda butuhkan" },
  { icon: CreditCard, title: "Checkout", desc: "Lakukan pembayaran dengan mudah dan aman" },
  { icon: Send, title: "Kirim Requirement", desc: "Kirimkan detail kebutuhan dan konten website" },
  { icon: Rocket, title: "Review & Launch", desc: "Review hasil, revisi, dan website siap live!" },
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
        <p className="text-sm text-muted-foreground text-center mb-10">Dari brief hingga launch dalam 5 langkah mudah</p>

        <div className="relative grid sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-border" />

          {STEPS.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center space-y-3">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/how-it-works" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            Pelajari Lebih Lanjut <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
