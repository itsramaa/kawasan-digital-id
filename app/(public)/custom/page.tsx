export const dynamic = 'force-dynamic'

import { Sparkles, Palette, Zap, HeadphonesIcon } from 'lucide-react'
import ContactForm from '@/components/contact-form'

const BENEFITS = [
  {
    icon: Palette,
    title: 'Desain Unik',
    desc: 'Tampilan yang benar-benar mencerminkan brand Anda — bukan template generik.',
  },
  {
    icon: Zap,
    title: 'Fitur Custom',
    desc: 'Dari sistem booking hingga dashboard khusus, kami bangun sesuai alur kerja bisnis Anda.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Support Dedicated',
    desc: 'Satu tim yang mengenal proyek Anda dari awal hingga pasca-launch.',
  },
]

const STEPS = [
  { n: '01', title: 'Konsultasi', desc: 'Kami pelajari kebutuhan, tujuan bisnis, dan referensi desain Anda.' },
  { n: '02', title: 'Desain', desc: 'Tim desainer kami membuat mockup dan wireframe untuk review bersama.' },
  { n: '03', title: 'Development', desc: 'Pembangunan website dengan standar kode modern, aman, dan scalable.' },
  { n: '04', title: 'Launch', desc: 'Deployment, testing, dan serah terima dengan sesi onboarding lengkap.' },
]

export default function CustomWebsitePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 space-y-20">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1.5 rounded-full">
          <Sparkles className="w-4 h-4" /> Custom Website
        </div>
        <h1 className="text-4xl font-bold">Website Custom Sesuai Kebutuhan Anda</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Tidak menemukan template yang cocok? Kami membangun website impian Anda dari nol — sesuai brand, fitur, dan skala bisnis Anda.
        </p>
      </div>

      {/* Benefits */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Kenapa Pilih Custom?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6 space-y-3 hover-lift">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Proses Pengerjaan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative space-y-3">
              {/* connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-5 left-[calc(100%-8px)] w-full h-px bg-border z-0" />
              )}
              <div className="relative z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {step.n}
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — ContactForm */}
      <section className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Mulai Konsultasi Gratis</h2>
          <p className="text-muted-foreground text-sm">
            Ceritakan kebutuhan Anda dan dapatkan estimasi harga & waktu pengerjaan.
          </p>
        </div>
        <ContactForm />
      </section>
    </div>
  )
}
