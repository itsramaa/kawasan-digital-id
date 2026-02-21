import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { DataTable } from "@/shared/components/common/DataTable";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { HeroBanner } from "@/shared/components/common/HeroBanner";
import { StatCards } from "@/shared/components/common/StatCards";
import { useClientPayments } from "@/features/client/hooks/useClientPayments";
import { CreditCard, Receipt, CalendarCheck, Wallet } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

export default function ClientPayments() {
  const { data: payments, isLoading } = useClientPayments();

  const totalPaid = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const count = payments?.length ?? 0;
  const latest = payments?.[0]?.payment_date ? new Date(payments[0].payment_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const methodCounts: Record<string, number> = {};
  payments?.forEach(p => { const m = p.payment_method ?? "Lainnya"; methodCounts[m] = (methodCounts[m] || 0) + 1; });
  const topMethod = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  if (isLoading) return <ClientLayout><div className="text-center py-12 text-muted-foreground">Memuat...</div></ClientLayout>;

  const stats = [
    { label: "Total Dibayar", value: `Rp ${(totalPaid / 1e6).toFixed(1)}M`, icon: CreditCard, color: "text-primary" },
    { label: "Transaksi", value: String(count), icon: Receipt, color: "text-primary" },
    { label: "Pembayaran Terakhir", value: latest, icon: CalendarCheck, color: "text-emerald-500" },
    { label: "Metode Terbanyak", value: topMethod, icon: Wallet, color: "text-primary" },
  ];

  return (
    <ClientLayout>
      <div className="space-y-6">
        <HeroBanner icon={CreditCard} title="Pembayaran" subtitle="Riwayat dan detail pembayaran Anda" breadcrumb="Dasbor > Pembayaran" />
        <StatCards stats={stats} />

        <RevealCard delay={150}>
          <DataTable
            columns={[
              { key: "invoice", header: "No. Invoice", render: (p: any) => <span className="font-mono text-xs text-primary font-medium">{p.invoices?.invoice_number ?? "—"}</span> },
              { key: "project", header: "Proyek", render: (p: any) => <span className="text-sm">{p.invoices?.projects?.name ?? "—"}</span> },
              { key: "amount", header: "Jumlah", className: "text-right", render: (p: any) => <span className="font-mono text-xs font-semibold">Rp {Number(p.amount).toLocaleString("id-ID")}</span> },
              { key: "date", header: "Tanggal", render: (p: any) => <span className="text-xs text-muted-foreground">{new Date(p.payment_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span> },
              { key: "method", header: "Metode", render: (p: any) => p.payment_method ? <Badge variant="secondary" className="text-[10px]">{p.payment_method}</Badge> : <span className="text-xs text-muted-foreground">—</span> },
              { key: "ref", header: "Referensi", render: (p: any) => <span className="font-mono text-xs text-muted-foreground">{p.reference_number ?? "—"}</span> },
            ]}
            data={payments ?? []}
            isLoading={isLoading}
            emptyMessage="Belum ada pembayaran tercatat."
            searchField={(p: any) => `${p.invoices?.invoice_number} ${p.reference_number} ${p.invoices?.projects?.name}`}
            searchPlaceholder="Cari pembayaran..."
          />
        </RevealCard>
      </div>
    </ClientLayout>
  );
}
