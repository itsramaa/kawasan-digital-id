'use client'

import Link from "next/link";
import {
  Layers, ClipboardList, CreditCard, Send, Rocket,
  MessageSquare, FileCheck, Palette, Globe, Wrench,
  ArrowRight, CheckCircle2, Star, Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useScrollReveal } from "@/src/features/storefront/hooks/useScrollReveal";
import { cn } from "@/src/lib/utils";

const PHASES = [
  {
    title: "Persiapan",
    subtitle: "Tentukan kebutuhan & mulai project",
    steps: [
      { icon: Layers, title: "Pilih Template atau Custom", desc: "Jelajahi koleksi template siap pakai kami atau mulai project custom.", detail: "Anda bisa melihat live demo setiap template, membandingkan fitur, dan memilih yang paling sesuai." },
      { icon: ClipboardList, title: "Sesuaikan Paket", desc: "Pilih fitur dan add-on sesuai kebutuhan. Harga ter-update secara realtime.", detail: "Add-on meliputi extra pages, SEO advanced, copywriting, domain, hosting, dan maintenance plan." },
      { icon: CreditCard, title: "Checkout & Pembayaran", desc: "Selesaikan pembayaran dengan metode yang tersedia.", detail: "Kami menerima transfer bank dan metode pembayaran digital. Invoice otomatis dikirim ke email." },
    ],
  },
  {
    title: "Pengerjaan",
    subtitle: "Tim kami mulai bekerja untuk Anda",
    steps: [
      { icon: Send, title: "Kirim Requirement", desc: "Kirimkan konten, gambar, dan detail kebutuhan melalui dashboard client.", detail: "Tim kami akan menghubungi Anda untuk diskusi lebih lanjut tentang desain dan flow website." },
      { icon: Palette, title: "Proses Desain & Development", desc: "Tim kami mengerjakan website Anda. Pantau progress secara realtime.", detail: "Setiap milestone akan di-update di dashboard dengan notifikasi progress baru." },
      { icon: MessageSquare, title: "Review & Revisi", desc: "Review hasil dan berikan feedback. Revisi sesuai paket yang dipilih.", detail: "Setiap template termasuk jumlah revisi tertentu. Revisi tambahan bisa dibeli sebagai add-on." },
    ],
  },
  {
    title: "Finalisasi",
    subtitle: "Persiapan menuju launch",
    steps: [
      { icon: Globe, title: "Domain & Hosting Setup", desc: "Tim kami mengatur domain dan hosting sehingga website siap online.", detail: "Termasuk SSL certificate, DNS configuration, dan optimasi server." },
      { icon: FileCheck, title: "Quality Assurance", desc: "Testing menyeluruh — responsiveness, kecepatan, SEO, dan browser.", detail: "Kami menggunakan tools profesional untuk memastikan standar industri terpenuhi." },
      { icon: Rocket, title: "Launch!", desc: "Website Anda live! Kami juga menyediakan training singkat untuk CMS.", detail: "Setelah launch, tim support kami tetap siap membantu." },
    ],
  },
  {
    title: "After-Launch",
    subtitle: "Dukungan berkelanjutan",
    steps: [
      { icon: Wrench, title: "Maintenance & Support", desc: "Website terus di-update dan dijaga keamanannya secara berkala.", detail: "Meliputi security updates, backup rutin, monitoring uptime, dan support prioritas." },
    ],
  },
];

function StepCard({ step, stepNumber, isRight }: { step: typeof PHASES[0]["steps"][0]; stepNumber: number; isRight: boolean }) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        "lg:grid lg:grid-cols-2 lg:gap-8 items-center"
      )}
    >
      {isRight && <div className="hidden lg:block" />}
      <div className="group relative rounded-2xl border border-border glass-card p-6 hover-lift hover:border-primary/30">
        <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
          {stepNumber}
        </div>
        <div className="flex items-start gap-4 mt-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
            <step.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">{step.detail}</p>
          </div>
        </div>
      </div>
      {!isRight && <div className="hidden lg:block" />}
    </div>
  );
}

function PhaseSection({ phase, phaseIndex, globalStepOffset }: { phase: typeof PHASES[0]; phaseIndex: number; globalStepOffset: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div className="space-y-8">
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-4 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md">
          {phaseIndex + 1}
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{phase.title}</h3>
          <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="space-y-10">
        {phase.steps.map((step, i) => {
          const globalIndex = globalStepOffset + i;
          return <StepCard key={step.title} step={step} stepNumber={globalIndex + 1} isRight={globalIndex % 2 === 1} />;
        })}
      </div>
    </div>
  );
}

function CTASection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
      <div className="absolute inset-0 border border-primary/20 rounded-2xl" />
      <div className="relative space-y-6">
        <Sparkles className="w-8 h-8 text-primary mx-auto" />
        <h3 className="text-2xl font-bold text-foreground">Siap Memulai Project Anda?</h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Bergabung dengan 100+ bisnis yang telah mempercayakan website mereka kepada kami.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>100+ Project Selesai</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span>4.9/5 Rating</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/templates"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg colored-shadow-primary"
          >
            Browse Templates <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/custom"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
          >
            Custom Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  let stepCounter = 0;

  return (
    <section id="how-it-works" className="border-y border-border">
      <div className="space-y-16">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
          <div className="relative max-w-4xl mx-auto px-4 lg:px-8 py-16 text-center space-y-4">
            <Badge variant="secondary" className="mb-2 border border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" /> 10 Langkah Mudah
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Cara Kerja <span className="gradient-text">Kami</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Dari pemilihan template hingga launch & maintenance, berikut langkah-langkah lengkap untuk mendapatkan website impian Anda.
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-16">
          {PHASES.map((phase, phaseIdx) => {
            const offset = stepCounter;
            stepCounter += phase.steps.length;
            return <PhaseSection key={phase.title} phase={phase} phaseIndex={phaseIdx} globalStepOffset={offset} />;
          })}
        </div>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 pb-16">
          <CTASection />
        </div>
      </div>
    </section>
  );
}
