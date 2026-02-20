import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { PageHeader } from "@/shared/components/common/PageHeader";
import { StatusBadge, KPICard } from "@/shared/components/common/StatusBadge";
import { StateTransition, STATE_MACHINES } from "@/shared/components/common/StateTransition";
import { Search, Plus, Filter, MoreHorizontal, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useInvoices } from "@/features/finance/hooks/useInvoices";
import { useSupabaseUpdate } from "@/shared/hooks/useSupabaseCrud";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const statusVariantMap: Record<string, "info" | "warning" | "success" | "error" | "neutral"> = {
  Draft: "neutral", Sent: "info", Viewed: "info", Paid: "success", Overdue: "error", Void: "neutral", "Bad Debt": "error",
};

const PIE_COLORS = ["hsl(160, 60%, 45%)", "hsl(216, 51%, 48%)", "hsl(0, 84%, 60%)", "hsl(220, 9%, 46%)"];

export default function Finance() {
  const { data: invoices, isLoading } = useInvoices();
  const updateMut = useSupabaseUpdate("invoices", [["invoices"]]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const totalBilled = invoices?.reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const collected = invoices?.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const outstanding = invoices?.filter(i => ["Sent", "Viewed", "Overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const overdueAmt = invoices?.filter(i => i.status === "Overdue").reduce((s, i) => s + Number(i.amount), 0) ?? 0;

  const pieData = [
    { name: "Paid", value: collected },
    { name: "Outstanding", value: outstanding - overdueAmt },
    { name: "Overdue", value: overdueAmt },
    { name: "Other", value: totalBilled - collected - outstanding },
  ].filter(d => d.value > 0);

  const handleTransition = (id: string, newStatus: string) => {
    const updates: Record<string, any> = { id, status: newStatus };
    if (newStatus === "Paid") updates.paid_at = new Date().toISOString();
    if (newStatus === "Sent") updates.issued_at = new Date().toISOString();
    updateMut.mutate(updates);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Finance"
          subtitle="Invoices, payments, and financial tracking"
          actions={
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> Create Invoice
            </button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard title="Total Billed" value={`Rp ${(totalBilled / 1e6).toFixed(0)}M`} icon={DollarSign} />
          <KPICard title="Collected" value={`Rp ${(collected / 1e6).toFixed(0)}M`} icon={CheckCircle} />
          <KPICard title="Outstanding" value={`Rp ${(outstanding / 1e6).toFixed(0)}M`} icon={TrendingUp} />
          <KPICard title="Overdue" value={`Rp ${(overdueAmt / 1e6).toFixed(0)}M`} changeType="negative" icon={AlertTriangle} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Invoice Table */}
          <div className="xl:col-span-2">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Invoice #</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {isLoading ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
                    ) : !invoices?.length ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No invoices yet.</td></tr>
                    ) : (
                      invoices.map((inv: any) => (
                        <tr
                          key={inv.id}
                          onClick={() => setSelectedInvoice(inv)}
                          className={`hover:bg-muted/30 transition-colors cursor-pointer ${inv.status === "Overdue" ? "border-l-4 border-l-destructive" : ""} ${selectedInvoice?.id === inv.id ? "bg-primary/5" : ""}`}
                        >
                          <td className="px-4 py-3 font-mono text-xs text-primary font-medium">{inv.invoice_number}</td>
                          <td className="px-4 py-3 font-medium">{inv.clients?.name ?? "—"}</td>
                          <td className="px-4 py-3 text-right font-mono text-xs font-medium">Rp {Number(inv.amount).toLocaleString("id-ID")}</td>
                          <td className="px-4 py-3"><StatusBadge status={inv.status} variant={statusVariantMap[inv.status] ?? "neutral"} /></td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{inv.due_date ?? "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Pie Chart */}
            {pieData.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-5">
                <h3 className="text-sm font-semibold mb-3">Revenue Breakdown</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(val: number) => `Rp ${(val / 1e6).toFixed(1)}M`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-2">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      {d.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoice Detail + State Transition */}
            {selectedInvoice ? (
              <div className="bg-card rounded-lg border border-border p-5 space-y-4">
                <div>
                  <p className="font-mono text-xs text-primary font-medium">{selectedInvoice.invoice_number}</p>
                  <h3 className="font-semibold mt-1">{selectedInvoice.clients?.name}</h3>
                </div>
                <StatusBadge status={selectedInvoice.status} variant={statusVariantMap[selectedInvoice.status] ?? "neutral"} />
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-xl font-mono font-bold">Rp {Number(selectedInvoice.amount).toLocaleString("id-ID")}</p>
                </div>
                <StateTransition
                  currentStatus={selectedInvoice.status}
                  transitions={(STATE_MACHINES.invoice as any)[selectedInvoice.status] ?? []}
                  onTransition={(newStatus) => handleTransition(selectedInvoice.id, newStatus)}
                  isLoading={updateMut.isPending}
                />
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">Select an invoice to manage</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}