// TODO: Replace with real data fetching via Prisma/Server Actions
import type { ServiceTemplate, Testimonial, StoreFAQ } from '@/src/features/storefront/types';
import { HeroSection } from '@/src/features/storefront/components/home/HeroSection';
import { FeaturedSection } from '@/src/features/storefront/components/home/FeaturedSection';
import { CategorySection } from '@/src/features/storefront/components/home/CategorySection';
import { HowItWorks } from '@/src/features/storefront/components/home/HowItWorks';
import { AddOnSection } from '@/src/features/storefront/components/home/AddOnSection';
import { CustomHighlight } from '@/src/features/storefront/components/home/CustomHighlight';
import { TestimonialsSection } from '@/src/features/storefront/components/home/TestimonialsSection';
import { FAQSection } from '@/src/features/storefront/components/home/FAQSection';
import { FinalCTA } from '@/src/features/storefront/components/home/FinalCTA';

export const dynamic = 'force-dynamic'

export default function StorefrontHomePage() {
  // TODO: fetch from Prisma server actions
  const templates: ServiceTemplate[] = [];
  const testimonials: Testimonial[] = [];
  const faqs: { id: string; question: string; answer: string }[] = [];

  return (
    <div>
      <HeroSection />
      <FeaturedSection templates={templates} />
      <CategorySection />
      <HowItWorks />
      <AddOnSection />
      <CustomHighlight />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <FinalCTA />
    </div>
  );
}
