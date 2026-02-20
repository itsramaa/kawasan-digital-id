import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { KPICard } from "@/components/shared/StatusBadge";
import { Search, Plus, Filter, MoreHorizontal, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const statusVariantMap: Record<string, "info" | "warning" | "success" | "error" | "neutral"> = {
  Draft: "neutral", Sent: "info", Viewed: "info", Paid: "success", Overdue: "error", Void: "neutral", "Bad Debt": "error",
};

export default function Finance() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*, clients(name), projects(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const totalBilled = invoices?.reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const collected = invoices?.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const outstanding = invoices?.filter(i => ["Sent", "Viewed", "Overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const overdueAmt = invoices?.filter(i => i.status === "Overdue").reduce((s, i) => s + Number(i.amount), 0) ?? 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
            <p className="text-sm text-muted-foreground mt-1">Invoices, payments, and financial tracking</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard title="Total Billed" value={`Rp ${(totalBilled / 1e6).toFixed(0)}M`} icon={DollarSign} />
          <KPICard title="Collected" value={`Rp ${(collected / 1e6).toFixed(0)}M`} icon={CheckCircle} />
          <KPICard title="Outstanding" value={`Rp ${(outstanding / 1e6).toFixed(0)}M`} icon={TrendingUp} />
          <KPICard title="Overdue" value={`Rp ${(overdueAmt / 1e6).toFixed(0)}M`} changeType="negative" icon={AlertTriangle} />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search invoices..." className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Invoice #</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !invoices?.length ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No invoices yet.</td></tr>
                ) : (
                  invoices.map((inv: any) => (
                    <tr key={inv.id} className={`hover:bg-muted/30 transition-colors cursor-pointer ${inv.status === "Overdue" ? "border-l-4 border-l-status-error" : ""}`}>
                      <td className="px-4 py-3 font-mono text-xs text-primary font-medium">{inv.invoice_number}</td>
                      <td className="px-4 py-3 font-medium">{inv.clients?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{inv.projects?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-medium">Rp {Number(inv.amount).toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3"><StatusBadge status={inv.status} variant={statusVariantMap[inv.status] ?? "neutral"} /></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{inv.due_date ?? "—"}</td>
                      <td className="px-4 py-3"><button className="p-1 hover:bg-muted rounded"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
