import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { useAuth } from "@/features/auth/AuthContext";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { KPICard } from "@/shared/components/common/StatusBadge";
import { FolderKanban, Receipt, HeadphonesIcon, Clock } from "lucide-react";
import { useClientProjects } from "@/features/client/hooks/useClientProjects";
import { useClientInvoices } from "@/features/client/hooks/useClientInvoices";
import { useClientTickets } from "@/features/client/hooks/useClientTickets";

const statusVariant: Record<string, "info" | "warning" | "hold" | "success" | "neutral"> = {
  Planning: "warning", "In Progress": "info", "On Hold": "hold", Completed: "success", Cancelled: "neutral",
};

export default function ClientDashboard() {
  const { profile } = useAuth();

  const { data: projects } = useClientProjects();
  const { data: invoices } = useClientInvoices();
  const { data: tickets } = useClientTickets();

  const activeProjects = projects?.filter(p => ["Planning", "In Progress"].includes(p.status)).length ?? 0;
  const outstandingAmt = invoices?.filter(i => ["Sent", "Viewed", "Overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const openTickets = tickets?.filter(t => ["Open", "In Progress"].includes(t.status)).length ?? 0;

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {profile?.full_name ? `Hello, ${profile.full_name}` : "My Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Your project and account overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard title="Active Projects" value={String(activeProjects)} icon={FolderKanban} />
          <KPICard title="Outstanding" value={`Rp ${(outstandingAmt / 1e6).toFixed(0)}M`} icon={Receipt} />
          <KPICard title="Open Tickets" value={String(openTickets)} icon={HeadphonesIcon} />
        </div>

        {/* Project cards */}
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-primary" /> My Projects
          </h2>
          {!projects?.length ? (
            <p className="text-sm text-muted-foreground bg-card rounded-lg border border-border p-6 text-center">No projects assigned yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{p.name}</h3>
                    <StatusBadge status={p.status} variant={statusVariant[p.status] ?? "neutral"} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-mono">{p.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent invoices */}
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" /> Recent Invoices
          </h2>
          {!invoices?.length ? (
            <p className="text-sm text-muted-foreground bg-card rounded-lg border border-border p-6 text-center">No invoices yet.</p>
          ) : (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Invoice</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Due</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {invoices.slice(0, 5).map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-mono text-xs">{inv.invoice_number}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs">Rp {Number(inv.amount).toLocaleString("id-ID")}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={inv.status} variant={inv.status === "Paid" ? "success" : inv.status === "Overdue" ? "error" : "info"} /></td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{inv.due_date ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
