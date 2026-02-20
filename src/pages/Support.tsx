import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { PageHeader } from "@/shared/components/common/PageHeader";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { StateTransition, STATE_MACHINES } from "@/shared/components/common/StateTransition";
import { Search, Plus, Filter, Clock, HeadphonesIcon } from "lucide-react";
import { useTickets } from "@/features/support/hooks/useTickets";
import { useSupabaseUpdate } from "@/shared/hooks/useSupabaseCrud";
import { useState } from "react";
import { differenceInHours, differenceInDays } from "date-fns";

const priorityVariantMap: Record<string, "error" | "warning" | "neutral"> = {
  Critical: "error", High: "warning", Medium: "warning", Low: "neutral",
};
const statusVariantMap: Record<string, "info" | "error" | "success" | "neutral" | "warning" | "hold"> = {
  Open: "info", Triage: "warning", "In Progress": "info", "Pending Client": "hold", Escalated: "error", Resolved: "success", Closed: "neutral",
};

export default function Support() {
  const { data: tickets, isLoading } = useTickets();
  const updateMut = useSupabaseUpdate("support_tickets", [["tickets"]]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [search, setSearch] = useState("");

  const filtered = tickets?.filter(t => {
    if (!search) return true;
    const lower = search.toLowerCase();
    return t.subject?.toLowerCase().includes(lower) || t.ticket_number?.toLowerCase().includes(lower);
  });

  const openCount = tickets?.filter(t => t.status === "Open").length ?? 0;
  const inProgressCount = tickets?.filter(t => t.status === "In Progress").length ?? 0;
  const escalatedCount = tickets?.filter(t => t.status === "Escalated").length ?? 0;
  const resolvedCount = tickets?.filter(t => ["Resolved", "Closed"].includes(t.status)).length ?? 0;

  const handleTransition = (id: string, newStatus: string) => {
    const updates: { id: string; status: string; resolved_at?: string } = { id, status: newStatus };
    if (newStatus === "Resolved") updates.resolved_at = new Date().toISOString();
    updateMut.mutate(updates);
  };

  // SLA countdown per UI/UX doc Section 10.3
  const getSlaStatus = (ticket: any) => {
    if (!ticket.sla_deadline) return null;
    const deadline = new Date(ticket.sla_deadline);
    const now = new Date();
    if (deadline < now) {
      const hoursOver = differenceInHours(now, deadline);
      return { label: `SLA violated ${hoursOver}h ago`, variant: "error" as const };
    }
    const hoursLeft = differenceInHours(deadline, now);
    if (hoursLeft < 1) return { label: `${Math.max(0, Math.round((deadline.getTime() - now.getTime()) / 60000))}m left`, variant: "error" as const };
    if (hoursLeft < 4) return { label: `${hoursLeft}h remaining`, variant: "warning" as const };
    return { label: `${hoursLeft}h remaining`, variant: "info" as const };
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Support Tickets"
          subtitle="Manage SLA tickets and client issues"
          actions={
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> New Ticket
            </button>
          }
        />

        {/* Status summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground font-medium">Open</p>
            <p className="text-2xl font-bold mt-1">{openCount}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground font-medium">In Progress</p>
            <p className="text-2xl font-bold mt-1">{inProgressCount}</p>
          </div>
          <div className="bg-destructive/5 rounded-lg border border-destructive/20 p-4">
            <p className="text-xs text-destructive font-medium">Escalated</p>
            <p className="text-2xl font-bold mt-1 text-destructive">{escalatedCount}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground font-medium">Resolved</p>
            <p className="text-2xl font-bold mt-1">{resolvedCount}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Ticket list */}
          <div className="xl:col-span-2">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading tickets...</div>
            ) : !filtered?.length ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <HeadphonesIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No support tickets found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((ticket: any) => {
                  const sla = getSlaStatus(ticket);
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`bg-card rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer ${
                        ticket.status === "Escalated" ? "border-l-4 border-l-destructive border-destructive/20" :
                        selectedTicket?.id === ticket.id ? "border-primary/40 bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-primary font-medium">{ticket.ticket_number}</span>
                            <StatusBadge status={ticket.priority} variant={priorityVariantMap[ticket.priority] ?? "neutral"} />
                            <StatusBadge status={ticket.status} variant={statusVariantMap[ticket.status] ?? "neutral"} />
                            {sla && <StatusBadge status={sla.label} variant={sla.variant} className="text-[10px]" />}
                          </div>
                          <h3 className="font-medium mt-1.5 text-card-foreground">{ticket.subject}</h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{ticket.clients?.name ?? "—"}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket.created_at).toLocaleString("id-ID")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail / State Transition Panel */}
          <div className="space-y-4">
            {selectedTicket ? (
              <div className="bg-card rounded-lg border border-border p-5 space-y-4 sticky top-6">
                <div>
                  <p className="font-mono text-xs text-primary font-medium">{selectedTicket.ticket_number}</p>
                  <h3 className="font-semibold mt-1">{selectedTicket.subject}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTicket.clients?.name}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={selectedTicket.status} variant={statusVariantMap[selectedTicket.status] ?? "neutral"} />
                  <StatusBadge status={selectedTicket.priority} variant={priorityVariantMap[selectedTicket.priority] ?? "neutral"} />
                </div>
                {selectedTicket.description && (
                  <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
                )}
                {selectedTicket.sla_deadline && (
                  <div>
                    <p className="text-xs text-muted-foreground">SLA Deadline</p>
                    <p className="text-sm font-medium">{new Date(selectedTicket.sla_deadline).toLocaleString("id-ID")}</p>
                  </div>
                )}
                <StateTransition
                  currentStatus={selectedTicket.status}
                  transitions={(STATE_MACHINES.ticket as any)[selectedTicket.status] ?? []}
                  onTransition={(newStatus) => handleTransition(selectedTicket.id, newStatus)}
                  isLoading={updateMut.isPending}
                />
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">Select a ticket to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}