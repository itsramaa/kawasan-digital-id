import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/shared/DataTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const statusMap: Record<string, "info" | "warning" | "success" | "error" | "neutral"> = {
  Draft: "neutral", Sent: "info", Active: "success", Completed: "success", Terminated: "error", Signed: "success",
};

export default function ContractsPage() {
  const { data: contracts, isLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contracts").select("*, clients(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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
