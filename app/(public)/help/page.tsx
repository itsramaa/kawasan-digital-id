'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Search, Mail, MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const CATEGORIES = [
  {
    id: 'umum',
    label: 'Umum',
    faqs: [
      { q: 'Apa itu Kawasan Digital?', a: 'Kawasan Digital adalah agensi web development yang menyediakan template website siap pakai dan layanan pembuatan website custom untuk bisnis Anda.' },
      { q: 'Berapa lama proses pengerjaan website?', a: 'Template standar diselesaikan dalam 3–7 hari kerja. Website custom membutuhkan 2–8 minggu tergantung kompleksitas fitur.' },
      { q: 'Apakah saya bisa minta revisi?', a: 'Ya, setiap paket memiliki kuota revisi. Revisi di luar kuota dapat dikenakan biaya tambahan sesuai kesepakatan.' },
      { q: 'Apakah ada garansi setelah website selesai?', a: 'Ya, kami memberikan garansi bug-free selama 30 hari setelah launch tanpa biaya tambahan.' },
    ],
  },
  {
    id: 'pembayaran',
    label: 'Pembayaran',
    faqs: [
      { q: 'Metode pembayaran apa yang diterima?', a: 'Kami menerima transfer bank (BCA, BNI, BRI, Mandiri), GoPay, OVO, Dana, dan QRIS.' },
      { q: 'Apakah ada uang muka (DP)?', a: 'Ya, proyek custom memerlukan DP 50% di awal. Untuk pembelian template, pembayaran dilakukan penuh di muka.' },
      { q: 'Kapan pelunasan dilakukan?', a: 'Pelunasan dilakukan setelah website selesai dan Anda menyetujui hasil akhirnya, sebelum file diserahkan.' },
      { q: 'Apakah ada refund jika tidak puas?', a: 'Kami tidak menyediakan refund setelah pengerjaan dimulai, namun kami berkomitmen untuk menyelesaikan proyek sesuai brief yang disepakati.' },
    ],
  },
  {
    id: 'teknis',
    label: 'Teknis',
    faqs: [
      { q: 'Di platform apa website saya akan dihost?', a: 'Website dapat di-deploy di Vercel, Netlify, VPS, atau hosting pilihan Anda. Kami juga menyediakan rekomendasi hosting sesuai kebutuhan.' },
      { q: 'Apakah website saya mobile-friendly?', a: 'Semua website yang kami buat responsif dan dioptimalkan untuk semua ukuran layar, termasuk mobile dan tablet.' },
      { q: 'Apakah website bisa diubah sendiri setelah selesai?', a: 'Ya, semua website dilengkapi CMS yang mudah digunakan. Kami juga menyediakan sesi onboarding untuk membantu Anda.' },
      { q: 'Apakah SEO sudah termasuk?', a: 'Setiap website dilengkapi dengan SEO dasar (meta tags, sitemap, robots.txt). Paket SEO lanjutan tersedia sebagai add-on.' },
    ],
  },
  {
    id: 'layanan',
    label: 'Layanan',
    faqs: [
      { q: 'Apa perbedaan template dan custom website?', a: 'Template adalah desain siap pakai yang dapat dikustomisasi kontennya dengan cepat dan hemat biaya. Custom website dibangun dari nol sesuai kebutuhan spesifik bisnis Anda.' },
      { q: 'Apakah tersedia paket maintenance?', a: 'Ya, kami menyediakan paket maintenance bulanan yang mencakup update konten, backup, monitoring, dan perbaikan bug minor.' },
      { q: 'Bisakah saya upgrade dari template ke custom?', a: 'Tentu. Kami dapat mengembangkan website Anda lebih lanjut dengan fitur custom kapan saja. Hubungi kami untuk konsultasi.' },
      { q: 'Apakah kalian bisa membantu migrasi website lama?', a: 'Ya, kami menyediakan layanan migrasi dari platform lain (WordPress, Wix, dll.) ke solusi baru tanpa kehilangan data.' },
    ],
  },
]

export default function HelpFAQPage() {
  const [query, setQuery] = useState('')

  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (faq) =>
        !query.trim() ||
        faq.q.toLowerCase().includes(query.toLowerCase()) ||
        faq.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((cat) => cat.faqs.length > 0)

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Pusat Bantuan</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Temukan jawaban atas pertanyaan Anda tentang layanan Kawasan Digital.
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari pertanyaan..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* FAQ categories */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-8">
          Tidak ada hasil untuk &ldquo;{query}&rdquo;.
        </p>
      ) : (
        filtered.map((cat) => (
          <section key={cat.id} className="space-y-3">
            <h2 className="text-lg font-semibold">{cat.label}</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {cat.faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`${cat.id}-${i}`}
                  className="border border-border rounded-xl px-4"
                >
                  <AccordionTrigger className="text-sm font-medium text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))
      )}

      {/* Contact section */}
      <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
        <h2 className="text-lg font-semibold">Masih butuh bantuan?</h2>
        <p className="text-sm text-muted-foreground">
          Tim kami siap membantu Anda melalui email atau WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:hello@kawasandigital.com"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Mail className="w-4 h-4" /> hello@kawasandigital.com
          </a>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 text-white px-4 py-2 text-sm font-medium hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
