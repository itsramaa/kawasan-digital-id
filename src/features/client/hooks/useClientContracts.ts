import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { ClientContract } from "../types";

export const useClientContracts = () => {
  return useQuery({
    queryKey: ["client-contracts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("id, title, status, start_date, end_date, total_value, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ClientContract[];
    },
  });
};
