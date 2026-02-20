import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { StatusBadge, KPICard } from "@/shared/components/common/StatusBadge";
import { DataTable } from "@/shared/components/common/DataTable";
import { EmptyState } from "@/features/client/components/EmptyState";
import { useClientContracts } from "@/features/client/hooks/useClientContracts";
import { FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

const statusMap: Record<string, "info" | "success" | "warning" | "error" | "neutral"> = {
  Draft: "neutral", Signed: "info", Active: "success", Completed: "success", Suspended: "warning", Terminated: "error",
};

export default function ClientContracts() {
  const { data: contracts, isLoading } = useClientContracts();

  const active = contracts?.filter(c => c.status === "Active").length ?? 0;
  const totalValue = contracts?.filter(c => ["Active", "Signed"].includes(c.status)).reduce((s, c) => s + Number(c.total_value), 0) ?? 0;
  const expiringSoon = contracts?.filter(c => {
    if (!c.end_date || c.status !== "Active") return false;
    return differenceInDays(parseISO(c.end_date), new Date()) <= 60;
  }).length ?? 0;

  return (
    <ClientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard title="Active Contracts" value={String(active)} icon={FileText} />
          <KPICard title="Total Value" value={`Rp ${(totalValue / 1e6).toFixed(0)}M`} icon={CheckCircle} />
          <KPICard title="Expiring Soon" value={String(expiringSoon)} changeType={expiringSoon > 0 ? "negative" : "neutral"} change={expiringSoon > 0 ? "Within 60 days" : "All good"} icon={AlertTriangle} />
        </div>

        <DataTable
          columns={[
            { key: "title", header: "Contract", render: (c: any) => <span className="font-medium">{c.title}</span> },
            { key: "status", header: "Status", render: (c: any) => <StatusBadge status={c.status} variant={statusMap[c.status] ?? "neutral"} /> },
            { key: "start", header: "Start", render: (c: any) => <span className="text-xs text-muted-foreground">{c.start_date ?? "—"}</span> },
            { key: "end", header: "End", render: (c: any) => {
              const daysLeft = c.end_date ? differenceInDays(parseISO(c.end_date), new Date()) : null;
              return (
                <div>
                  <span className="text-xs text-muted-foreground">{c.end_date ?? "—"}</span>
                  {daysLeft !== null && daysLeft <= 60 && daysLeft > 0 && c.status === "Active" && (
                    <span className="ml-2 text-[10px] text-status-warning font-medium">{daysLeft}d left</span>
                  )}
                </div>
              );
            }},
            { key: "value", header: "Value", className: "text-right", render: (c: any) => <span className="font-mono text-xs font-medium">Rp {Number(c.total_value).toLocaleString("id-ID")}</span> },
          ]}
          data={contracts ?? []}
          isLoading={isLoading}
          emptyMessage="No contracts yet."
          emptyIcon={<EmptyState icon={FileText} headline="No contracts" description="Your contracts will appear here." />}
          searchField={(c: any) => c.title}
          searchPlaceholder="Search contracts..."
          rowClassName={(c: any) => {
            if (!c.end_date || c.status !== "Active") return "";
            return differenceInDays(parseISO(c.end_date), new Date()) <= 30 ? "border-l-4 border-l-status-error" : "";
          }}
        />
      </div>
    </ClientLayout>
  );
}
