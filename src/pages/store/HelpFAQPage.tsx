import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useFAQs } from "@/features/storefront/hooks/useFAQs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import {
  HelpCircle, MessageCircle, Search, ShoppingCart, CreditCard,
  RefreshCw, Shield, Wrench, LayoutGrid, Sparkles, ArrowRight,
  Clock, Mail, BookOpen, Palette, Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { useState, useMemo } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";

const FAQ_CATEGORIES = [
  { value: "all", label: "Semua", icon: LayoutGrid },
  { value: "order", label: "Order Process", icon: ShoppingCart },
  { value: "payment", label: "Payment", icon: CreditCard },
  { value: "revision", label: "Revision", icon: RefreshCw },
  { value: "refund", label: "Refund", icon: Shield },
  { value: "maintenance", label: "Maintenance", icon: Wrench },
  { value: "general", label: "General", icon: HelpCircle },
];

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function CategoryFilter({
  categories,
  active,
  onSelect,
  faqCounts,
}: {
  categories: typeof FAQ_CATEGORIES;
  active: string;
  onSelect: (v: string) => void;
  faqCounts: Record<string, number>;
}) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap gap-2 justify-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      {categories.map((cat) => {
        const count = cat.value === "all" ? faqCounts.total : (faqCounts[cat.value] || 0);
        return (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              active === cat.value
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-card border border-border text-muted-foreground hover:bg-muted hover:border-primary/30 hover:text-foreground"
            )}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.label}
            <span className={cn(
              "text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center",
              active === cat.value ? "bg-primary-foreground/20" : "bg-muted"
            )}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FAQList({ faqs, searchQuery }: { faqs: any[]; searchQuery: string }) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <Accordion type="single" collapsible className="w-full space-y-2">
        {faqs.map((faq: any, i: number) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="rounded-xl border border-border bg-card px-5 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
              <HighlightText text={faq.question} query={searchQuery} />
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground whitespace-pre-line pb-4">
              <HighlightText text={faq.answer} query={searchQuery} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function EmptyState({ searchQuery, onClear }: { searchQuery: string; onClear: () => void }) {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
        <HelpCircle className="w-8 h-8 text-muted-foreground/40" />
      </div>
      <div className="space-y-2">
        <p className="font-medium text-foreground">Tidak ada FAQ ditemukan</p>
        <p className="text-sm text-muted-foreground">
          {searchQuery
            ? `Tidak ada hasil untuk "${searchQuery}". Coba kata kunci lain.`
            : "Belum ada FAQ untuk kategori ini."}
        </p>
      </div>
      {searchQuery && (
        <button
          onClick={onClear}
          className="text-sm text-primary hover:underline"
        >
          Hapus pencarian
        </button>
      )}
    </div>
  );
}

function ContactCTA() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl overflow-hidden p-8 text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
      <div className="absolute inset-0 border border-primary/20 rounded-2xl" />

      <div className="relative space-y-5">
        <MessageCircle className="w-8 h-8 text-primary mx-auto" />
        <h3 className="text-xl font-bold text-foreground">Masih Punya Pertanyaan?</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Tim kami siap membantu Anda. Respon rata-rata dalam 2 jam pada hari kerja.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span>Respon &lt; 2 Jam</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-primary" />
            <span>Email & Chat</span>
          </div>
        </div>

        <Link
          to="/store/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm"
        >
          Hubungi Kami <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function QuickLinks() {
  const { ref, isVisible } = useScrollReveal(0.1);
  const links = [
    { icon: BookOpen, title: "Cara Kerja", desc: "Pelajari proses dari awal hingga launch", to: "/store/how-it-works" },
    { icon: Palette, title: "Templates", desc: "Jelajahi koleksi template siap pakai", to: "/store/templates" },
    { icon: Star, title: "Custom Website", desc: "Buat website sesuai kebutuhan unik Anda", to: "/store/custom" },
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "space-y-6 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <h3 className="text-lg font-bold text-foreground text-center">Quick Links</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {links.map((link) => (
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

export default function HelpFAQPage() {
  const { data: faqs, isLoading } = useFAQs(100);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const faqCounts = useMemo(() => {
    if (!faqs) return { total: 0 };
    const counts: Record<string, number> = { total: faqs.length };
    faqs.forEach((f: any) => {
      if (f.category) counts[f.category] = (counts[f.category] || 0) + 1;
    });
    return counts;
  }, [faqs]);

  const filtered = useMemo(() => {
    let result = faqs || [];
    if (activeCategory !== "all") {
      result = result.filter((f: any) => f.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f: any) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      );
    }
    return result;
  }, [faqs, activeCategory, searchQuery]);

  return (
    <StorefrontLayout>
      <div className="space-y-12">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
          <div className="relative max-w-3xl mx-auto px-4 lg:px-8 py-16 text-center space-y-6">
            <Badge variant="secondary">
              <HelpCircle className="w-3 h-3 mr-1" /> Help Center
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Help & FAQ
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Temukan jawaban untuk pertanyaan yang sering diajukan seputar layanan kami.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>

            {!isLoading && faqs && (
              <p className="text-sm text-muted-foreground">
                <Sparkles className="w-3 h-3 inline mr-1" />
                {faqs.length} FAQ tersedia
              </p>
            )}
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 lg:px-8 space-y-8">
          {/* Category Filter */}
          <CategoryFilter
            categories={FAQ_CATEGORIES}
            active={activeCategory}
            onSelect={setActiveCategory}
            faqCounts={faqCounts}
          />

          {/* FAQ List */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse">
                  <div className="h-5 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <FAQList faqs={filtered} searchQuery={searchQuery} />
          ) : (
            <EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery("")} />
          )}

          {/* Contact CTA */}
          <ContactCTA />

          {/* Quick Links */}
          <QuickLinks />
        </div>
      </div>
    </StorefrontLayout>
  );
}
