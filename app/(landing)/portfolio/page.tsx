import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Portfolio — Kawasan Digital' };

// TODO: fetch portfolio items from Prisma
const portfolioItems = [
  { id: '1', name: 'Toko Online Fashion', category: 'E-Commerce', year: '2024', desc: 'Platform e-commerce fashion dengan fitur filter produk dan integrasi payment gateway.' },
  { id: '2', name: 'Landing Page SaaS', category: 'SaaS', year: '2024', desc: 'Landing page konversi tinggi untuk produk SaaS dengan animasi modern.' },
  { id: '3', name: 'Website Klinik', category: 'Healthcare', year: '2023', desc: 'Website klinik dengan fitur booking online dan manajemen jadwal dokter.' },
  { id: '4', name: 'Company Profile', category: 'Corporate', year: '2023', desc: 'Website company profile untuk perusahaan manufaktur dengan katalog produk.' },
  { id: '5', name: 'Portal Edukasi', category: 'Education', year: '2023', desc: 'Platform e-learning dengan video course dan sistem kuis interaktif.' },
  { id: '6', name: 'App Landing Page', category: 'Mobile App', year: '2024', desc: 'Landing page mobile app dengan animasi scroll dan demo interaktif.' },
];

export default function PortfolioPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Beberapa proyek yang telah kami kerjakan untuk klien di berbagai industri.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div key={item.id} className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-muted-foreground/40">
              <ExternalLink className="w-8 h-8" />
            </div>
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                <span className="text-xs text-muted-foreground">{item.year}</span>
              </div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
