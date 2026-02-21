import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { Link } from "react-router-dom";
import {
  Layers, ClipboardList, CreditCard, Send, Rocket,
  MessageSquare, FileCheck, Palette, Globe, Wrench,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    icon: Layers,
    title: "1. Pilih Template atau Custom",
    desc: "Jelajahi koleksi template siap pakai kami atau mulai project custom. Setiap template sudah dioptimasi untuk performa dan SEO.",
    detail: "Anda bisa melihat live demo setiap template, membandingkan fitur, dan memilih yang paling sesuai dengan kebutuhan bisnis Anda.",
  },
  {
    icon: ClipboardList,
    title: "2. Sesuaikan Paket",
    desc: "Pilih fitur dan add-on sesuai kebutuhan. Harga ter-update secara realtime sehingga Anda selalu tahu total biaya.",
    detail: "Add-on meliputi extra pages, SEO advanced, copywriting, domain, hosting, dan maintenance plan.",
  },
  {
    icon: CreditCard,
    title: "3. Checkout & Pembayaran",
    desc: "Selesaikan pembayaran dengan metode yang tersedia. Untuk project custom, cukup bayar deposit untuk memulai.",
    detail: "Kami menerima transfer bank dan metode pembayaran digital. Invoice otomatis akan dikirim ke email Anda.",
  },
  {
    icon: Send,
    title: "4. Kirim Requirement",
    desc: "Setelah pembayaran dikonfirmasi, kirimkan konten, gambar, dan detail kebutuhan melalui dashboard client Anda.",
    detail: "Tim kami akan menghubungi Anda untuk diskusi lebih lanjut tentang desain, struktur, dan flow website.",
  },
  {
    icon: Palette,
    title: "5. Proses Desain & Development",
    desc: "Tim kami mulai mengerjakan website Anda. Anda bisa memantau progress secara realtime melalui client dashboard.",
    detail: "Setiap milestone akan di-update di dashboard. Anda akan mendapat notifikasi setiap ada progress baru.",
  },
  {
    icon: MessageSquare,
    title: "6. Review & Revisi",
    desc: "Anda mendapat kesempatan untuk me-review hasil dan memberikan feedback. Revisi dilakukan sesuai paket yang dipilih.",
    detail: "Setiap template sudah termasuk jumlah revisi tertentu. Revisi tambahan bisa dibeli sebagai add-on.",
  },
  {
    icon: Globe,
    title: "7. Domain & Hosting Setup",
    desc: "Jika Anda memilih add-on domain dan hosting, tim kami akan mengaturnya sehingga website siap online.",
    detail: "Termasuk SSL certificate, DNS configuration, dan optimasi server untuk performa terbaik.",
  },
  {
    icon: FileCheck,
    title: "8. Quality Assurance",
    desc: "Website melewati proses testing menyeluruh — responsiveness, kecepatan, SEO, dan kompatibilitas browser.",
    detail: "Kami menggunakan tools profesional untuk memastikan website Anda memenuhi standar industri.",
  },
  {
    icon: Rocket,
    title: "9. Launch!",
    desc: "Website Anda live dan siap diakses oleh pengunjung. Kami juga menyediakan training singkat untuk pengelolaan CMS.",
    detail: "Setelah launch, Anda tetap bisa menghubungi tim support kami untuk bantuan teknis.",
  },
  {
    icon: Wrench,
    title: "10. Maintenance & Support",
    desc: "Dengan maintenance plan, website Anda terus di-update dan dijaga keamanannya secara berkala.",
    detail: "Meliputi security updates, backup rutin, monitoring uptime, dan support prioritas.",
  },
];

export default function HowItWorksPage() {
  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Cara Kerja</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dari pemilihan template hingga launch, berikut langkah-langkah lengkap untuk mendapatkan website impian Anda.
          </p>
        </div>

        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex gap-4 sm:gap-6">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border mt-2" />
                )}
              </div>
              {/* Content */}
              <div className="pb-8 space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
                <p className="text-sm text-muted-foreground/80">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pt-4">
          <h2 className="text-xl font-bold text-foreground">Siap Memulai?</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/store/templates"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse Templates <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/store/custom"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
            >
              Custom Website
            </Link>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
