import { useState } from "react";
import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { DataTable } from "@/shared/components/common/DataTable";
import { FormDialog } from "@/shared/components/common/FormDialog";
import { ConfirmDialog } from "@/shared/components/common/ConfirmDialog";
import { useClients } from "@/features/clients/hooks/useClients";
import { useClientMutations } from "@/features/clients/hooks/useClientMutations";
import { Plus, MoreHorizontal, Building2, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";

const statusMap: Record<string, "success" | "neutral" | "warning" | "error"> = {
  Active: "success", Inactive: "neutral", Suspended: "error", Archived: "neutral",
};

export default function ClientsPage() {
  const { data: clients, isLoading } = useClients();
  const { insertMut, updateMut, deleteMut } = useClientMutations();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string>("");
  const [form, setForm] = useState({ name: "", company_name: "", email: "", phone: "", industry: "", tax_id: "", status: "Active" });

  const openCreate = () => { setEditing(null); setForm({ name: "", company_name: "", email: "", phone: "", industry: "", tax_id: "", status: "Active" }); setFormOpen(true); };
  const openEdit = (c: any) => { setEditing(c); setForm({ name: c.name, company_name: c.company_name || "", email: c.email || "", phone: c.phone || "", industry: c.industry || "", tax_id: c.tax_id || "", status: c.status }); setFormOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMut.mutate({ id: editing.id, ...form }, { onSuccess: () => setFormOpen(false) });
    } else {
      insertMut.mutate(form, { onSuccess: () => setFormOpen(false) });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage client organizations</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>

        <DataTable
          columns={[
            {
              key: "name", header: "Client", render: (c: any) => (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center"><Building2 className="w-3.5 h-3.5 text-primary" /></div>
                  <div><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.company_name}</p></div>
                </div>
              ),
            },
            { key: "industry", header: "Industry", render: (c: any) => <span className="text-muted-foreground">{c.industry || "—"}</span> },
            { key: "email", header: "Email", render: (c: any) => <span className="text-muted-foreground">{c.email || "—"}</span> },
            { key: "status", header: "Status", render: (c: any) => <StatusBadge status={c.status} variant={statusMap[c.status] ?? "neutral"} /> },
            {
              key: "actions", header: "", render: (c: any) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><button className="p-1 hover:bg-muted rounded"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(c)}><Pencil className="w-3.5 h-3.5 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => { setDeleteId(c.id); setDeleteOpen(true); }}><Trash2 className="w-3.5 h-3.5 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            },
          ]}
          data={clients ?? []}
          isLoading={isLoading}
          emptyMessage="No clients yet. Add your first client."
          searchField={(c: any) => `${c.name} ${c.company_name} ${c.email}`}
          searchPlaceholder="Search clients..."
        />
      </div>

      <FormDialog open={formOpen} onOpenChange={setFormOpen} title={editing ? "Edit Client" : "New Client"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-sm font-medium">Name *</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Company Name</label><input value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-sm font-medium">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-sm font-medium">Industry</label><input value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Tax ID (NPWP)</label><input value={form.tax_id} onChange={e => setForm({...form, tax_id: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Active</option><option>Inactive</option><option>Suspended</option><option>Archived</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted">Cancel</button>
            <button type="submit" disabled={insertMut.isPending || updateMut.isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50">{editing ? "Update" : "Create"}</button>
          </div>
        </form>
      </FormDialog>

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Client" description="Are you sure? This will remove the client and all associated data." destructive onConfirm={() => { deleteMut.mutate(deleteId); setDeleteOpen(false); }} />
    </AppLayout>
  );
}
