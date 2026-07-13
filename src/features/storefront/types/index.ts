export interface ServiceTemplate {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string | null;
  base_price: number;
  estimated_days: number | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  demo_url: string | null;
  revision_limit: number | null;
  gallery_images: string[];
}

export interface TemplateFeature {
  id: string;
  template_id: string;
  name: string;
  description: string | null;
  price: number;
  is_included: boolean;
  display_order: number;
  category: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_company: string | null;
  template_id: string | null;
  selected_features: Array<{ id: string; name: string; price: number }>;
  notes: string | null;
  subtotal: number;
  total: number;
  status: string;
  payment_method: string | null;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_company: string | null;
  avatar_url: string | null;
  content: string;
  rating: number;
  is_published: boolean;
  display_order: number;
  created_at: string;
}

export interface StoreFAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  category: string | null;
}

export interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  notes?: string;
  payment_method: 'manual' | 'online';
}
