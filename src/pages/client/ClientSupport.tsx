import { useState } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormDialog } from "@/components/shared/FormDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth/AuthContext";
import { Plus, Clock } from "lucide-react";
import { toast } from "sonner";

const statusMap: Record<string, "info" | "success" | "error" | "neutral"> = {
  Open: "info", "In Progress": "info", Escalated: "error", Resolved: "success", Closed: "neutral",
};
const priorityMap: Record<string, "error" | "warning" | "neutral"> = {
  Critical: "error", High: "warning", Medium: "warning", Low: "neutral",
};

export default function ClientSupport() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "", priority: "Medium" });

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["client-tickets-full"],
    queryFn: async () => {
      const { data } = await supabase.from("support_tickets").select("*, projects(name)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const createTicket = useMutation({
    mutationFn: async (values: any) => {
      const ticketNumber = `TK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;
      const { error } = await supabase.from("support_tickets").insert({
        ...values,
        ticket_number: ticketNumber,
        client_id: profile?.client_id,
        created_by: profile?.user_id,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["client-tickets-full"] }); toast.success("Ticket created!"); setFormOpen(false); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Support</h1>
          <button onClick={() => { setForm({ subject: "", description: "", priority: "Medium" }); setFormOpen(true); }} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90">
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : !tickets?.length ? (
          <p className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">No support tickets yet.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket: any) => (
              <div key={ticket.id} className={`bg-card rounded-lg border p-4 ${ticket.status === "Escalated" ? "border-l-4 border-l-status-error border-status-error/20" : "border-border"}`}>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="font-mono text-xs text-primary font-medium">{ticket.ticket_number}</span>
                  <StatusBadge status={ticket.priority} variant={priorityMap[ticket.priority] ?? "neutral"} />
                  <StatusBadge status={ticket.status} variant={statusMap[ticket.status] ?? "neutral"} />
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

      <FormDialog open={formOpen} onOpenChange={setFormOpen} title="New Support Ticket" description="Describe your issue and we'll get back to you.">
        <form onSubmit={(e) => { e.preventDefault(); createTicket.mutate(form); }} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Subject *</label>
            <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Brief description of your issue" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Provide details..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Priority</label>
            <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted">Cancel</button>
            <button type="submit" disabled={createTicket.isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50">Submit Ticket</button>
          </div>
        </form>
      </FormDialog>
    </ClientLayout>
  );
}
