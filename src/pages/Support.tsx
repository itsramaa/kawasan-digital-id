import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Search, Plus, Filter, MoreHorizontal, Clock, AlertTriangle, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const priorityVariantMap: Record<string, "error" | "warning" | "neutral"> = {
  Critical: "error", High: "warning", Medium: "warning", Low: "neutral",
};
const statusVariantMap: Record<string, "info" | "error" | "success" | "neutral"> = {
  Open: "info", "In Progress": "info", Escalated: "error", Resolved: "success", Closed: "neutral",
};

export default function Support() {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*, clients(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const openCount = tickets?.filter(t => t.status === "Open").length ?? 0;
  const inProgressCount = tickets?.filter(t => t.status === "In Progress").length ?? 0;
  const escalatedCount = tickets?.filter(t => t.status === "Escalated").length ?? 0;
  const resolvedCount = tickets?.filter(t => ["Resolved", "Closed"].includes(t.status)).length ?? 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage SLA tickets and client issues</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground font-medium">Open</p>
            <p className="text-2xl font-bold mt-1">{openCount}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground font-medium">In Progress</p>
            <p className="text-2xl font-bold mt-1">{inProgressCount}</p>
          </div>
          <div className="bg-status-error/5 rounded-lg border border-status-error/20 p-4">
            <p className="text-xs text-status-error font-medium">Escalated</p>
            <p className="text-2xl font-bold mt-1 text-status-error">{escalatedCount}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground font-medium">Resolved</p>
            <p className="text-2xl font-bold mt-1">{resolvedCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search tickets..." className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading tickets...</div>
        ) : !tickets?.length ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">No support tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket: any) => (
              <div key={ticket.id} className={`bg-card rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer ${ticket.status === "Escalated" ? "border-l-4 border-l-status-error border-status-error/20" : "border-border"}`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-primary font-medium">{ticket.ticket_number}</span>
                      <StatusBadge status={ticket.priority} variant={priorityVariantMap[ticket.priority] ?? "neutral"} />
                      <StatusBadge status={ticket.status} variant={statusVariantMap[ticket.status] ?? "neutral"} />
                    </div>
                    <h3 className="font-medium mt-1.5 text-card-foreground">{ticket.subject}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{ticket.clients?.name ?? "—"}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket.created_at).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-muted rounded shrink-0">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
