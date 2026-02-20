import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { KPICard } from "@/shared/components/common/StatusBadge";
import { DataTable } from "@/shared/components/common/DataTable";
import { useClientInvoices } from "@/features/client/hooks/useClientInvoices";
import { Receipt, CheckCircle, AlertTriangle } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

const statusMap: Record<string, "info" | "success" | "error" | "neutral"> = {
  Draft: "neutral", Sent: "info", Paid: "success", Overdue: "error", Void: "neutral",
};

export default function ClientInvoices() {
  const { data: invoices, isLoading } = useClientInvoices();

  const outstanding = invoices?.filter(i => ["Sent", "Overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const paid = invoices?.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const overdueCount = invoices?.filter(i => i.status === "Overdue").length ?? 0;

  // Sort: overdue first, then by due_date ascending
  const sortedInvoices = [...(invoices ?? [])].sort((a, b) => {
    if (a.status === "Overdue" && b.status !== "Overdue") return -1;
    if (b.status === "Overdue" && a.status !== "Overdue") return 1;
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    return 0;
  });

  return (
    <ClientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard title="Outstanding" value={`Rp ${(outstanding / 1e6).toFixed(0)}M`} icon={Receipt} />
          <KPICard title="Paid" value={`Rp ${(paid / 1e6).toFixed(0)}M`} icon={CheckCircle} />
          <KPICard title="Overdue" value={String(overdueCount)} changeType={overdueCount > 0 ? "negative" : "neutral"} icon={AlertTriangle} />
        </div>

        <DataTable
          columns={[
            { key: "number", header: "Invoice #", render: (i: any) => <span className="font-mono text-xs text-primary font-medium">{i.invoice_number}</span> },
            { key: "project", header: "Project", render: (i: any) => <span className="text-muted-foreground">{i.projects?.name ?? "—"}</span> },
            { key: "amount", header: "Amount", className: "text-right", render: (i: any) => <span className="font-mono text-xs font-medium">Rp {Number(i.amount).toLocaleString("id-ID")}</span> },
            { key: "status", header: "Status", render: (i: any) => <StatusBadge status={i.status} variant={statusMap[i.status] ?? "neutral"} /> },
            { key: "due", header: "Due Date", sortable: true, sortValue: (i: any) => i.due_date ?? "", render: (i: any) => {
              const overdueDays = i.due_date && i.status === "Overdue" ? differenceInDays(new Date(), parseISO(i.due_date)) : 0;
              return (
                <div>
                  <span className="text-xs text-muted-foreground">{i.due_date ?? "—"}</span>
                  {overdueDays > 0 && <span className="ml-2 text-[10px] text-status-error font-medium">{overdueDays}d overdue</span>}
                </div>
              );
            }},
            { key: "payment", header: "Paid", render: (i: any) => (
              <span className="text-xs text-muted-foreground">{i.paid_at ? new Date(i.paid_at).toLocaleDateString("id-ID") : "—"}</span>
            )},
          ]}
          data={sortedInvoices}
          isLoading={isLoading}
          emptyMessage="No invoices yet."
          searchField={(i: any) => `${i.invoice_number} ${i.projects?.name}`}
          searchPlaceholder="Search invoices..."
          rowClassName={(i: any) => i.status === "Overdue" ? "border-l-4 border-l-status-error" : ""}
        />
      </div>
    </ClientLayout>
  );
}
