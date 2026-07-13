'use client';

import { useState, useEffect } from 'react';

export interface CartItem {
  template_id: string;
  template_name: string;
  base_price: number;
  selected_features: Array<{ id: string; name: string; price: number }>;
  category: string | null;
  thumbnail_url: string | null;
  estimated_days: number | null;
}

const CART_KEY = 'kd_cart';

function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // storage quota exceeded or private browsing — fail silently
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage());

  // Keep localStorage in sync whenever items change
  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  function addItem(item: CartItem): void {
    setItems((prev) => {
      // Replace if same template already in cart, otherwise append
      const exists = prev.some((i) => i.template_id === item.template_id);
      return exists
        ? prev.map((i) => (i.template_id === item.template_id ? item : i))
        : [...prev, item];
    });
  }

  function removeItem(templateId: string): void {
    setItems((prev) => prev.filter((i) => i.template_id !== templateId));
  }

  function clearCart(): void {
    setItems([]);
  }

  const totalPrice = items.reduce((sum, item) => {
    const featuresTotal = item.selected_features.reduce(
      (fSum, f) => fSum + f.price,
      0
    );
    return sum + item.base_price + featuresTotal;
  }, 0);

  const itemCount = items.length;

  return {
    items,
    isLoading: false,
    addItem,
    removeItem,
    clearCart,
    totalPrice,
    itemCount,
  };
}
