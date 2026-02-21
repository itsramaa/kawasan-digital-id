
CREATE TABLE public.custom_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  industry text NOT NULL,
  website_type text NOT NULL,
  estimated_pages integer NOT NULL DEFAULT 1,
  selected_features jsonb NOT NULL DEFAULT '[]'::jsonb,
  deadline text,
  budget_range text,
  estimated_price_min numeric NOT NULL DEFAULT 0,
  estimated_price_max numeric NOT NULL DEFAULT 0,
  estimated_days_min integer NOT NULL DEFAULT 0,
  estimated_days_max integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inquiries"
ON public.custom_inquiries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own inquiries"
ON public.custom_inquiries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Internal users can manage all inquiries"
ON public.custom_inquiries FOR ALL
USING (is_internal_user(auth.uid()));
