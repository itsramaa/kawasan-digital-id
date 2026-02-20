import { ClientLayout } from "@/components/layout/ClientLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { KPICard } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/shared/DataTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Receipt, CheckCircle, AlertTriangle } from "lucide-react";

const statusMap: Record<string, "info" | "success" | "error" | "neutral"> = {
  Draft: "neutral", Sent: "info", Paid: "success", Overdue: "error", Void: "neutral",
};

export default function ClientInvoices() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["client-invoices-full"],
    queryFn: async () => {
      const { data } = await supabase.from("invoices").select("*, projects(name)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const outstanding = invoices?.filter(i => ["Sent", "Overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const paid = invoices?.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const overdueCount = invoices?.filter(i => i.status === "Overdue").length ?? 0;

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
            { key: "due", header: "Due Date", render: (i: any) => <span className="text-xs text-muted-foreground">{i.due_date ?? "—"}</span> },
          ]}
          data={invoices ?? []}
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
