import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { KPICard } from "@/shared/components/common/StatusBadge";
import { DataTable } from "@/shared/components/common/DataTable";
import { useClientPayments } from "@/features/client/hooks/useClientPayments";
import { CreditCard, Receipt, CalendarCheck } from "lucide-react";

export default function ClientPayments() {
  const { data: payments, isLoading } = useClientPayments();

  const totalPaid = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const count = payments?.length ?? 0;
  const latest = payments?.[0]?.payment_date ? new Date(payments[0].payment_date).toLocaleDateString("id-ID") : "—";

  return (
    <ClientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard title="Total Paid" value={`Rp ${(totalPaid / 1e6).toFixed(0)}M`} icon={CreditCard} />
          <KPICard title="Transactions" value={String(count)} icon={Receipt} />
          <KPICard title="Last Payment" value={latest} icon={CalendarCheck} />
        </div>

        <DataTable
          columns={[
            { key: "invoice", header: "Invoice #", render: (p: any) => <span className="font-mono text-xs text-primary font-medium">{p.invoices?.invoice_number ?? "—"}</span> },
            { key: "project", header: "Project", render: (p: any) => <span className="text-muted-foreground text-sm">{p.invoices?.projects?.name ?? "—"}</span> },
            { key: "amount", header: "Amount", className: "text-right", render: (p: any) => <span className="font-mono text-xs font-medium">Rp {Number(p.amount).toLocaleString("id-ID")}</span> },
            { key: "date", header: "Date", render: (p: any) => <span className="text-xs text-muted-foreground">{new Date(p.payment_date).toLocaleDateString("id-ID")}</span> },
            { key: "method", header: "Method", render: (p: any) => <span className="text-xs text-muted-foreground">{p.payment_method ?? "—"}</span> },
            { key: "ref", header: "Reference", render: (p: any) => <span className="font-mono text-xs text-muted-foreground">{p.reference_number ?? "—"}</span> },
          ]}
          data={payments ?? []}
          isLoading={isLoading}
          emptyMessage="No payments recorded yet."
          searchField={(p: any) => `${p.invoices?.invoice_number} ${p.reference_number} ${p.invoices?.projects?.name}`}
          searchPlaceholder="Search payments..."
        />
      </div>
    </ClientLayout>
  );
}
