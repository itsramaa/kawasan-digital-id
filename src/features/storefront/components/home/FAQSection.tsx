import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";

export function FAQSection({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  const { ref, isVisible } = useScrollReveal();

  if (faqs.length === 0) return null;
  return (
    <section
      ref={ref}
      id="faq-section"
      className={`max-w-3xl mx-auto px-4 lg:px-8 py-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <h2 className="text-xl font-bold text-foreground text-center mb-8">Pertanyaan Umum</h2>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-left text-sm hover:no-underline">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="text-center mt-6">
        <Link to="/help" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
          Lihat Semua FAQ <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
