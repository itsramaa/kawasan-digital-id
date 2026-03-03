import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { useCounter } from "@/shared/hooks/useCounter";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Palette, Server, Shield, Star, Users, Globe, Zap, Monitor, Tablet, Smartphone, Search, Layers, Wrench, Briefcase, Image } from "lucide-react";
import { useState } from "react";

const stats = [
  { value: 50, suffix: "+", label: "Klien Aktif", icon: Users, color: "from-primary to-primary/70" },
  { value: 100, suffix: "+", label: "Website Dibuat", icon: Globe, color: "from-secondary to-secondary/70" },
  { value: 99, suffix: "%", label: "Kepuasan Klien", icon: Star, color: "from-accent to-accent/70" },
  { value: 24, suffix: "/7", label: "Dukungan Teknis", icon: Zap, color: "from-destructive to-destructive/70" },
];

const highlights = [
  { icon: Palette, title: "Desain Modern", desc: "UI/UX yang menarik dan responsif untuk semua perangkat", accent: "primary" as const },
  { icon: Code2, title: "Teknologi Terkini", desc: "Dibangun dengan stack modern untuk performa optimal", accent: "secondary" as const },
  { icon: Server, title: "Hosting Andal", desc: "Infrastruktur cloud yang cepat dan aman", accent: "accent" as const },
  { icon: Shield, title: "Keamanan Terjamin", desc: "SSL, backup otomatis, dan proteksi berlapis", accent: "destructive" as const },
];

const accentMap = {
  primary: "bg-primary/10 text-primary colored-shadow-primary",
  secondary: "bg-secondary/10 text-secondary colored-shadow-secondary",
  accent: "bg-accent/10 text-accent colored-shadow-accent",
  destructive: "bg-destructive/10 text-destructive",
};

const borderMap = {
  primary: "border-t-primary",
  secondary: "border-t-secondary",
  accent: "border-t-accent",
  destructive: "border-t-destructive",
};

const clientLogos = [
  "TechCorp", "DigitalFirst", "CloudVerse", "InnovateCo", "WebPro",
  "DataFlow", "CreativeHub", "SmartBiz", "NetSolutions", "AppForge",
];

const services = [
  { icon: Layers, title: "Template Website", desc: "Koleksi template untuk Ecommerce, Company Profile, Landing Page, Portfolio, Blog & UMKM — responsif dan SEO-ready.", link: "/templates", color: "from-primary to-primary/70" },
  { icon: Code2, title: "Custom Development", desc: "Desain eksklusif, full ownership, SEO ready, clean code & support prioritas — dibangun khusus untuk bisnis Anda.", link: "/custom", color: "from-secondary to-secondary/70" },
  { icon: Wrench, title: "Maintenance & Support", desc: "SEO setup, speed optimization, extra page & maintenance plan — jaga website tetap optimal.", link: "/landing/services", color: "from-accent to-accent/70" },
];

const portfolioHighlights = [
  { title: "E-Commerce Platform", category: "Ecommerce", desc: "Toko online modern dengan payment gateway terintegrasi.", image: null },
  { title: "Company Profile", category: "Company Profile", desc: "Website profesional untuk perusahaan manufaktur nasional.", image: null },
  { title: "SaaS Landing Page", category: "Landing Page", desc: "Landing page high-converting untuk startup teknologi.", image: null },
];

function StatCard({ stat, delay }: { stat: typeof stats[0]; delay: number }) {
  const { ref, count } = useCounter(stat.value);
  return (
    <div ref={ref} className="text-center hover-lift" style={{ animationDelay: `${delay}ms` }}>
      <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
        <stat.icon className="h-7 w-7 text-primary-foreground" />
      </div>
      <div className="text-3xl sm:text-4xl font-extrabold text-foreground tabular-nums">
        {count}{stat.suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
    </div>
  );
}

function DevicePreview() {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const devices = [
    { key: "desktop" as const, label: "Desktop", icon: Monitor },
    { key: "tablet" as const, label: "Tablet", icon: Tablet },
    { key: "mobile" as const, label: "Mobile", icon: Smartphone },
  ];
  const widthMap = { desktop: "w-full", tablet: "w-[65%]", mobile: "w-[35%]" };

  return (
    <div>
      <div className="flex justify-center gap-2 mb-8">
        {devices.map((d) => (
          <button
            key={d.key}
            onClick={() => setDevice(d.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              device === d.key
                ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg colored-shadow-primary"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <d.icon className="h-4 w-4" />
            {d.label}
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        <div className={`${widthMap[device]} transition-all duration-500 ease-out`}>
          <div className="rounded-2xl border-4 border-foreground/10 bg-card overflow-hidden shadow-2xl">
            <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-status-warning/60" />
                <div className="w-3 h-3 rounded-full bg-status-success/60" />
              </div>
              <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center gap-1">
                <Search className="h-3 w-3" />
                kawasandigital.com
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="h-8 w-3/4 rounded bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted" />
              <div className="h-32 rounded-lg bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 rounded bg-muted" />
                <div className="h-20 rounded bg-muted" />
                <div className="h-20 rounded bg-muted" />
              </div>
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-10 w-40 rounded-lg bg-gradient-to-r from-primary to-secondary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingHome() {
  return (
    <LandingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-16 left-[15%] w-80 h-80 rounded-full bg-primary/8 blur-3xl" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
          <div className="absolute top-40 right-[10%] w-64 h-64 rounded-full bg-secondary/10 blur-3xl" style={{ animation: "float-medium 6s ease-in-out infinite 1s" }} />
          <div className="absolute bottom-10 left-[40%] w-72 h-72 rounded-full bg-accent/8 blur-3xl" style={{ animation: "float-slow 10s ease-in-out infinite 2s" }} />
          <div className="absolute top-32 right-[20%] w-16 h-16 border-2 border-primary/20 rounded-lg rotate-12" style={{ animation: "float-medium 7s ease-in-out infinite" }} />
          <div className="absolute bottom-24 left-[20%] w-12 h-12 border-2 border-secondary/20 rounded-full" style={{ animation: "float-slow 9s ease-in-out infinite 1.5s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealCard>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              <span>Partner Digital Terpercaya Anda</span>
            </div>
          </RevealCard>
          <RevealCard delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Wujudkan Kehadiran
              <br className="hidden sm:block" />
              <span className="gradient-text"> Digital yang Profesional</span>
            </h1>
          </RevealCard>
          <RevealCard delay={200}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Kawasan Digital membantu bisnis Anda tampil online dengan website modern, cepat, dan berdampak. Dari template siap pakai hingga solusi custom.
            </p>
          </RevealCard>
          <RevealCard delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity border-0 shadow-lg colored-shadow-primary text-lg px-8">
                <Link to="/landing/services">Lihat Layanan <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 hover:bg-primary/5">
                <Link to="/landing/contact">Hubungi Kami</Link>
              </Button>
            </div>
          </RevealCard>
        </div>
      </section>

      {/* Trusted By / Client Marquee */}
      <section className="py-12 border-y border-border bg-muted/30 overflow-hidden">
        <RevealCard className="text-center mb-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Dipercaya oleh perusahaan terkemuka</p>
        </RevealCard>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted/30 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted/30 to-transparent z-10" />
          <div className="flex animate-marquee">
            {[...clientLogos, ...clientLogos].map((name, i) => (
              <div key={i} className="flex-shrink-0 mx-8 flex items-center justify-center h-12 px-6 rounded-lg bg-card border border-border">
                <span className="text-lg font-bold text-muted-foreground/50 whitespace-nowrap">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-b border-border bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <StatCard key={i} stat={s} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Highlights / Why Us */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Mengapa <span className="gradient-text">Kawasan Digital</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Kami menggabungkan kreativitas dan teknologi untuk menghadirkan solusi digital terbaik.</p>
          </RevealCard>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((h, i) => (
              <RevealCard
                key={i}
                delay={i * 120}
                className={`p-6 rounded-xl border-t-4 ${borderMap[h.accent]} border border-border bg-card hover-lift glass-card`}
              >
                <div className={`h-12 w-12 rounded-lg ${accentMap[h.accent]} flex items-center justify-center mb-4 transition-transform duration-300`}>
                  <h.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview (unique to Landing) */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-muted/30 via-background to-primary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Layanan <span className="gradient-text">Kami</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Solusi lengkap untuk kebutuhan digital bisnis Anda.</p>
          </RevealCard>
          <div className="grid sm:grid-cols-3 gap-8">
            {services.map((svc, i) => (
              <RevealCard key={i} delay={i * 120}>
                <Link
                  to={svc.link}
                  className="block p-8 rounded-2xl border border-border bg-card hover-lift glass-card group h-full"
                >
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <svc.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{svc.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{svc.desc}</p>
                  <span className="text-sm font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Pelajari Lebih Lanjut <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      {/* Device Preview */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Preview <span className="gradient-text">Responsif</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Lihat bagaimana website Anda tampil di berbagai perangkat.</p>
          </RevealCard>
          <RevealCard delay={100}>
            <DevicePreview />
          </RevealCard>
        </div>
      </section>

      {/* Portfolio Showcase (unique to Landing) */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-muted/30 via-background to-secondary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Hasil Karya <span className="gradient-text">Kami</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Beberapa proyek terbaik yang telah kami selesaikan.</p>
          </RevealCard>
          <div className="grid sm:grid-cols-3 gap-8">
            {portfolioHighlights.map((project, i) => (
              <RevealCard key={i} delay={i * 120}>
                <div className="rounded-2xl border border-border bg-card overflow-hidden hover-lift glass-card group">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
                    <Image className="h-10 w-10 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{project.category}</span>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.desc}</p>
                  </div>
                </div>
              </RevealCard>
            ))}
          </div>
          <RevealCard delay={400} className="text-center mt-10">
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/landing/portfolio">
                Lihat Semua Portfolio <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </RevealCard>
        </div>
      </section>

      {/* CTA - Unique side-by-side layout (different from storefront gradient CTA) */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <RevealCard>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Siap <span className="gradient-text">Memulai?</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Jelajahi template website kami di storefront atau konsultasikan kebutuhan custom Anda dengan tim kami. Kami siap membantu bisnis Anda tampil profesional secara online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity border-0 shadow-lg colored-shadow-primary">
                  <Link to="/templates">Kunjungi Storefront <ArrowRight className="h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="hover:bg-primary/5">
                  <Link to="/landing/contact">Konsultasi Gratis</Link>
                </Button>
              </div>
            </RevealCard>
            <RevealCard delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Briefcase, label: "50+ Klien Puas", color: "from-primary to-primary/70" },
                  { icon: Globe, label: "100+ Website Live", color: "from-secondary to-secondary/70" },
                  { icon: Shield, label: "Garansi Kualitas", color: "from-accent to-accent/70" },
                  { icon: Zap, label: "Support 24/7", color: "from-destructive to-destructive/70" },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-xl glass-card border border-border hover-lift text-center">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                      <item.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </RevealCard>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
