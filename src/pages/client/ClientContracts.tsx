import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { DataTable } from "@/shared/components/common/DataTable";
import { useClientContracts } from "@/features/client/hooks/useClientContracts";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { FileText, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { cn } from "@/shared/utils/utils";
import { Card, CardContent } from "@/shared/components/ui/card";

const statusMap: Record<string, "info" | "success" | "warning" | "error" | "neutral"> = {
  Draft: "neutral", Signed: "info", Active: "success", Completed: "success", Suspended: "warning", Terminated: "error",
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

export default function ClientContracts() {
  const { data: contracts, isLoading } = useClientContracts();

  const active = contracts?.filter(c => c.status === "Active").length ?? 0;
  const totalValue = contracts?.filter(c => ["Active", "Signed"].includes(c.status)).reduce((s, c) => s + Number(c.total_value), 0) ?? 0;
  const expiringSoon = contracts?.filter(c => {
    if (!c.end_date || c.status !== "Active") return false;
    return differenceInDays(parseISO(c.end_date), new Date()) <= 60;
  }).length ?? 0;
  const completed = contracts?.filter(c => c.status === "Completed").length ?? 0;

  if (isLoading) return <ClientLayout><div className="text-center py-12 text-muted-foreground">Memuat...</div></ClientLayout>;

  const stats = [
    { label: "Kontrak Aktif", value: String(active), icon: FileText, color: "text-primary" },
    { label: "Total Nilai", value: `Rp ${(totalValue / 1e6).toFixed(1)}M`, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Segera Berakhir", value: String(expiringSoon), icon: AlertTriangle, color: expiringSoon > 0 ? "text-destructive" : "text-muted-foreground" },
    { label: "Selesai", value: String(completed), icon: Clock, color: "text-primary" },
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
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dashboard &gt; Kontrak</p>
                  <h1 className="text-2xl font-bold tracking-tight">Kontrak</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Perjanjian kerja sama dan status kontrak Anda</p>
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

        {/* Expiring Alert */}
        {expiringSoon > 0 && (
          <RevealCard delay={120}>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive font-medium">
                {expiringSoon} kontrak akan berakhir dalam 60 hari. Hubungi tim kami untuk perpanjangan.
              </p>
            </div>
          </RevealCard>
        )}

        {/* Contracts Table */}
        <RevealCard delay={150}>
          <DataTable
            columns={[
              { key: "title", header: "Kontrak", render: (c: any) => <span className="font-medium">{c.title}</span> },
              { key: "status", header: "Status", render: (c: any) => <StatusBadge status={c.status} variant={statusMap[c.status] ?? "neutral"} /> },
              {
                key: "start", header: "Mulai", render: (c: any) => (
                  <span className="text-xs text-muted-foreground">
                    {c.start_date ? new Date(c.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                )
              },
              {
                key: "end", header: "Berakhir", sortable: true, sortValue: (c: any) => c.end_date ?? "", render: (c: any) => {
                  const daysLeft = c.end_date ? differenceInDays(parseISO(c.end_date), new Date()) : null;
                  return (
                    <div>
                      <span className="text-xs text-muted-foreground">
                        {c.end_date ? new Date(c.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </span>
                      {daysLeft !== null && daysLeft <= 60 && daysLeft > 0 && c.status === "Active" && (
                        <span className="ml-2 text-[10px] text-destructive font-medium">{daysLeft}h tersisa</span>
                      )}
                    </div>
                  );
                }
              },
              {
                key: "value", header: "Nilai", className: "text-right", render: (c: any) => (
                  <span className="font-mono text-xs font-semibold">Rp {Number(c.total_value).toLocaleString("id-ID")}</span>
                )
              },
            ]}
            data={contracts ?? []}
            isLoading={isLoading}
            emptyMessage="Belum ada kontrak."
            searchField={(c: any) => c.title}
            searchPlaceholder="Cari kontrak..."
            rowClassName={(c: any) => {
              if (!c.end_date || c.status !== "Active") return "";
              return differenceInDays(parseISO(c.end_date), new Date()) <= 30 ? "border-l-4 border-l-destructive" : "";
            }}
          />
        </RevealCard>
      </div>
    </ClientLayout>
  );
}
