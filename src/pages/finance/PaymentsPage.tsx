import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentsPage() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payments").select("*, invoices(invoice_number, clients(name))").order("payment_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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
