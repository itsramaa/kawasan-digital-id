
-- Add new columns to service_templates
ALTER TABLE public.service_templates
  ADD COLUMN IF NOT EXISTS demo_url text,
  ADD COLUMN IF NOT EXISTS revision_limit integer,
  ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;

-- Add category column to template_features
ALTER TABLE public.template_features
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'scope';
