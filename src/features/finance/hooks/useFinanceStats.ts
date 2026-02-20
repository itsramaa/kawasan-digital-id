import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";

export function useFinanceStats() {
  const { data: invoices } = useQuery({
    queryKey: ["invoices-dashboard"],
    queryFn: async () => {
      const { data } = await supabase
        .from("invoices")
        .select("amount, status, due_date");
      return data ?? [];
    },
  });

  const outstanding = invoices
    ?.filter((i) => ["Sent", "Viewed", "Overdue"].includes(i.status))
    .reduce((sum, i) => sum + Number(i.amount), 0) ?? 0;

  const overdue = invoices?.filter((i) => i.status === "Overdue") ?? [];
  
  const collected = invoices
    ?.filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + Number(i.amount), 0) ?? 0;

  return { invoices, outstanding, overdue, collected };
}
