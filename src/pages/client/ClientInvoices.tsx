import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { DataTable } from "@/shared/components/common/DataTable";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { useClientInvoices } from "@/features/client/hooks/useClientInvoices";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { Receipt, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import { differenceInDays, parseISO } from "date-fns";

const statusMap: Record<string, "info" | "success" | "error" | "neutral"> = {
  Draft: "neutral", Sent: "info", Paid: "success", Overdue: "error", Void: "neutral",
};

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

export default function ClientInvoices() {
  const { data: invoices, isLoading } = useClientInvoices();

  const outstanding = invoices?.filter(i => ["Sent", "Overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const paid = invoices?.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const overdueCount = invoices?.filter(i => i.status === "Overdue").length ?? 0;
  const pendingCount = invoices?.filter(i => i.status === "Sent").length ?? 0;

  // Sort: overdue first, then by due_date ascending
  const sortedInvoices = [...(invoices ?? [])].sort((a, b) => {
    if (a.status === "Overdue" && b.status !== "Overdue") return -1;
    if (b.status === "Overdue" && a.status !== "Overdue") return 1;
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    return 0;
  });

  if (isLoading) return <ClientLayout><div className="text-center py-12 text-muted-foreground">Memuat...</div></ClientLayout>;

  const stats = [
    { label: "Belum Dibayar", value: `Rp ${(outstanding / 1e6).toFixed(1)}M`, icon: Receipt, color: "text-primary" },
    { label: "Sudah Dibayar", value: `Rp ${(paid / 1e6).toFixed(1)}M`, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Menunggu", value: String(pendingCount), icon: Clock, color: "text-primary" },
    { label: "Terlambat", value: String(overdueCount), icon: AlertTriangle, color: overdueCount > 0 ? "text-destructive" : "text-muted-foreground" },
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
                  <Receipt className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dashboard &gt; Invoice</p>
                  <h1 className="text-2xl font-bold tracking-tight">Invoice</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Daftar tagihan dan status pembayaran Anda</p>
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

        {/* Overdue Alert */}
        {overdueCount > 0 && (
          <RevealCard delay={120}>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive font-medium">
                {overdueCount} invoice telah melewati tenggat pembayaran. Segera lakukan pembayaran untuk menghindari keterlambatan.
              </p>
            </div>
          </RevealCard>
        )}

        {/* Invoice Table */}
        <RevealCard delay={150}>
          <DataTable
            columns={[
              { key: "number", header: "No. Invoice", render: (i: any) => <span className="font-mono text-xs text-primary font-medium">{i.invoice_number}</span> },
              { key: "project", header: "Proyek", render: (i: any) => <span className="text-sm">{i.projects?.name ?? "—"}</span> },
              {
                key: "amount", header: "Jumlah", className: "text-right", render: (i: any) => (
                  <span className="font-mono text-xs font-semibold">Rp {Number(i.amount).toLocaleString("id-ID")}</span>
                )
              },
              { key: "status", header: "Status", render: (i: any) => <StatusBadge status={i.status} variant={statusMap[i.status] ?? "neutral"} /> },
              {
                key: "due", header: "Tenggat", sortable: true, sortValue: (i: any) => i.due_date ?? "", render: (i: any) => {
                  const overdueDays = i.due_date && i.status === "Overdue" ? differenceInDays(new Date(), parseISO(i.due_date)) : 0;
                  return (
                    <div>
                      <span className="text-xs text-muted-foreground">
                        {i.due_date ? new Date(i.due_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </span>
                      {overdueDays > 0 && <span className="ml-2 text-[10px] text-destructive font-medium">{overdueDays}h terlambat</span>}
                    </div>
                  );
                }
              },
              {
                key: "payment", header: "Dibayar", render: (i: any) => (
                  <span className="text-xs text-muted-foreground">
                    {i.paid_at ? new Date(i.paid_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                )
              },
            ]}
            data={sortedInvoices}
            isLoading={isLoading}
            emptyMessage="Belum ada invoice."
            searchField={(i: any) => `${i.invoice_number} ${i.projects?.name}`}
            searchPlaceholder="Cari invoice..."
            rowClassName={(i: any) => i.status === "Overdue" ? "border-l-4 border-l-destructive" : ""}
          />
        </RevealCard>
      </div>
    </ClientLayout>
  );
}
