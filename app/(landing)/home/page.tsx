import Link from 'next/link';
import { Globe, ArrowRight, Sparkles, Users, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Kawasan Digital — Solusi Website Profesional' };

export default function LandingHomePage() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/8" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4" /> Agensi Digital Terpercaya
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Wujudkan Kehadiran Digital<br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Bisnis Anda</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kami membangun website profesional yang menghasilkan. Dari template siap pakai hingga solusi kustom, kami partner digital Anda.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary border-0">
              <Link href="/services">Lihat Layanan <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/portfolio">Lihat Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '150+', label: 'Klien Puas' },
            { value: '200+', label: 'Website Dibuat' },
            { value: '5 Tahun', label: 'Pengalaman' },
            { value: '4.9/5', label: 'Rating Klien' },
          ].map((s) => (
            <div key={s.label} className="space-y-1">
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center space-y-6">
        <h2 className="text-3xl font-bold">Siap Memulai?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Hubungi kami sekarang dan dapatkan konsultasi gratis untuk proyek digital Anda.</p>
        <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary border-0">
          <Link href="/contact">Konsultasi Gratis</Link>
        </Button>
      </section>
    </div>
  );
}
