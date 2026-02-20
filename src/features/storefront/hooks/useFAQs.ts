import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StoreFAQ } from "../types";

export function useFAQs(limit?: number) {
  return useQuery({
    queryKey: ["store-faqs", limit],
    queryFn: async (): Promise<StoreFAQ[]> => {
      let query = supabase
        .from("store_faqs")
        .select("*")
        .order("display_order", { ascending: true });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data as StoreFAQ[];
    },
  });
}
