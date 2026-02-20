import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { PageHeader } from "@/shared/components/common/PageHeader";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { DataTable } from "@/shared/components/common/DataTable";
import { useQuotations } from "@/features/sales/hooks/useQuotations";
import { StateTransition, STATE_MACHINES } from "@/shared/components/common/StateTransition";
import { useSupabaseUpdate } from "@/shared/hooks/useSupabaseCrud";
import { useState } from "react";

const statusMap: Record<string, "info" | "warning" | "success" | "error" | "neutral"> = {
  Draft: "neutral", Sent: "info", Accepted: "success", Rejected: "error", Expired: "warning",
};

export default function QuotationsPage() {
  const { data: quotations, isLoading } = useQuotations();
  const updateMut = useSupabaseUpdate("quotations", [["quotations"]]);
  const [selected, setSelected] = useState<any>(null);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title="Quotations" subtitle="Manage price quotations for clients" />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <DataTable
              columns={[
                { key: "client", header: "Client", sortable: true, sortValue: (q: any) => q.clients?.name ?? "", render: (q: any) => <span className="font-medium">{q.clients?.name ?? "—"}</span> },
                { key: "inquiry", header: "Inquiry", render: (q: any) => <span className="text-muted-foreground">{q.inquiries?.title ?? "—"}</span> },
                { key: "amount", header: "Amount", className: "text-right", sortable: true, sortValue: (q: any) => Number(q.total_amount), render: (q: any) => <span className="font-mono text-xs font-medium">Rp {Number(q.total_amount).toLocaleString("id-ID")}</span> },
                { key: "status", header: "Status", render: (q: any) => <StatusBadge status={q.status} variant={statusMap[q.status] ?? "neutral"} /> },
                { key: "valid", header: "Valid Until", sortable: true, sortValue: (q: any) => q.valid_until ?? "", render: (q: any) => <span className="text-xs text-muted-foreground">{q.valid_until ?? "—"}</span> },
              ]}
              data={quotations ?? []}
              isLoading={isLoading}
              emptyMessage="No quotations yet."
              searchField={(q: any) => `${q.clients?.name} ${q.inquiries?.title}`}
              searchPlaceholder="Search quotations..."
              onRowClick={setSelected}
            />
          </div>

          <div>
            {selected ? (
              <div className="bg-card rounded-lg border border-border p-5 space-y-4 sticky top-6">
                <div>
                  <h3 className="font-semibold">{selected.clients?.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selected.inquiries?.title ?? "—"}</p>
                </div>
                <StatusBadge status={selected.status} variant={statusMap[selected.status] ?? "neutral"} />
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-mono font-bold">Rp {Number(selected.total_amount).toLocaleString("id-ID")}</p>
                </div>
                {selected.valid_until && (
                  <div>
                    <p className="text-xs text-muted-foreground">Valid Until</p>
                    <p className="text-sm font-medium">{selected.valid_until}</p>
                  </div>
                )}
                <StateTransition
                  currentStatus={selected.status}
                  transitions={(STATE_MACHINES.quotation as any)[selected.status] ?? []}
                  onTransition={(newStatus) => updateMut.mutate({ id: selected.id, status: newStatus })}
                  isLoading={updateMut.isPending}
                />
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">Select a quotation to manage</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}