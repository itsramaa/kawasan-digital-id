import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { useAuth } from "@/features/auth/AuthContext";
import { StatusBadge, KPICard } from "@/shared/components/common/StatusBadge";
import { FolderKanban, Receipt, HeadphonesIcon, ArrowUpRight, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useClientProjects } from "@/features/client/hooks/useClientProjects";
import { useClientInvoices } from "@/features/client/hooks/useClientInvoices";
import { useClientTickets } from "@/features/client/hooks/useClientTickets";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const statusVariant: Record<string, "info" | "warning" | "hold" | "success" | "neutral"> = {
  Planning: "warning", "In Progress": "info", "On Hold": "hold", Completed: "success", Cancelled: "neutral",
};

const PIE_COLORS = ["hsl(160, 60%, 45%)", "hsl(216, 51%, 48%)", "hsl(0, 84%, 60%)", "hsl(220, 9%, 46%)"];

export default function ClientDashboard() {
  const { profile } = useAuth();
  const { data: projects } = useClientProjects();
  const { data: invoices } = useClientInvoices();
  const { data: tickets } = useClientTickets();

  const activeProjects = projects?.filter(p => ["Planning", "In Progress"].includes(p.status)).length ?? 0;
  const outstandingAmt = invoices?.filter(i => ["Sent", "Viewed", "Overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const paidAmt = invoices?.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const openTickets = tickets?.filter(t => ["Open", "In Progress"].includes(t.status)).length ?? 0;
  const overdueInv = invoices?.filter(i => i.status === "Overdue").length ?? 0;

  const invoicePie = [
    { name: "Paid", value: paidAmt },
    { name: "Outstanding", value: outstandingAmt },
  ].filter(d => d.value > 0);

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {profile?.full_name ? `Hello, ${profile.full_name}` : "My Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Your project and account overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard title="Active Projects" value={String(activeProjects)} icon={FolderKanban} />
          <KPICard title="Outstanding" value={`Rp ${(outstandingAmt / 1e6).toFixed(0)}M`} icon={Receipt} />
          <KPICard title="Open Tickets" value={String(openTickets)} icon={HeadphonesIcon} />
          <KPICard
            title="Overdue Invoices"
            value={String(overdueInv)}
            changeType={overdueInv > 0 ? "negative" : "neutral"}
            change={overdueInv > 0 ? "Action needed" : "All good"}
            icon={AlertTriangle}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Projects */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-primary" /> My Projects
              </h2>
              <Link to="/client/projects" className="text-xs text-primary hover:underline flex items-center gap-1">View All <ArrowUpRight className="w-3 h-3" /></Link>
            </div>
            {!projects?.length ? (
              <p className="text-sm text-muted-foreground bg-card rounded-lg border border-border p-6 text-center">No projects assigned yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 4).map(p => (
                  <div key={p.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium">{p.name}</h3>
                      <StatusBadge status={p.status} variant={statusVariant[p.status] ?? "neutral"} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-mono font-medium">{p.progress}%</span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                    {p.milestones?.length > 0 && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3" />
                        {p.milestones.filter((m: any) => m.status === "Approved").length}/{p.milestones.length} milestones done
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Summary Pie */}
          <div>
            {invoicePie.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-5 mb-4">
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-primary" /> Payment Summary
                </h2>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={invoicePie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                      {invoicePie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(val: number) => `Rp ${(val / 1e6).toFixed(1)}M`} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {invoicePie.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      {d.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Invoices */}
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Recent Invoices</h2>
                <Link to="/client/invoices" className="text-xs text-primary hover:underline flex items-center gap-1">All <ArrowUpRight className="w-3 h-3" /></Link>
              </div>
              {!invoices?.length ? (
                <p className="text-sm text-muted-foreground text-center py-4">No invoices yet.</p>
              ) : (
                <div className="space-y-2">
                  {invoices.slice(0, 4).map(inv => (
                    <div key={inv.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-mono text-xs">{inv.invoice_number}</p>
                        <p className="text-xs text-muted-foreground">{inv.due_date ?? "—"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs font-medium">Rp {Number(inv.amount).toLocaleString("id-ID")}</p>
                        <StatusBadge status={inv.status} variant={inv.status === "Paid" ? "success" : inv.status === "Overdue" ? "error" : "info"} className="text-[9px] px-1.5 py-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
