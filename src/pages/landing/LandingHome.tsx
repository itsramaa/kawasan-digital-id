import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { useTestimonials } from "@/features/storefront/hooks/useTestimonials";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Palette, Server, Shield, Star, Users, Globe, Zap } from "lucide-react";

const stats = [
  { value: "50+", label: "Klien Aktif", icon: Users },
  { value: "100+", label: "Website Dibuat", icon: Globe },
  { value: "99%", label: "Kepuasan Klien", icon: Star },
  { value: "24/7", label: "Dukungan Teknis", icon: Zap },
];

const highlights = [
  { icon: Palette, title: "Desain Modern", desc: "UI/UX yang menarik dan responsif untuk semua perangkat" },
  { icon: Code2, title: "Teknologi Terkini", desc: "Dibangun dengan stack modern untuk performa optimal" },
  { icon: Server, title: "Hosting Andal", desc: "Infrastruktur cloud yang cepat dan aman" },
  { icon: Shield, title: "Keamanan Terjamin", desc: "SSL, backup otomatis, dan proteksi berlapis" },
];

export default function LandingHome() {
  const { data: testimonials } = useTestimonials();
  const published = testimonials?.filter((t) => t.is_published).slice(0, 3);

  return (
    <LandingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Zap className="h-4 w-4" /> Partner Digital Terpercaya Anda
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-primary">
            Wujudkan Kehadiran Digital<br className="hidden sm:block" /> yang Profesional
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Kawasan Digital membantu bisnis Anda tampil online dengan website modern, cepat, dan berdampak. Dari template siap pakai hingga solusi custom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/landing/services">Lihat Layanan <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/landing/contact">Hubungi Kami</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <RevealCard key={i} delay={i * 100} className="text-center">
                <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl sm:text-4xl font-extrabold text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Mengapa Kawasan Digital?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Kami menggabungkan kreativitas dan teknologi untuk menghadirkan solusi digital terbaik.</p>
          </RevealCard>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((h, i) => (
              <RevealCard key={i} delay={i * 120} className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <h.icon className="h-6 w-6 text-primary" />
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
        <section className="py-20 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealCard className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Apa Kata Klien Kami</h2>
              <p className="text-muted-foreground">Kepercayaan klien adalah kebanggaan kami.</p>
            </RevealCard>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {published.map((t, i) => (
                <RevealCard key={t.id} delay={i * 100} className="p-6 rounded-xl bg-card border border-border">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">"{t.content}"</p>
                  <div className="font-medium text-sm">{t.client_name}</div>
                  {t.client_company && <div className="text-xs text-muted-foreground">{t.client_company}</div>}
                </RevealCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <RevealCard>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Siap Memulai Proyek Digital Anda?</h2>
            <p className="text-muted-foreground mb-8">Konsultasikan kebutuhan Anda dan dapatkan penawaran terbaik dari tim kami.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/landing/contact">Konsultasi Gratis <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/landing/portfolio">Lihat Portfolio</Link>
              </Button>
            </div>
          </RevealCard>
        </div>
      </section>
    </LandingLayout>
  );
}
