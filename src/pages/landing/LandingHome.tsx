import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { useTestimonials } from "@/features/storefront/hooks/useTestimonials";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Palette, Server, Shield, Star, Users, Globe, Zap, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* Animated counter hook */
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal(0.3);
  const started = useRef(false);

  useEffect(() => {
    if (!isVisible || started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return { ref, count };
}

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

function StatCard({ stat, delay }: { stat: typeof stats[0]; delay: number }) {
  const { ref, count } = useCounter(stat.value);
  return (
    <div
      ref={ref}
      className="text-center hover-lift"
      style={{ animationDelay: `${delay}ms` }}
    >
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

export default function LandingHome() {
  const { data: testimonials } = useTestimonials();
  const published = testimonials?.filter((t) => t.is_published).slice(0, 3);

  return (
    <LandingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        {/* Floating shapes */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-16 left-[15%] w-80 h-80 rounded-full bg-primary/8 blur-3xl"
            style={{ animation: "float-slow 8s ease-in-out infinite" }}
          />
          <div
            className="absolute top-40 right-[10%] w-64 h-64 rounded-full bg-secondary/10 blur-3xl"
            style={{ animation: "float-medium 6s ease-in-out infinite 1s" }}
          />
          <div
            className="absolute bottom-10 left-[40%] w-72 h-72 rounded-full bg-accent/8 blur-3xl"
            style={{ animation: "float-slow 10s ease-in-out infinite 2s" }}
          />
          {/* Geometric decorations */}
          <div
            className="absolute top-32 right-[20%] w-16 h-16 border-2 border-primary/20 rounded-lg rotate-12"
            style={{ animation: "float-medium 7s ease-in-out infinite" }}
          />
          <div
            className="absolute bottom-24 left-[20%] w-12 h-12 border-2 border-secondary/20 rounded-full"
            style={{ animation: "float-slow 9s ease-in-out infinite 1.5s" }}
          />
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

      {/* Stats */}
      <section className="py-20 border-y border-border bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <StatCard key={i} stat={s} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
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

      {/* Testimonials */}
      {published && published.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-primary/5 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealCard className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Apa Kata <span className="gradient-text">Klien Kami</span></h2>
              <p className="text-muted-foreground">Kepercayaan klien adalah kebanggaan kami.</p>
            </RevealCard>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {published.map((t, i) => (
                <RevealCard
                  key={t.id}
                  delay={i * 100}
                  className="p-6 rounded-xl bg-card border border-border hover-lift glass-card group"
                >
                  <Quote className="h-8 w-8 text-primary/20 mb-3 group-hover:text-primary/40 transition-colors" />
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">"{t.content}"</p>
                  <div className="border-t border-border pt-3">
                    <div className="font-medium text-sm">{t.client_name}</div>
                    {t.client_company && <div className="text-xs text-muted-foreground">{t.client_company}</div>}
                  </div>
                </RevealCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-95" />
        {/* Floating circles */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/5" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
        <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white/5" style={{ animation: "float-medium 6s ease-in-out infinite 1s" }} />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white/5" style={{ animation: "float-slow 10s ease-in-out infinite 2s" }} />

        <div className="relative max-w-3xl mx-auto px-4 text-center text-primary-foreground">
          <RevealCard>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Siap Memulai Proyek Digital Anda?</h2>
            <p className="opacity-90 mb-8 text-lg">Konsultasikan kebutuhan Anda dan dapatkan penawaran terbaik dari tim kami.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2 bg-white text-primary hover:bg-white/90 text-lg px-8 shadow-lg">
                <Link to="/landing/contact">Konsultasi Gratis <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 text-lg px-8">
                <Link to="/landing/portfolio">Lihat Portfolio</Link>
              </Button>
            </div>
          </RevealCard>
        </div>
      </section>
    </LandingLayout>
  );
}
