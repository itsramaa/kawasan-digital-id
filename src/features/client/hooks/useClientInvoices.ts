import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { ClientInvoice } from "../types";

export const useClientInvoices = () => {
  return useQuery({
    queryKey: ["client-invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*, projects(name)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ClientInvoice[];
    },
  });
};
