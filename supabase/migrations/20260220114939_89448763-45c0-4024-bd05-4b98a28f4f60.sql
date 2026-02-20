
-- =============================================
-- 1. showcase_projects
-- =============================================
CREATE TABLE public.showcase_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  category text,
  tech_stack text[] DEFAULT '{}',
  demo_url text,
  is_published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.showcase_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published showcase projects"
  ON public.showcase_projects FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Internal users can manage showcase projects"
  ON public.showcase_projects FOR ALL
  TO authenticated
  USING (is_internal_user(auth.uid()));

-- =============================================
-- 2. service_templates
-- =============================================
CREATE TABLE public.service_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  thumbnail_url text,
  category text,
  base_price numeric NOT NULL DEFAULT 0,
  estimated_days integer,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active service templates"
  ON public.service_templates FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Internal users can manage service templates"
  ON public.service_templates FOR ALL
  TO authenticated
  USING (is_internal_user(auth.uid()));

-- =============================================
-- 3. template_features
-- =============================================
CREATE TABLE public.template_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.service_templates(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  is_included boolean DEFAULT false,
  display_order integer DEFAULT 0
);

ALTER TABLE public.template_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view template features"
  ON public.template_features FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Internal users can manage template features"
  ON public.template_features FOR ALL
  TO authenticated
  USING (is_internal_user(auth.uid()));

-- =============================================
-- 4. orders
-- =============================================
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  customer_company text,
  template_id uuid REFERENCES public.service_templates(id),
  selected_features jsonb DEFAULT '[]',
  notes text,
  subtotal numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending',
  payment_method text,
  payment_status text NOT NULL DEFAULT 'Unpaid',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Internal users can manage orders"
  ON public.orders FOR ALL
  TO authenticated
  USING (is_internal_user(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 5. Order number generator
-- =============================================
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  next_num integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS integer)), 0) + 1
  INTO next_num
  FROM public.orders;
  
  NEW.order_number := 'ORD-' || LPAD(next_num::text, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION public.generate_order_number();
