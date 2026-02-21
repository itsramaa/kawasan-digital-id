import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useFAQs } from "@/features/storefront/hooks/useFAQs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { useState } from "react";

const FAQ_CATEGORIES = [
  { value: "all", label: "Semua" },
  { value: "order", label: "Order Process" },
  { value: "payment", label: "Payment" },
  { value: "revision", label: "Revision" },
  { value: "refund", label: "Refund" },
  { value: "maintenance", label: "Maintenance" },
  { value: "general", label: "General" },
];

export default function HelpFAQPage() {
  const { data: faqs, isLoading } = useFAQs(100);
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? faqs
    : faqs?.filter((f: any) => f.category === activeCategory);

  return (
    <StorefrontLayout>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Help & FAQ</h1>
          <p className="text-muted-foreground">
            Temukan jawaban untuk pertanyaan yang sering diajukan.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-4 animate-pulse">
                <div className="h-5 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {filtered.map((faq: any) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-xl border border-border bg-card px-4"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground whitespace-pre-line">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No FAQs available for this category.</p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
          <MessageCircle className="w-8 h-8 text-primary mx-auto" />
          <h3 className="font-semibold text-foreground">Masih Punya Pertanyaan?</h3>
          <p className="text-sm text-muted-foreground">
            Hubungi tim kami untuk bantuan lebih lanjut.
          </p>
          <Link
            to="/store#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </StorefrontLayout>
  );
}
