export interface CartItem {
  template_id: string;
  template_name: string;
  base_price: number;
  selected_features: Array<{ id: string; name: string; price: number }>;
  category: string | null;
  thumbnail_url: string | null;
  estimated_days: number | null;
}

export function useCart() {
  return {
    items: [] as CartItem[],
    isLoading: false,
    addItem: async (_item: CartItem) => {},
    removeItem: async (_templateId: string) => {},
    clearCart: async () => {},
    totalPrice: 0,
    itemCount: 0,
  };
}
