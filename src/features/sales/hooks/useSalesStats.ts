import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";

export function useSalesStats() {
  const { data: recentInquiries } = useQuery({
    queryKey: ["recent-inquiries"],
    queryFn: async () => {
      const { data } = await supabase
        .from("inquiries")
        .select("id, title, status, created_at, clients(name)")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const pipelineSummary = [
    { stage: "New Inquiries", count: recentInquiries?.filter(i => i.status === "New").length ?? 0, color: "info" as const },
    { stage: "Qualified", count: recentInquiries?.filter(i => i.status === "Qualified").length ?? 0, color: "warning" as const },
    { stage: "Proposal Sent", count: recentInquiries?.filter(i => i.status === "Proposal Sent").length ?? 0, color: "hold" as const },
    { stage: "Won", count: recentInquiries?.filter(i => i.status === "Won").length ?? 0, color: "success" as const },
  ];

  return { recentInquiries, pipelineSummary };
}
