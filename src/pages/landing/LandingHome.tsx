import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { useTestimonials } from "@/features/storefront/hooks/useTestimonials";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { Button } from "@/shared/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Palette, Server, Shield, Star, Users, Globe, Zap, Quote, Monitor, Tablet, Smartphone, Search, Headphones, HelpCircle } from "lucide-react";
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

const clientLogos = [
  "TechCorp", "DigitalFirst", "CloudVerse", "InnovateCo", "WebPro",
  "DataFlow", "CreativeHub", "SmartBiz", "NetSolutions", "AppForge",
];

const processSteps = [
  { num: "01", title: "Konsultasi", desc: "Diskusi mendalam tentang kebutuhan & tujuan bisnis Anda", icon: Headphones, color: "from-primary to-primary/70" },
  { num: "02", title: "Pengembangan", desc: "Desain & development dengan update progress berkala", icon: Code2, color: "from-secondary to-secondary/70" },
  { num: "03", title: "Launch", desc: "Testing, deployment, dan dukungan pasca-launch", icon: Zap, color: "from-accent to-accent/70" },
];

const faqs = [
  { q: "Berapa lama waktu pengerjaan website?", a: "Untuk template website, pengerjaan memakan waktu 3-5 hari kerja. Untuk custom development, biasanya 2-6 minggu tergantung kompleksitas proyek." },
  { q: "Apakah sudah termasuk domain dan hosting?", a: "Layanan kami fokus pada pengembangan website. Namun kami menyediakan layanan hosting dan domain terpisah dengan harga kompetitif." },
  { q: "Bagaimana proses revisi?", a: "Setiap paket menyertakan revisi. Template mendapat 2 revisi, sedangkan custom development mendapat revisi sesuai milestone yang disepakati." },
  { q: "Apakah website mobile-friendly?", a: "Ya! Semua website yang kami buat sudah responsif dan dioptimalkan untuk semua ukuran layar — desktop, tablet, dan mobile." },
  { q: "Bagaimana sistem pembayaran?", a: "Kami menggunakan sistem milestone. Pembayaran dibagi menjadi beberapa tahap sesuai progress pengerjaan proyek." },
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
            {/* Browser chrome */}
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
            {/* Content mockup */}
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
  const { data: testimonials } = useTestimonials();
  const published = testimonials?.filter((t) => t.is_published).slice(0, 3);

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

      {/* How It Works / Process */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-muted/30 via-background to-primary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Bagaimana <span className="gradient-text">Kami Bekerja</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Proses sederhana dan transparan dari awal hingga akhir.</p>
          </RevealCard>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />
            {processSteps.map((step, i) => (
              <RevealCard key={i} delay={i * 150} className="text-center relative">
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-xl relative z-10`}>
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-xs font-bold text-primary/50 mb-2">{step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Preview */}
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

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-12">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-5 shadow-lg">
              <HelpCircle className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pertanyaan <span className="gradient-text">Umum</span>
            </h2>
            <p className="text-muted-foreground">Jawaban untuk pertanyaan yang sering diajukan.</p>
          </RevealCard>
          <RevealCard delay={100}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-5 bg-card glass-card data-[state=open]:border-primary/30 transition-colors">
                  <AccordionTrigger className="hover:no-underline text-left font-semibold">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </RevealCard>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-95" />
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
