import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export interface CartItem {
  template_id: string;
  template_name: string;
  base_price: number;
  selected_features: Array<{ id: string; name: string; price: number }>;
  category: string | null;
  thumbnail_url: string | null;
  estimated_days: number | null;
}

const CART_STORAGE_KEY = "agencyos_cart";

function getLocalCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart
  const loadCart = useCallback(async () => {
    if (user) {
      setIsLoading(true);
      const { data } = await supabase
        .from("cart_items")
        .select("template_id, selected_features")
        .eq("user_id", user.id);

      if (data && data.length > 0) {
        // Fetch template details for cart items
        const templateIds = data.map((d) => d.template_id);
        const { data: templates } = await supabase
          .from("service_templates")
          .select("id, name, base_price, category, thumbnail_url, estimated_days")
          .in("id", templateIds);

        const cartItems: CartItem[] = data.map((d) => {
          const tmpl = templates?.find((t) => t.id === d.template_id);
          const features = (d.selected_features as any[]) ?? [];
          return {
            template_id: d.template_id,
            template_name: tmpl?.name ?? "Unknown",
            base_price: Number(tmpl?.base_price ?? 0),
            selected_features: features,
            category: tmpl?.category ?? null,
            thumbnail_url: tmpl?.thumbnail_url ?? null,
            estimated_days: tmpl?.estimated_days ?? null,
          };
        });
        setItems(cartItems);
      } else {
        // Sync localStorage cart to DB on first login
        const localItems = getLocalCart();
        if (localItems.length > 0) {
          for (const item of localItems) {
            await supabase.from("cart_items").upsert({
              user_id: user.id,
              template_id: item.template_id,
              selected_features: item.selected_features as any,
            }, { onConflict: "user_id,template_id" });
          }
          localStorage.removeItem(CART_STORAGE_KEY);
          setItems(localItems);
        } else {
          setItems([]);
        }
      }
      setIsLoading(false);
    } else {
      setItems(getLocalCart());
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(async (item: CartItem) => {
    if (user) {
      await supabase.from("cart_items").upsert({
        user_id: user.id,
        template_id: item.template_id,
        selected_features: item.selected_features as any,
      }, { onConflict: "user_id,template_id" });
    } else {
      const local = getLocalCart();
      const existing = local.findIndex((l) => l.template_id === item.template_id);
      if (existing >= 0) {
        local[existing] = item;
      } else {
        local.push(item);
      }
      setLocalCart(local);
    }
    await loadCart();
  }, [user, loadCart]);

  const removeItem = useCallback(async (templateId: string) => {
    if (user) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("template_id", templateId);
    } else {
      const local = getLocalCart().filter((l) => l.template_id !== templateId);
      setLocalCart(local);
    }
    await loadCart();
  }, [user, loadCart]);

  const clearCart = useCallback(async () => {
    if (user) {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
    }
    localStorage.removeItem(CART_STORAGE_KEY);
    setItems([]);
  }, [user]);

  const totalPrice = items.reduce((sum, item) => {
    const featuresCost = item.selected_features.reduce((s, f) => s + f.price, 0);
    return sum + item.base_price + featuresCost;
  }, 0);

  return { items, isLoading, addItem, removeItem, clearCart, totalPrice, itemCount: items.length };
}
