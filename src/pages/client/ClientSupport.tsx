import { useAuth } from "@/features/auth/AuthContext";
import { FormDialog } from "@/shared/components/common/FormDialog";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { EmptyState } from "@/features/client/components/EmptyState";
import { ValidatedInput, ValidatedTextarea, ValidatedSelect } from "@/shared/components/common/ValidatedInput";
import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { ticketSchema, type TicketFormValues } from "@/shared/lib/validations";
import { useClientTickets, useClientTicketMutation } from "@/features/client/hooks/useClientTickets";
import { useClientProjects } from "@/features/client/hooks/useClientProjects";
import { Clock, Plus, MessageSquare, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { differenceInMinutes, parseISO } from "date-fns";
import { cn } from "@/shared/utils/utils";

const statusMap: Record<string, "info" | "success" | "error" | "neutral"> = {
  Open: "info", "In Progress": "info", Escalated: "error", Resolved: "success", Closed: "neutral",
};
const priorityMap: Record<string, "error" | "warning" | "neutral"> = {
  Critical: "error", High: "warning", Medium: "warning", Low: "neutral",
};

function SlaIndicator({ deadline }: { deadline: string }) {
  const minutesLeft = differenceInMinutes(parseISO(deadline), new Date());
  const hoursLeft = Math.floor(minutesLeft / 60);
  const isBreached = minutesLeft <= 0;
  const isUrgent = minutesLeft > 0 && minutesLeft <= 120;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded",
      isBreached ? "bg-status-error/10 text-status-error" : isUrgent ? "bg-status-warning/10 text-status-warning animate-pulse" : "bg-muted text-muted-foreground"
    )}>
      <Clock className="w-3 h-3" />
      {isBreached ? "SLA Breached" : hoursLeft > 0 ? `${hoursLeft}h left` : `${minutesLeft}m left`}
    </span>
  );
}

export default function ClientSupport() {
  const { profile } = useAuth();
  const { data: tickets, isLoading } = useClientTickets();
  const { data: projects } = useClientProjects();
  const createTicket = useClientTicketMutation();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<TicketFormValues>({ subject: "", description: "", priority: "Medium" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = ticketSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => { fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    createTicket.mutate({ subject: result.data.subject!, description: result.data.description!, priority: result.data.priority! }, { onSuccess: () => setFormOpen(false) });
  };

  const openCount = tickets?.filter(t => ["Open", "In Progress"].includes(t.status)).length ?? 0;
  const resolvedCount = tickets?.filter(t => ["Resolved", "Closed"].includes(t.status)).length ?? 0;

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Support</h1>
            <p className="text-sm text-muted-foreground mt-1">{openCount} open · {resolvedCount} resolved</p>
          </div>
          <button onClick={() => { setForm({ subject: "", description: "", priority: "Medium" }); setErrors({}); setFormOpen(true); }} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90">
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : !tickets?.length ? (
              <EmptyState icon={MessageSquare} headline="No support tickets" description="Create a ticket to get help from our team." action={{ label: "New Ticket", onClick: () => setFormOpen(true) }} />
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket: any) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      "bg-card rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow",
                      ticket.priority === "Critical" && "border-l-4 border-l-status-error",
                      ticket.status === "Escalated" && "border-l-4 border-l-destructive border-destructive/20",
                      selectedTicket?.id === ticket.id && "border-primary/40 bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-mono text-xs text-primary font-medium">{ticket.ticket_number}</span>
                      <StatusBadge status={ticket.priority} variant={priorityMap[ticket.priority] ?? "neutral"} className={ticket.priority === "Critical" ? "animate-pulse" : ""} />
                      <StatusBadge status={ticket.status} variant={statusMap[ticket.status] ?? "neutral"} />
                      {ticket.sla_deadline && !["Resolved", "Closed"].includes(ticket.status) && <SlaIndicator deadline={ticket.sla_deadline} />}
                    </div>
                    <h3 className="font-medium">{ticket.subject}</h3>
                    {ticket.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {ticket.projects?.name && <span>{ticket.projects.name}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket.created_at).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {selectedTicket ? (
              <div className="bg-card rounded-lg border border-border p-5 space-y-4 sticky top-6">
                <div>
                  <p className="font-mono text-xs text-primary font-medium">{selectedTicket.ticket_number}</p>
                  <h3 className="font-semibold mt-1">{selectedTicket.subject}</h3>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={selectedTicket.status} variant={statusMap[selectedTicket.status] ?? "neutral"} />
                  <StatusBadge status={selectedTicket.priority} variant={priorityMap[selectedTicket.priority] ?? "neutral"} />
                  {selectedTicket.sla_deadline && !["Resolved", "Closed"].includes(selectedTicket.status) && <SlaIndicator deadline={selectedTicket.sla_deadline} />}
                </div>
                {selectedTicket.description && (
                  <div><p className="text-xs text-muted-foreground mb-1">Description</p><p className="text-sm">{selectedTicket.description}</p></div>
                )}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-muted-foreground">Created</p><p className="font-medium">{new Date(selectedTicket.created_at).toLocaleDateString("id-ID")}</p></div>
                  {selectedTicket.resolved_at && <div><p className="text-muted-foreground">Resolved</p><p className="font-medium">{new Date(selectedTicket.resolved_at).toLocaleDateString("id-ID")}</p></div>}
                  {selectedTicket.projects?.name && <div><p className="text-muted-foreground">Project</p><p className="font-medium">{selectedTicket.projects.name}</p></div>}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">Select a ticket to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <FormDialog open={formOpen} onOpenChange={setFormOpen} title="New Support Ticket" description="Describe your issue and we'll get back to you.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <ValidatedInput label="Subject" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} error={errors.subject} placeholder="Brief description of your issue" />
          <ValidatedTextarea label="Description" rows={4} value={form.description ?? ""} onChange={e => setForm({...form, description: e.target.value})} error={errors.description} placeholder="Provide details..." />
          <ValidatedSelect label="Priority" value={form.priority} onChange={e => setForm({...form, priority: e.target.value as any})} error={errors.priority} options={[{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }, { value: "Critical", label: "Critical" }]} />
          {projects && projects.length > 0 && (
            <ValidatedSelect label="Project (optional)" value={(form as any).project_id ?? ""} onChange={e => setForm({...form, project_id: e.target.value} as any)} options={[{ value: "", label: "— None —" }, ...projects.map(p => ({ value: p.id, label: p.name }))]} />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted">Cancel</button>
            <button type="submit" disabled={createTicket.isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50">Submit Ticket</button>
          </div>
        </form>
      </FormDialog>
    </ClientLayout>
  );
}
