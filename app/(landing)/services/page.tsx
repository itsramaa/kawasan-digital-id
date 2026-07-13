import Link from 'next/link';
import { ArrowRight, Globe, Paintbrush, Wrench, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Layanan — Kawasan Digital' };

const services = [
  {
    icon: Globe,
    title: 'Website Template',
    desc: 'Template profesional siap pakai dengan berbagai kategori bisnis. Cepat, terjangkau, dan mudah disesuaikan.',
    href: '/templates',
    cta: 'Lihat Template',
  },
  {
    icon: Paintbrush,
    title: 'Custom Website',
    desc: 'Website kustom dibangun dari nol sesuai kebutuhan dan identitas brand Anda.',
    href: '/custom',
    cta: 'Konsultasi Gratis',
  },
  {
    icon: Wrench,
    title: 'Website Maintenance',
    desc: 'Layanan pemeliharaan website bulanan termasuk update konten, backup, dan monitoring.',
    href: '/contact',
    cta: 'Hubungi Kami',
  },
  {
    icon: ShieldCheck,
    title: 'SEO & Digital Marketing',
    desc: 'Optimalkan website Anda di mesin pencari dan tingkatkan visibilitas bisnis secara online.',
    href: '/contact',
    cta: 'Pelajari Lebih',
  },
];

export default function ServicesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Layanan Kami</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Solusi digital lengkap untuk kebutuhan bisnis Anda — dari pembuatan website hingga pemasaran digital.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(({ icon: Icon, title, desc, href, cta }) => (
          <div key={title} className="p-6 rounded-xl border border-border bg-card space-y-4 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={href}>{cta} <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
