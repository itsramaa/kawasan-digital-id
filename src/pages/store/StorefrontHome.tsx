import { Link } from "react-router-dom";
import {
  Search, ArrowRight, ShoppingBag, Building2, Layers, Briefcase, PenTool, Store,
  Sparkles, Zap, FileText, Gauge, Shield, FolderKanban, Star, ChevronRight,
  ClipboardList, CreditCard, Send, Rocket,
} from "lucide-react";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useFeaturedTemplates } from "@/features/storefront/hooks/useFeaturedTemplates";
import { useShowcaseProjects } from "@/features/storefront/hooks/useShowcaseProjects";
import { useTestimonials } from "@/features/storefront/hooks/useTestimonials";
import { useFAQs } from "@/features/storefront/hooks/useFAQs";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import type { ServiceTemplate, ShowcaseProject, Testimonial } from "@/features/storefront/types";

/* ─── Static Data ─── */

const CATEGORIES = [
  { label: "Ecommerce", icon: ShoppingBag, slug: "Ecommerce" },
  { label: "Company Profile", icon: Building2, slug: "Company Profile" },
  { label: "Landing Page", icon: Layers, slug: "Landing Page" },
  { label: "Portfolio", icon: Briefcase, slug: "Portfolio" },
  { label: "Blog", icon: PenTool, slug: "Blog" },
  { label: "UMKM", icon: Store, slug: "UMKM" },
];

const ADDONS = [
  { icon: Zap, name: "SEO Setup", desc: "Optimasi mesin pencari agar website mudah ditemukan" },
  { icon: FileText, name: "Extra Page", desc: "Tambahan halaman sesuai kebutuhan bisnis Anda" },
  { icon: Gauge, name: "Speed Optimization", desc: "Percepat loading website untuk pengalaman terbaik" },
  { icon: Shield, name: "Maintenance Plan", desc: "Perawatan rutin & update keamanan bulanan" },
];

const STEPS = [
  { icon: Layers, title: "Pilih Template / Custom", desc: "Temukan template yang sesuai atau request custom" },
  { icon: ClipboardList, title: "Sesuaikan Paket", desc: "Pilih fitur dan add-on yang Anda butuhkan" },
  { icon: CreditCard, title: "Checkout", desc: "Lakukan pembayaran dengan mudah dan aman" },
  { icon: Send, title: "Kirim Requirement", desc: "Kirimkan detail kebutuhan dan konten website" },
  { icon: Rocket, title: "Review & Launch", desc: "Review hasil, revisi, dan website siap live!" },
];

/* ─── Sub-components ─── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 lg:py-24 text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
          Order Website <span className="text-primary">Siap Pakai</span> atau Custom
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-base lg:text-lg">
          Dapatkan website profesional untuk bisnis Anda. Pilih dari template siap pakai atau buat dari nol sesuai kebutuhan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild size="lg">
            <Link to="/store/templates">
              <Search className="w-4 h-4" /> Browse Templates
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/store/custom">
              <Sparkles className="w-4 h-4" /> Custom Website
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CategorySection() {
  return (
    <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
      <h2 className="text-xl font-bold text-foreground mb-6">Cari Berdasarkan Kategori</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/store/templates?category=${encodeURIComponent(cat.slug)}`}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <cat.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TemplateCard({ template }: { template: ServiceTemplate }) {
  return (
    <Link
      to={`/store/templates/${template.id}`}
      className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
    >
      <div className="relative aspect-video bg-muted flex items-center justify-center">
        {template.thumbnail_url ? (
          <img src={template.thumbnail_url} alt={template.name} className="w-full h-full object-cover" />
        ) : (
          <Sparkles className="w-10 h-10 text-muted-foreground/40" />
        )}
        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px]">
          Best Seller
        </Badge>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {template.name}
        </h3>
        {template.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-primary">
            Rp {template.base_price.toLocaleString("id-ID")}
          </span>
          {template.estimated_days && (
            <span className="text-xs text-muted-foreground">{template.estimated_days} hari</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function FeaturedSection({ templates }: { templates: ServiceTemplate[] }) {
  if (templates.length === 0) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Template Terlaris</h2>
        <Link to="/store/templates" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
    </section>
  );
}

function CustomHighlight() {
  return (
    <section id="custom-section" className="bg-muted/50 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <Badge variant="secondary">Custom Project</Badge>
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
            Butuh Website yang Unik?
          </h2>
          <p className="text-muted-foreground max-w-lg">
            Tim kami siap membangun website custom sesuai kebutuhan spesifik bisnis Anda — dari desain hingga deployment.
          </p>
          <Button asChild size="lg">
            <Link to="/store/custom">
              Mulai Project Custom <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div className="w-full lg:w-80 h-48 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border">
          <Sparkles className="w-16 h-16 text-primary/40" />
        </div>
      </div>
    </section>
  );
}

function AddOnSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
      <h2 className="text-xl font-bold text-foreground mb-6">Tingkatkan Website Anda</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ADDONS.map((addon) => (
          <div key={addon.name} className="p-5 rounded-xl border border-border bg-card space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <addon.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">{addon.name}</h3>
            <p className="text-xs text-muted-foreground">{addon.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16">
        <h2 className="text-xl font-bold text-foreground text-center mb-10">Cara Kerja</h2>
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection({ projects }: { projects: ShowcaseProject[] }) {
  if (projects.length === 0) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Hasil Kerja Kami</h2>
        <Link to="/store/showcase" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <div key={p.id} className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {p.thumbnail_url ? (
                <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <FolderKanban className="w-8 h-8 text-muted-foreground/40" />
              )}
            </div>
            <div className="p-3 space-y-1">
              <h4 className="text-sm font-semibold text-foreground line-clamp-1">{p.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="p-5 rounded-xl border border-border bg-card space-y-3">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < t.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
        ))}
      </div>
      <p className="text-sm text-foreground line-clamp-4">"{t.content}"</p>
      <div className="flex items-center gap-3 pt-1">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
          {t.client_name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{t.client_name}</p>
          {t.client_company && <p className="text-xs text-muted-foreground">{t.client_company}</p>}
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
      <h2 className="text-xl font-bold text-foreground text-center mb-8">Apa Kata Klien Kami</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.slice(0, 3).map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </div>
    </section>
  );
}

function FAQSection({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  if (faqs.length === 0) return null;
  return (
    <section id="faq-section" className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
      <h2 className="text-xl font-bold text-foreground text-center mb-8">Pertanyaan Umum</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-primary">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 text-center space-y-5">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground">
          Start Your Website Today
        </h2>
        <p className="text-primary-foreground/80 max-w-lg mx-auto">
          Mulai perjalanan digital bisnis Anda bersama Kawasan Digital.
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link to="/store/templates">Browse Templates</Link>
        </Button>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */

export default function StorefrontHome() {
  const { data: featured } = useFeaturedTemplates();
  const { data: projects } = useShowcaseProjects();
  const { data: testimonials } = useTestimonials();
  const { data: faqs } = useFAQs(5);

  return (
    <StorefrontLayout>
      <HeroSection />
      <CategorySection />
      <FeaturedSection templates={featured ?? []} />
      <CustomHighlight />
      <AddOnSection />
      <HowItWorks />
      <ShowcaseSection projects={projects?.slice(0, 6) ?? []} />
      <TestimonialsSection testimonials={testimonials ?? []} />
      <FAQSection faqs={faqs ?? []} />
      <FinalCTA />
    </StorefrontLayout>
  );
}
