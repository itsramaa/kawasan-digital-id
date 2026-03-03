import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { Palette, Code2, Wrench, TrendingUp, ArrowRight, CheckCircle2, Sparkles, X, Check, Globe, Server, Database, Layers, MessageCircle } from "lucide-react";

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

const pricingPlans = [
  {
    name: "Starter",
    price: "2.5",
    unit: "juta",
    desc: "Cocok untuk bisnis kecil & personal branding",
    features: [
      { name: "Template website", included: true },
      { name: "Desain responsif", included: true },
      { name: "1 halaman", included: true },
      { name: "2x revisi", included: true },
      { name: "Custom domain", included: false },
      { name: "SEO optimization", included: false },
      { name: "Maintenance bulanan", included: false },
    ],
    color: "primary" as const,
    popular: false,
  },
  {
    name: "Professional",
    price: "7.5",
    unit: "juta",
    desc: "Ideal untuk bisnis yang sedang berkembang",
    features: [
      { name: "Custom design", included: true },
      { name: "Desain responsif", included: true },
      { name: "5 halaman", included: true },
      { name: "5x revisi", included: true },
      { name: "Custom domain", included: true },
      { name: "SEO optimization", included: true },
      { name: "Maintenance 3 bulan", included: false },
    ],
    color: "secondary" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "15",
    unit: "juta+",
    desc: "Solusi lengkap untuk skala besar",
    features: [
      { name: "Custom development", included: true },
      { name: "Desain responsif", included: true },
      { name: "Unlimited halaman", included: true },
      { name: "Unlimited revisi", included: true },
      { name: "Custom domain", included: true },
      { name: "SEO optimization", included: true },
      { name: "Maintenance 12 bulan", included: true },
    ],
    color: "accent" as const,
    popular: false,
  },
];

const techStack = [
  { name: "React", icon: Code2 },
  { name: "TypeScript", icon: Code2 },
  { name: "Tailwind CSS", icon: Palette },
  { name: "Node.js", icon: Server },
  { name: "PostgreSQL", icon: Database },
  { name: "Next.js", icon: Layers },
  { name: "Figma", icon: Palette },
  { name: "AWS", icon: Globe },
];

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

      {/* Tech Stack (moved from About) */}
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-secondary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">
              Teknologi <span className="gradient-text">yang Kami Gunakan</span>
            </h2>
            <p className="text-muted-foreground">Stack modern untuk performa dan skalabilitas terbaik.</p>
          </RevealCard>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {techStack.map((tech, i) => (
              <RevealCard
                key={i}
                delay={i * 80}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover-lift glass-card cursor-default"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                  <tech.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{tech.name}</span>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pilih <span className="gradient-text">Paket Anda</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Harga transparan tanpa biaya tersembunyi.</p>
          </RevealCard>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => {
              const c = colorConfig[plan.color];
              return (
                <RevealCard
                  key={i}
                  delay={i * 120}
                  className={`relative p-8 rounded-xl border-t-4 ${c.border} border border-border bg-card flex flex-col glass-card hover-lift ${plan.popular ? "ring-2 ring-secondary/50 scale-[1.02]" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-secondary to-accent text-xs font-bold text-primary-foreground shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Populer
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{plan.desc}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">Rp {plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">{plan.unit}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm">
                        {f.included ? (
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                        )}
                        <span className={f.included ? "text-foreground" : "text-muted-foreground/60"}>{f.name}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className={`gap-2 w-full ${plan.popular ? "bg-gradient-to-r from-secondary to-accent hover:opacity-90 border-0 shadow-lg" : ""}`} variant={plan.popular ? "default" : "outline"}>
                    <Link to="/landing/contact">Pilih Paket <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </RevealCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA - Unique design: card-based with consultation focus */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-muted/30 via-background to-primary/5 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <RevealCard>
            <div className="p-10 rounded-2xl glass-card border border-border">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-xl">
                <MessageCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Butuh Solusi Khusus?</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Tim kami siap mendiskusikan kebutuhan spesifik bisnis Anda. Dapatkan konsultasi gratis dan penawaran yang disesuaikan.
              </p>
              <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity border-0 shadow-lg colored-shadow-primary text-lg px-8">
                <Link to="/landing/contact">Konsultasi Gratis <ArrowRight className="h-5 w-5" /></Link>
              </Button>
            </div>
          </RevealCard>
        </div>
      </section>
    </LandingLayout>
  );
}
