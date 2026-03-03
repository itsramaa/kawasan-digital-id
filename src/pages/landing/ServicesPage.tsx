import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import {
  Palette, Code2, Wrench, ArrowRight, CheckCircle2, Sparkles,
  Globe, Server, Database, Layers, MessageCircle,
  Zap, FileText, Gauge, Shield,
} from "lucide-react";

const services = [
  {
    icon: Layers,
    title: "Template Website",
    desc: "Pilih dari koleksi template profesional siap pakai untuk berbagai kebutuhan bisnis — dari Ecommerce hingga Company Profile.",
    features: [
      "Ecommerce, Company Profile, Landing Page",
      "Portfolio, Blog, UMKM",
      "Desain responsif semua perangkat",
      "SEO-ready & siap deploy cepat",
    ],
    cta: { label: "Lihat Template", to: "/templates" },
    color: "primary" as const,
    badge: null,
  },
  {
    icon: Code2,
    title: "Custom Development",
    desc: "Website & aplikasi web yang dibangun khusus sesuai kebutuhan unik bisnis Anda — dari desain hingga deployment.",
    features: [
      "Desain Eksklusif & Full Ownership",
      "SEO Ready & Clean Code",
      "Support Prioritas",
      "Integrasi API & database",
    ],
    cta: { label: "Mulai Project Custom", to: "/custom" },
    color: "secondary" as const,
    badge: "Populer",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    desc: "Layanan pemeliharaan berkelanjutan agar website Anda selalu optimal, aman, dan up-to-date.",
    features: [
      "Update keamanan rutin",
      "Backup otomatis",
      "Monitoring & support prioritas",
      "Speed optimization",
    ],
    cta: { label: "Hubungi Kami", to: "/landing/contact" },
    color: "accent" as const,
    badge: null,
  },
];

const colorConfig = {
  primary: { border: "border-t-primary", gradient: "from-primary to-primary/60", check: "text-primary" },
  secondary: { border: "border-t-secondary", gradient: "from-secondary to-secondary/60", check: "text-secondary" },
  accent: { border: "border-t-accent", gradient: "from-accent to-accent/60", check: "text-accent" },
};

const addons = [
  { icon: Zap, name: "SEO Setup", price: "Mulai 500rb", desc: "Optimasi mesin pencari agar website mudah ditemukan" },
  { icon: FileText, name: "Extra Page", price: "Mulai 300rb", desc: "Tambahan halaman sesuai kebutuhan bisnis Anda" },
  { icon: Gauge, name: "Speed Optimization", price: "Mulai 400rb", desc: "Percepat loading website untuk pengalaman terbaik" },
  { icon: Shield, name: "Maintenance Plan", price: "Mulai 200rb/bln", desc: "Perawatan rutin & update keamanan bulanan" },
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

      {/* Services Grid — 3 services matching storefront */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
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

      {/* Add-ons — matching storefront AddOnSection */}
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-secondary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">
              Tingkatkan <span className="gradient-text">Website Anda</span>
            </h2>
            <p className="text-muted-foreground">Tambahkan fitur ekstra untuk hasil yang lebih maksimal.</p>
          </RevealCard>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon, i) => (
              <RevealCard
                key={i}
                delay={i * 80}
                className="p-6 rounded-xl border border-border bg-card hover-lift glass-card space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <addon.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{addon.name}</h3>
                <p className="text-xs text-muted-foreground">{addon.desc}</p>
                <p className="text-xs font-medium text-primary">{addon.price}</p>
              </RevealCard>
            ))}
          </div>
          <RevealCard delay={400} className="text-center mt-10">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/templates">
                Lihat Semua di Storefront <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </RevealCard>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 border-b border-border">
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

      {/* CTA */}
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
