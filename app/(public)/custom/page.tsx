import Link from 'next/link';
import { Sparkles, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic'

// TODO: Add custom website quote form with Server Action

export default function CustomWebsitePage() {
  const features = [
    'Desain unik sesuai brand Anda',
    'Fitur kustom sesuai kebutuhan bisnis',
    'Konsultasi gratis sebelum pengerjaan',
    'Revisi hingga puas',
    'Support pasca-launch',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1.5 rounded-full">
          <Sparkles className="w-4 h-4" /> Custom Website
        </div>
        <h1 className="text-4xl font-bold">Website Kustom untuk Bisnis Anda</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Tidak menemukan template yang cocok? Kami siap membangun website impian Anda dari nol, sesuai kebutuhan dan brand bisnis Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Yang Anda Dapatkan</h2>
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border p-6 space-y-4 bg-card">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Konsultasi Gratis
          </h2>
          <p className="text-sm text-muted-foreground">
            Ceritakan kebutuhan Anda dan dapatkan estimasi harga & waktu pengerjaan secara gratis.
          </p>
          {/* TODO: Add quote request form with Server Action */}
          <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary border-0">
            <Link href="/contact">
              Hubungi Kami <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
