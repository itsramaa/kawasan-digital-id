import { useState } from "react";
import { Link } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { cn } from "@/shared/utils/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { contactSchema, type ContactFormValues } from "@/shared/lib/validations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Mail, MessageCircle, Clock, MapPin, Phone, ArrowRight,
  Shield, Award, Users, Zap, BookOpen, Palette, Star,
  CheckCircle2, Send, Headphones,
} from "lucide-react";

const TRUST_INDICATORS = [
  { icon: Clock, label: "Respon < 2 Jam" },
  { icon: Headphones, label: "Konsultasi Gratis" },
  { icon: Users, label: "Tim Profesional" },
];

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@kawasandigital.com",
    href: "mailto:hello@kawasandigital.com",
    desc: "Kirim pertanyaan kapan saja",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+62 812-3456-7890",
    href: "https://wa.me/6281234567890",
    desc: "Chat langsung dengan tim kami",
  },
  {
    icon: Clock,
    title: "Jam Operasional",
    value: "Senin - Jumat",
    desc: "09:00 - 18:00 WIB",
  },
];

const SUBJECTS = [
  { value: "general", label: "General Inquiry" },
  { value: "technical", label: "Technical Support" },
  { value: "custom_project", label: "Custom Project" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

const VALUE_PROPS = [
  { icon: Zap, title: "Respon Cepat", desc: "Rata-rata respon dalam 2 jam pada hari kerja" },
  { icon: Shield, title: "Konsultasi Gratis", desc: "Diskusi kebutuhan Anda tanpa biaya apapun" },
  { icon: Award, title: "Tim Berpengalaman", desc: "100+ proyek berhasil diselesaikan" },
  { icon: Users, title: "Dedicated Support", desc: "Tim support yang siap membantu Anda" },
];

const MINI_FAQS = [
  { q: "Berapa lama proses pembuatan website?", a: "Rata-rata 7-21 hari kerja tergantung kompleksitas." },
  { q: "Apakah ada garansi?", a: "Ya, kami memberikan garansi uang kembali dan revisi gratis." },
  { q: "Bisa konsultasi dulu sebelum order?", a: "Tentu! Konsultasi gratis tanpa komitmen." },
];

const QUICK_LINKS = [
  { icon: Palette, title: "Templates", desc: "Jelajahi koleksi template siap pakai", to: "/templates" },
  { icon: Star, title: "Custom Website", desc: "Buat website sesuai kebutuhan unik Anda", to: "/custom" },
  { icon: BookOpen, title: "How It Works", desc: "Pelajari proses dari awal hingga launch", to: "/how-it-works" },
];

function HeroSection() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
      <div
        ref={ref}
        className={cn(
          "relative max-w-3xl mx-auto px-4 lg:px-8 py-16 text-center space-y-6 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        <Badge variant="secondary">
          <Phone className="w-3 h-3 mr-1" /> Contact Us
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Hubungi Kami
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Punya pertanyaan atau ingin mendiskusikan proyek? Tim kami siap membantu Anda
          mewujudkan website impian bisnis Anda.
        </p>
        <div className="flex flex-wrap justify-center gap-6 pt-2">
          {TRUST_INDICATORS.map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <t.icon className="w-4 h-4 text-primary" />
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactInfoCards() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(
        "grid sm:grid-cols-3 gap-4 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      {CONTACT_CARDS.map((card, i) => {
        const inner = (
          <div
            className="group rounded-xl border border-border bg-card p-6 text-center space-y-3 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-1"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
              <card.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{card.title}</h3>
            <p className="text-sm font-medium text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.desc}</p>
          </div>
        );
        return card.href ? (
          <a key={card.title} href={card.href} target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        ) : (
          <div key={card.title}>{inner}</div>
        );
      })}
    </div>
  );
}

function ContactForm() {
  const { ref, isVisible } = useScrollReveal();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
    });

    setSending(false);
    if (error) {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
      return;
    }
    setSent(true);
    toast.success("Pesan berhasil dikirim!");
  };

  if (sent) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-border bg-card p-10 text-center space-y-5 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Pesan Terkirim!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Terima kasih telah menghubungi kami. Tim kami akan merespon dalam waktu kurang dari 2 jam pada hari kerja.
        </p>
        <Button onClick={() => { setSent(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}>
          Kirim Pesan Lain
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={ref as unknown as React.Ref<HTMLFormElement>}
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border border-border bg-card p-6 lg:p-8 space-y-5 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-foreground">Kirim Pesan</h3>
        <p className="text-sm text-muted-foreground">Isi form di bawah dan kami akan segera menghubungi Anda.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama <span className="text-destructive">*</span></Label>
          <Input id="name" placeholder="Nama lengkap" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
          <Input id="email" type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subjek <span className="text-destructive">*</span></Label>
        <Select value={formData.subject} onValueChange={(v) => handleChange("subject", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih subjek" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Pesan <span className="text-destructive">*</span></Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Ceritakan kebutuhan atau pertanyaan Anda..."
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
        />
        <div className="flex justify-between">
          {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
          <p className="text-xs text-muted-foreground ml-auto">{formData.message.length}/1000</p>
        </div>
      </div>

      <Button type="submit" disabled={sending} className="w-full sm:w-auto">
        {sending ? "Mengirim..." : <><Send className="w-4 h-4 mr-2" /> Kirim Pesan</>}
      </Button>
    </form>
  );
}

function InfoSidebar() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(
        "space-y-6 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      {/* Value Props */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <h4 className="font-semibold text-foreground">Mengapa Memilih Kami?</h4>
        <div className="space-y-4">
          {VALUE_PROPS.map((vp) => (
            <div key={vp.title} className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <vp.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{vp.title}</p>
                <p className="text-xs text-muted-foreground">{vp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini FAQ */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h4 className="font-semibold text-foreground">FAQ Populer</h4>
        <div className="space-y-3">
          {MINI_FAQS.map((faq) => (
            <div key={faq.q} className="space-y-1">
              <p className="text-sm font-medium text-foreground">{faq.q}</p>
              <p className="text-xs text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
        <Link to="/help" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          Lihat semua FAQ <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Social Proof */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 text-center space-y-2">
        <p className="text-3xl font-bold text-primary">100+</p>
        <p className="text-sm font-medium text-foreground">Proyek Berhasil</p>
        <p className="text-xs text-muted-foreground">Dipercaya bisnis dari berbagai industri</p>
      </div>
    </div>
  );
}

function LocationSection() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border bg-card p-6 lg:p-8 flex flex-col sm:flex-row gap-6 items-start transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <MapPin className="w-6 h-6 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground text-lg">Lokasi Kami</h3>
        <p className="text-sm text-muted-foreground">
          Kawasan Digital beroperasi secara remote-first dengan tim yang tersebar di seluruh Indonesia.
        </p>
        <p className="text-sm text-muted-foreground">
          Jakarta, Indonesia
        </p>
      </div>
    </div>
  );
}

function QuickLinksSection() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(
        "space-y-6 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <h3 className="text-lg font-bold text-foreground text-center">Jelajahi Layanan Kami</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group rounded-xl border border-border bg-card p-5 text-center space-y-3 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
              <link.icon className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground text-sm">{link.title}</h4>
            <p className="text-xs text-muted-foreground">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <StorefrontLayout>
      <div className="space-y-12">
        <HeroSection />

        <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-12">
          <ContactInfoCards />

          {/* Form + Sidebar */}
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <div className="lg:col-span-2">
              <InfoSidebar />
            </div>
          </div>

          <LocationSection />
          <QuickLinksSection />
        </div>
      </div>
    </StorefrontLayout>
  );
}
