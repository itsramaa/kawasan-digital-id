'use client'

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, ArrowRight } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { cn } from "@/src/lib/utils";
import type { StoreFAQ } from "../../types";

interface DetailFAQProps {
  faqs: StoreFAQ[];
}

export function DetailFAQ({ faqs }: DetailFAQProps) {
  const { ref, isVisible } = useScrollReveal();

  if (faqs.length === 0) return null;

  return (
    <section
      ref={ref}
      className={cn(
        "space-y-4 p-6 rounded-xl bg-gradient-to-br from-muted/60 to-muted/30 border border-border transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <HelpCircle className="w-5 h-5 text-primary" /> Frequently Asked Questions
        </h2>
        <Link
          href="/help"
          className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Lihat Semua FAQ <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Link
        href="/help"
        className="flex sm:hidden items-center gap-1 text-sm text-primary hover:underline justify-center pt-2"
      >
        Lihat Semua FAQ <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}
