
-- Add detail fields to showcase_projects for case study pages
ALTER TABLE public.showcase_projects
  ADD COLUMN client_background text,
  ADD COLUMN challenge text,
  ADD COLUMN solution text,
  ADD COLUMN result text;

-- Add category column to store_faqs for grouped FAQ page
ALTER TABLE public.store_faqs
  ADD COLUMN category text DEFAULT 'general';
