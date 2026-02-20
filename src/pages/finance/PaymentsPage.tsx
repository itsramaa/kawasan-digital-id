import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { DataTable } from "@/shared/components/common/DataTable";
import { usePayments } from "@/features/finance/hooks/usePayments";

export default function PaymentsPage() {
  const { data: payments, isLoading } = usePayments();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">Payment records and verification</p>
        </div>

        <DataTable
          columns={[
            { key: "invoice", header: "Invoice", render: (p: any) => <span className="font-mono text-xs text-primary font-medium">{p.invoices?.invoice_number ?? "—"}</span> },
            { key: "client", header: "Client", render: (p: any) => <span className="font-medium">{p.invoices?.clients?.name ?? "—"}</span> },
            { key: "amount", header: "Amount", className: "text-right", render: (p: any) => <span className="font-mono text-xs font-medium">Rp {Number(p.amount).toLocaleString("id-ID")}</span> },
            { key: "method", header: "Method", render: (p: any) => <span className="text-muted-foreground">{p.payment_method ?? "—"}</span> },
            { key: "reference", header: "Reference", render: (p: any) => <span className="font-mono text-xs text-muted-foreground">{p.reference_number ?? "—"}</span> },
            { key: "date", header: "Date", render: (p: any) => <span className="text-xs text-muted-foreground">{new Date(p.payment_date).toLocaleDateString("id-ID")}</span> },
          ]}
          data={payments ?? []}
          isLoading={isLoading}
          emptyMessage="No payments recorded."
          searchField={(p: any) => `${p.invoices?.invoice_number} ${p.reference_number} ${p.invoices?.clients?.name}`}
          searchPlaceholder="Search payments..."
        />
      </div>
    </AppLayout>
  );
}
