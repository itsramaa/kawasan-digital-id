import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { Palette, Code2, Wrench, TrendingUp, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Template Website",
    desc: "Pilih dari koleksi template profesional yang siap pakai dan mudah dikustomisasi sesuai brand Anda.",
    features: ["Desain responsif", "SEO-ready", "Multi-page layout", "Siap deploy dalam 3-5 hari"],
    cta: { label: "Lihat Template", to: "/templates" },
    color: "primary" as const,
    badge: null,
  },
  {
    icon: Code2,
    title: "Custom Development",
    desc: "Solusi website dan aplikasi web yang dibangun khusus sesuai kebutuhan unik bisnis Anda.",
    features: ["Analisis kebutuhan mendalam", "UI/UX design custom", "Integrasi API & database", "Testing & deployment"],
    cta: { label: "Request Custom", to: "/custom" },
    color: "secondary" as const,
    badge: "Populer",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    desc: "Layanan pemeliharaan berkelanjutan agar website Anda selalu optimal, aman, dan up-to-date.",
    features: ["Monitoring 24/7", "Update keamanan rutin", "Backup otomatis", "Support prioritas"],
    cta: { label: "Hubungi Kami", to: "/landing/contact" },
    color: "accent" as const,
    badge: null,
  },
  {
    icon: TrendingUp,
    title: "SEO & Digital Marketing",
    desc: "Optimalkan visibilitas online bisnis Anda dengan strategi SEO dan pemasaran digital yang terukur.",
    features: ["Audit SEO menyeluruh", "Optimasi on-page & off-page", "Google Analytics setup", "Laporan performa bulanan"],
    cta: { label: "Konsultasi", to: "/landing/contact" },
    color: "destructive" as const,
    badge: null,
  },
];

const colorConfig = {
  primary: { border: "border-t-primary", gradient: "from-primary to-primary/60", shadow: "colored-shadow-primary", check: "text-primary" },
  secondary: { border: "border-t-secondary", gradient: "from-secondary to-secondary/60", shadow: "colored-shadow-secondary", check: "text-secondary" },
  accent: { border: "border-t-accent", gradient: "from-accent to-accent/60", shadow: "colored-shadow-accent", check: "text-accent" },
  destructive: { border: "border-t-destructive", gradient: "from-destructive to-destructive/60", shadow: "", check: "text-destructive" },
};

export default function ServicesPage() {
  return (
    <LandingLayout>
      {/* Hero */}
      <section className="relative py-20 sm:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
          <div className="absolute bottom-10 left-1/4 w-60 h-60 bg-accent/8 rounded-full blur-3xl" style={{ animation: "float-medium 6s ease-in-out infinite 1s" }} />
        </div>
        <div className="max-w-3xl mx-auto px-4">
          <RevealCard>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              <span className="gradient-text">Layanan</span> Kami
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Solusi digital lengkap untuk membangun, mengelola, dan mengembangkan kehadiran online bisnis Anda.
            </p>
          </RevealCard>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          {services.map((s, i) => {
            const c = colorConfig[s.color];
            return (
              <RevealCard
                key={i}
                delay={i * 120}
                className={`relative p-8 rounded-xl border-t-4 ${c.border} border border-border bg-card hover-lift glass-card flex flex-col`}
              >
                {s.badge && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-secondary to-accent text-xs font-semibold text-primary-foreground">
                    <Sparkles className="h-3 w-3" />
                    {s.badge}
                  </div>
                )}
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  <s.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-3">{s.title}</h2>
                <p className="text-muted-foreground mb-5 leading-relaxed">{s.desc}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {s.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className={`h-4 w-4 ${c.check} flex-shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="gap-2 w-fit hover:bg-primary/5 transition-colors">
                  <Link to={s.cta.to}>{s.cta.label} <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </RevealCard>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-95" />
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/5" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
        <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white/5" style={{ animation: "float-medium 6s ease-in-out infinite 1s" }} />

        <div className="relative max-w-3xl mx-auto px-4 text-center text-primary-foreground">
          <RevealCard>
            <h2 className="text-3xl font-bold mb-4">Butuh Solusi Khusus?</h2>
            <p className="opacity-90 mb-8 text-lg">Tim kami siap mendiskusikan kebutuhan spesifik bisnis Anda.</p>
            <Button asChild size="lg" className="gap-2 bg-white text-primary hover:bg-white/90 text-lg px-8 shadow-lg">
              <Link to="/landing/contact">Konsultasi Gratis <ArrowRight className="h-5 w-5" /></Link>
            </Button>
          </RevealCard>
        </div>
      </section>
    </LandingLayout>
  );
}
