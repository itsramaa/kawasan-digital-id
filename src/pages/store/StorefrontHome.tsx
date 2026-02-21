import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useFeaturedTemplates } from "@/features/storefront/hooks/useFeaturedTemplates";
import { useShowcaseProjects } from "@/features/storefront/hooks/useShowcaseProjects";
import { useTestimonials } from "@/features/storefront/hooks/useTestimonials";
import { useFAQs } from "@/features/storefront/hooks/useFAQs";

import { HeroSection } from "@/features/storefront/components/home/HeroSection";
import { CategorySection } from "@/features/storefront/components/home/CategorySection";
import { FeaturedSection } from "@/features/storefront/components/home/FeaturedSection";
import { CustomHighlight } from "@/features/storefront/components/home/CustomHighlight";
import { AddOnSection } from "@/features/storefront/components/home/AddOnSection";
import { HowItWorks } from "@/features/storefront/components/home/HowItWorks";
import { ShowcaseSection } from "@/features/storefront/components/home/ShowcaseSection";
import { TestimonialsSection } from "@/features/storefront/components/home/TestimonialsSection";
import { FAQSection } from "@/features/storefront/components/home/FAQSection";
import { FinalCTA } from "@/features/storefront/components/home/FinalCTA";

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
