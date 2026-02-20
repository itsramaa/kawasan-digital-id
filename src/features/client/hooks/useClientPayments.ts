import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { ClientPayment } from "../types";

export const useClientPayments = () => {
  return useQuery({
    queryKey: ["client-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("id, amount, payment_date, payment_method, reference_number, invoices(invoice_number, amount, projects(name))")
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data as ClientPayment[];
    },
  });
};
