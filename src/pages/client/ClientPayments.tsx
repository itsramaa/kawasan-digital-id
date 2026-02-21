import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { DataTable } from "@/shared/components/common/DataTable";
import { useClientPayments } from "@/features/client/hooks/useClientPayments";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { CreditCard, Receipt, CalendarCheck, Wallet } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

function RevealCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function ClientPayments() {
  const { data: payments, isLoading } = useClientPayments();

  const totalPaid = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const count = payments?.length ?? 0;
  const latest = payments?.[0]?.payment_date ? new Date(payments[0].payment_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const methodCounts: Record<string, number> = {};
  payments?.forEach(p => {
    const m = p.payment_method ?? "Lainnya";
    methodCounts[m] = (methodCounts[m] || 0) + 1;
  });
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
        {/* Hero Banner */}
        <RevealCard>
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border">
            <div className="px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dashboard &gt; Pembayaran</p>
                  <h1 className="text-2xl font-bold tracking-tight">Pembayaran</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Riwayat dan detail pembayaran Anda</p>
                </div>
              </div>
            </div>
          </div>
        </RevealCard>

        {/* Stat Cards */}
        <RevealCard delay={100}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <s.icon className={cn("w-5 h-5", s.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold truncate">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RevealCard>

        {/* Payments Table */}
        <RevealCard delay={150}>
          <DataTable
            columns={[
              {
                key: "invoice", header: "No. Invoice", render: (p: any) => (
                  <span className="font-mono text-xs text-primary font-medium">{p.invoices?.invoice_number ?? "—"}</span>
                )
              },
              {
                key: "project", header: "Proyek", render: (p: any) => (
                  <span className="text-sm">{p.invoices?.projects?.name ?? "—"}</span>
                )
              },
              {
                key: "amount", header: "Jumlah", className: "text-right", render: (p: any) => (
                  <span className="font-mono text-xs font-semibold">Rp {Number(p.amount).toLocaleString("id-ID")}</span>
                )
              },
              {
                key: "date", header: "Tanggal", render: (p: any) => (
                  <span className="text-xs text-muted-foreground">
                    {new Date(p.payment_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )
              },
              {
                key: "method", header: "Metode", render: (p: any) => (
                  p.payment_method
                    ? <Badge variant="secondary" className="text-[10px]">{p.payment_method}</Badge>
                    : <span className="text-xs text-muted-foreground">—</span>
                )
              },
              {
                key: "ref", header: "Referensi", render: (p: any) => (
                  <span className="font-mono text-xs text-muted-foreground">{p.reference_number ?? "—"}</span>
                )
              },
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
