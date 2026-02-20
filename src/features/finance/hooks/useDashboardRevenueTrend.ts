import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";

interface MonthlyRevenue {
  month: string;
  billed: number;
  collected: number;
}

export function useDashboardRevenueTrend() {
  return useQuery({
    queryKey: ["dashboard-revenue-trend"],
    queryFn: async () => {
      const { data } = await supabase
        .from("invoices")
        .select("amount, status, created_at, paid_at");

      if (!data) return [];

      // Group by month
      const monthMap: Record<string, { billed: number; collected: number }> = {};

      data.forEach((inv) => {
        const date = new Date(inv.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!monthMap[key]) monthMap[key] = { billed: 0, collected: 0 };
        monthMap[key].billed += Number(inv.amount) / 1e6;

        if (inv.status === "Paid" && inv.paid_at) {
          const paidDate = new Date(inv.paid_at);
          const paidKey = `${paidDate.getFullYear()}-${String(paidDate.getMonth() + 1).padStart(2, "0")}`;
          if (!monthMap[paidKey]) monthMap[paidKey] = { billed: 0, collected: 0 };
          monthMap[paidKey].collected += Number(inv.amount) / 1e6;
        }
      });

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      return Object.entries(monthMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([key, val]) => ({
          month: months[parseInt(key.split("-")[1]) - 1],
          billed: Math.round(val.billed * 10) / 10,
          collected: Math.round(val.collected * 10) / 10,
        })) as MonthlyRevenue[];
    },
  });
}
