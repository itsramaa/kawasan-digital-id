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
  return {
    mutate: (_payload: CreateOrderPayload, _opts?: any) => {},
    mutateAsync: async (_payload: CreateOrderPayload) => null,
    isPending: false,
    error: null,
  };
}
