import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";

export interface ActivityItem {
  id: string;
  type: "project" | "invoice" | "ticket";
  title: string;
  status: string;
  created_at: string;
}

export const useClientActivity = () => {
  return useQuery({
    queryKey: ["client-activity"],
    queryFn: async () => {
      const [projects, invoices, tickets] = await Promise.all([
        supabase.from("projects").select("id, name, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("invoices").select("id, invoice_number, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("support_tickets").select("id, ticket_number, subject, status, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      const items: ActivityItem[] = [
        ...(projects.data ?? []).map(p => ({ id: p.id, type: "project" as const, title: p.name, status: p.status, created_at: p.created_at })),
        ...(invoices.data ?? []).map(i => ({ id: i.id, type: "invoice" as const, title: i.invoice_number, status: i.status, created_at: i.created_at })),
        ...(tickets.data ?? []).map(t => ({ id: t.id, type: "ticket" as const, title: `${t.ticket_number} – ${t.subject}`, status: t.status, created_at: t.created_at })),
      ];

      return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);
    },
  });
};
