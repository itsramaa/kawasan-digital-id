
-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_company TEXT,
  avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published testimonials"
  ON public.testimonials FOR SELECT
  USING (is_published = true);

CREATE POLICY "Internal users can manage testimonials"
  ON public.testimonials FOR ALL
  USING (is_internal_user(auth.uid()));

-- Create store_faqs table
CREATE TABLE public.store_faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.store_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published FAQs"
  ON public.store_faqs FOR SELECT
  USING (is_published = true);

CREATE POLICY "Internal users can manage FAQs"
  ON public.store_faqs FOR ALL
  USING (is_internal_user(auth.uid()));

-- Add is_featured column to service_templates
ALTER TABLE public.service_templates
  ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
