import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { DataTable } from "@/shared/components/common/DataTable";
import { useQuotations } from "@/features/sales/hooks/useQuotations";

const statusMap: Record<string, "info" | "warning" | "success" | "error" | "neutral"> = {
  Draft: "neutral", Sent: "info", Accepted: "success", Rejected: "error", Expired: "warning",
};

export default function QuotationsPage() {
  const { data: quotations, isLoading } = useQuotations();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quotations</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage price quotations for clients</p>
        </div>

        <DataTable
          columns={[
            { key: "client", header: "Client", render: (q: any) => <span className="font-medium">{q.clients?.name ?? "—"}</span> },
            { key: "inquiry", header: "Inquiry", render: (q: any) => <span className="text-muted-foreground">{q.inquiries?.title ?? "—"}</span> },
            { key: "amount", header: "Amount", className: "text-right", render: (q: any) => <span className="font-mono text-xs font-medium">Rp {Number(q.total_amount).toLocaleString("id-ID")}</span> },
            { key: "status", header: "Status", render: (q: any) => <StatusBadge status={q.status} variant={statusMap[q.status] ?? "neutral"} /> },
            { key: "valid", header: "Valid Until", render: (q: any) => <span className="text-xs text-muted-foreground">{q.valid_until ?? "—"}</span> },
          ]}
          data={quotations ?? []}
          isLoading={isLoading}
          emptyMessage="No quotations yet."
          searchField={(q: any) => `${q.clients?.name} ${q.inquiries?.title}`}
          searchPlaceholder="Search quotations..."
        />
      </div>
    </AppLayout>
  );
}
