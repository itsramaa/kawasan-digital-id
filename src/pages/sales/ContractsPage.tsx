import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { DataTable } from "@/shared/components/common/DataTable";
import { useContracts } from "@/features/sales/hooks/useContracts";

const statusMap: Record<string, "info" | "warning" | "success" | "error" | "neutral"> = {
  Draft: "neutral", Sent: "info", Active: "success", Completed: "success", Terminated: "error", Signed: "success",
};

export default function ContractsPage() {
  const { data: contracts, isLoading } = useContracts();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage signed agreements and contracts</p>
        </div>

        <DataTable
          columns={[
            { key: "title", header: "Contract", render: (c: any) => <span className="font-medium">{c.title}</span> },
            { key: "client", header: "Client", render: (c: any) => <span className="text-muted-foreground">{c.clients?.name ?? "—"}</span> },
            { key: "value", header: "Value", className: "text-right", render: (c: any) => <span className="font-mono text-xs font-medium">Rp {Number(c.total_value).toLocaleString("id-ID")}</span> },
            { key: "status", header: "Status", render: (c: any) => <StatusBadge status={c.status} variant={statusMap[c.status] ?? "neutral"} /> },
            { key: "dates", header: "Period", render: (c: any) => <span className="text-xs text-muted-foreground">{c.start_date ?? "—"} → {c.end_date ?? "—"}</span> },
          ]}
          data={contracts ?? []}
          isLoading={isLoading}
          emptyMessage="No contracts yet."
          searchField={(c: any) => `${c.title} ${c.clients?.name}`}
          searchPlaceholder="Search contracts..."
        />
      </div>
    </AppLayout>
  );
}
