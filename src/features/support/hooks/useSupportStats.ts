import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";

export function useSupportStats() {
  const { data: openTickets } = useQuery({
    queryKey: ["tickets-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("support_tickets")
        .select("*", { count: "exact", head: true })
        .in("status", ["Open", "In Progress", "Escalated"]);
      return count ?? 0;
    },
  });

  const { data: recentTickets } = useQuery({
    queryKey: ["recent-tickets-dashboard"],
    queryFn: async () => {
      const { data } = await supabase
        .from("support_tickets")
        .select("id, ticket_number, subject, status, priority, sla_deadline, clients(name)")
        .in("status", ["Open", "In Progress", "Escalated"])
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  return { openTickets, recentTickets };
}
