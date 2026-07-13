'use client'

import { Star, Quote } from "lucide-react";
import { useScrollReveal } from "@/src/features/storefront/hooks/useScrollReveal";
import type { Testimonial } from "@/src/features/storefront/types";

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="p-5 rounded-xl border border-border glass-card space-y-3 relative hover-lift group">
      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/15 group-hover:text-primary/30 transition-colors" />
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < t.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
        ))}
      </div>
      <p className="text-sm text-foreground line-clamp-4">"{t.content}"</p>
      <div className="flex items-center gap-3 pt-1">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-sm font-bold text-primary-foreground">
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

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { ref, isVisible } = useScrollReveal();

  if (testimonials.length === 0) return null;
  return (
    <section
      ref={ref}
      className={`max-w-7xl mx-auto px-4 lg:px-8 py-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <h2 className="text-xl font-bold text-foreground text-center mb-8">Apa Kata <span className="gradient-text">Klien Kami</span></h2>
      <div className="flex gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
        {testimonials.slice(0, 3).map((t) => (
          <div key={t.id} className="min-w-[280px] sm:min-w-0">
            <TestimonialCard t={t} />
          </div>
        ))}
      </div>
    </section>
  );
}
