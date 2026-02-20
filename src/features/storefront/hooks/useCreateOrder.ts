import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  template_id: string;
  selected_features: Array<{ id: string; name: string; price: number }>;
  notes?: string;
  subtotal: number;
  total: number;
  payment_method: string;
  user_id?: string;
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          order_number: "", // trigger will generate
          customer_name: payload.customer_name,
          customer_email: payload.customer_email,
          customer_phone: payload.customer_phone || null,
          customer_company: payload.customer_company || null,
          template_id: payload.template_id,
          selected_features: payload.selected_features as any,
          notes: payload.notes || null,
          subtotal: payload.subtotal,
          total: payload.total,
          payment_method: payload.payment_method,
          user_id: payload.user_id || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
}
