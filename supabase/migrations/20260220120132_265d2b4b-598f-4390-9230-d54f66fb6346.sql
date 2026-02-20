
-- Cart items table for logged-in users
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  template_id uuid NOT NULL REFERENCES public.service_templates(id) ON DELETE CASCADE,
  selected_features jsonb DEFAULT '[]',
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, template_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON public.cart_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Also update orders table to link to user_id for logged-in orders
ALTER TABLE public.orders ADD COLUMN user_id uuid;

-- Policy: authenticated users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
