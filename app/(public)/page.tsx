// Server Component — data fetched via Prisma Server Actions
import { getFeaturedTemplates, getTestimonials, getFAQs } from '@/app/actions/storefront';
import { HeroSection } from '@/src/features/storefront/components/home/HeroSection';
import { FeaturedSection } from '@/src/features/storefront/components/home/FeaturedSection';
import { CategorySection } from '@/src/features/storefront/components/home/CategorySection';
import { HowItWorks } from '@/src/features/storefront/components/home/HowItWorks';
import { AddOnSection } from '@/src/features/storefront/components/home/AddOnSection';
import { CustomHighlight } from '@/src/features/storefront/components/home/CustomHighlight';
import { TestimonialsSection } from '@/src/features/storefront/components/home/TestimonialsSection';
import { FAQSection } from '@/src/features/storefront/components/home/FAQSection';
import { FinalCTA } from '@/src/features/storefront/components/home/FinalCTA';

export const dynamic = 'force-dynamic';

export default async function StorefrontHomePage() {
  const [templates, testimonials, faqs] = await Promise.all([
    getFeaturedTemplates(),
    getTestimonials(),
    getFAQs(),
  ]);

  return (
    <div>
      <HeroSection />
      {/* TODO: FeaturedSection prop type may not match Prisma-mapped ServiceTemplate — cast as any */}
      <FeaturedSection templates={templates as any} />
      <CategorySection />
      <HowItWorks />
      <AddOnSection />
      <CustomHighlight />
      {/* TODO: TestimonialsSection prop type may not match Prisma-mapped Testimonial — cast as any */}
      <TestimonialsSection testimonials={testimonials as any} />
      {/* TODO: FAQSection prop type may not match Prisma-mapped StoreFAQ — cast as any */}
      <FAQSection faqs={faqs as any} />
      <FinalCTA />
    </div>
  );
}
