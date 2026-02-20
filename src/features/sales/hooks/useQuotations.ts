import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { Quotation } from "../types";

export const useQuotations = () => {
  return useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select("*, clients(name), inquiries(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Quotation[];
    },
  });
};
