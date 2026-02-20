import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { PageHeader } from "@/shared/components/common/PageHeader";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { StateTransition, STATE_MACHINES } from "@/shared/components/common/StateTransition";
import { Search, Plus, Filter, MoreHorizontal, Building2 } from "lucide-react";
import { useInquiries } from "@/features/sales/hooks/useInquiries";
import { useSupabaseUpdate } from "@/shared/hooks/useSupabaseCrud";
import { useState } from "react";
import { FormDialog } from "@/shared/components/common/FormDialog";
import { useSupabaseInsert } from "@/shared/hooks/useSupabaseCrud";
import { useClients } from "@/features/clients/hooks/useClients";

const statusVariantMap: Record<string, "info" | "warning" | "hold" | "success" | "neutral" | "error"> = {
  New: "info", Qualified: "warning", "Proposal Sent": "hold", "Contract Pending": "success", Won: "success", Lost: "neutral", Rejected: "error", Converted: "success",
};

export default function Sales() {
  const { data: inquiries, isLoading } = useInquiries();
  const { data: clients } = useClients();
  const updateMut = useSupabaseUpdate("inquiries", [["inquiries"]]);
  const insertMut = useSupabaseInsert("inquiries", [["inquiries"]]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", budget_estimate: "", client_id: "", status: "New" });

  const handleTransition = (id: string, newStatus: string) => {
    updateMut.mutate({ id, status: newStatus });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    insertMut.mutate({
      ...form,
      budget_estimate: form.budget_estimate ? Number(form.budget_estimate) : null,
    }, { onSuccess: () => { setFormOpen(false); setForm({ title: "", description: "", budget_estimate: "", client_id: "", status: "New" }); } });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Sales Pipeline"
          subtitle={`Manage inquiries, quotations, and contracts · ${inquiries?.length ?? 0} total`}
          actions={
            <button onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> New Inquiry
            </button>
          }
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Table */}
          <div className="xl:col-span-2">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Budget</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {isLoading ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
                    ) : !inquiries?.length ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No inquiries yet.</td></tr>
                    ) : (
                      inquiries.map((inq: any) => (
                        <tr
                          key={inq.id}
                          onClick={() => setSelectedInquiry(inq)}
                          className={`hover:bg-muted/30 transition-colors cursor-pointer ${selectedInquiry?.id === inq.id ? "bg-primary/5" : ""}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                                <Building2 className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <span className="font-medium">{inq.clients?.name ?? "—"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{inq.title}</td>
                          <td className="px-4 py-3 text-right font-mono text-xs">
                            {inq.budget_estimate ? `Rp ${Number(inq.budget_estimate).toLocaleString("id-ID")}` : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={inq.status} variant={statusVariantMap[inq.status] ?? "neutral"} />
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(inq.created_at).toLocaleDateString("id-ID")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side panel - State transitions per domain-state-machines.md */}
          <div className="space-y-4">
            {selectedInquiry ? (
              <div className="bg-card rounded-lg border border-border p-5 space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedInquiry.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedInquiry.clients?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedInquiry.status} variant={statusVariantMap[selectedInquiry.status] ?? "neutral"} />
                </div>
                {selectedInquiry.description && (
                  <p className="text-sm text-muted-foreground">{selectedInquiry.description}</p>
                )}
                {selectedInquiry.budget_estimate && (
                  <div>
                    <p className="text-xs text-muted-foreground">Budget Estimate</p>
                    <p className="text-lg font-mono font-medium">Rp {Number(selectedInquiry.budget_estimate).toLocaleString("id-ID")}</p>
                  </div>
                )}
                <StateTransition
                  currentStatus={selectedInquiry.status}
                  transitions={(STATE_MACHINES.inquiry as any)[selectedInquiry.status] ?? []}
                  onTransition={(newStatus) => handleTransition(selectedInquiry.id, newStatus)}
                  isLoading={updateMut.isPending}
                />
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">Select an inquiry to view details and manage transitions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Inquiry Dialog */}
      <FormDialog open={formOpen} onOpenChange={setFormOpen} title="New Inquiry" description="Create a new sales inquiry.">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title *</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Website Redesign" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Client</label>
            <select value={form.client_id} onChange={e => setForm({...form, client_id: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Select client...</option>
              {clients?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Budget Estimate (Rp)</label>
            <input type="number" value={form.budget_estimate} onChange={e => setForm({...form, budget_estimate: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. 50000000" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted">Cancel</button>
            <button type="submit" disabled={insertMut.isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50">Create</button>
          </div>
        </form>
      </FormDialog>
    </AppLayout>
  );
}