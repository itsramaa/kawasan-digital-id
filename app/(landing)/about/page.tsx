import { Users, Target, Heart, Award } from 'lucide-react';

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Tentang Kami — Kawasan Digital' };

export default function AboutPage() {
  const values = [
    { icon: Target, title: 'Fokus pada Hasil', desc: 'Kami tidak sekadar membangun website — kami membangun aset digital yang bekerja untuk bisnis Anda.' },
    { icon: Heart, title: 'Dedikasi Penuh', desc: 'Setiap proyek dikerjakan dengan sepenuh hati, memastikan kualitas terbaik dari awal hingga akhir.' },
    { icon: Users, title: 'Tim Berpengalaman', desc: 'Tim kami terdiri dari desainer, developer, dan konsultan digital berpengalaman.' },
    { icon: Award, title: 'Terbukti & Terpercaya', desc: '150+ klien puas dan 200+ website berhasil diluncurkan sejak 2019.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Tentang Kawasan Digital</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Kami adalah agensi web development yang berdedikasi membantu bisnis Indonesia tumbuh melalui solusi digital yang profesional dan terukur.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-4 p-6 rounded-xl border border-border bg-card">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border p-10 text-center space-y-3">
        <h2 className="text-2xl font-bold">Misi Kami</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Menjadikan teknologi web mudah diakses oleh semua bisnis di Indonesia, dari UMKM hingga korporasi.
        </p>
      </div>
    </div>
  );
}
