import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { Payment } from "../types";

export const usePayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*, invoices(invoice_number, clients(name))")
        .order("payment_date", { ascending: false });
      if (error) throw error;
      return data as Payment[];
    },
  });
};
