import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { Palette, Code2, Wrench, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Template Website",
    desc: "Pilih dari koleksi template profesional yang siap pakai dan mudah dikustomisasi sesuai brand Anda.",
    features: ["Desain responsif", "SEO-ready", "Multi-page layout", "Siap deploy dalam 3-5 hari"],
    cta: { label: "Lihat Template", to: "/templates" },
  },
  {
    icon: Code2,
    title: "Custom Development",
    desc: "Solusi website dan aplikasi web yang dibangun khusus sesuai kebutuhan unik bisnis Anda.",
    features: ["Analisis kebutuhan mendalam", "UI/UX design custom", "Integrasi API & database", "Testing & deployment"],
    cta: { label: "Request Custom", to: "/custom" },
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    desc: "Layanan pemeliharaan berkelanjutan agar website Anda selalu optimal, aman, dan up-to-date.",
    features: ["Monitoring 24/7", "Update keamanan rutin", "Backup otomatis", "Support prioritas"],
    cta: { label: "Hubungi Kami", to: "/landing/contact" },
  },
  {
    icon: TrendingUp,
    title: "SEO & Digital Marketing",
    desc: "Optimalkan visibilitas online bisnis Anda dengan strategi SEO dan pemasaran digital yang terukur.",
    features: ["Audit SEO menyeluruh", "Optimasi on-page & off-page", "Google Analytics setup", "Laporan performa bulanan"],
    cta: { label: "Konsultasi", to: "/landing/contact" },
  },
];

export default function ServicesPage() {
  return (
    <LandingLayout>
      {/* Hero */}
      <section className="py-20 sm:py-28 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <RevealCard>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">Layanan Kami</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Solusi digital lengkap untuk membangun, mengelola, dan mengembangkan kehadiran online bisnis Anda.
            </p>
          </RevealCard>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          {services.map((s, i) => (
            <RevealCard key={i} delay={i * 120} className="p-8 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow flex flex-col">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <s.icon className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-3">{s.title}</h2>
              <p className="text-muted-foreground mb-5 leading-relaxed">{s.desc}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {s.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="gap-2 w-fit">
                <Link to={s.cta.to}>{s.cta.label} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </RevealCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <RevealCard>
            <h2 className="text-3xl font-bold mb-4">Butuh Solusi Khusus?</h2>
            <p className="text-muted-foreground mb-8">Tim kami siap mendiskusikan kebutuhan spesifik bisnis Anda.</p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/landing/contact">Konsultasi Gratis <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </RevealCard>
        </div>
      </section>
    </LandingLayout>
  );
}
