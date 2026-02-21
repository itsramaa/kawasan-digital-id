import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { DataTable } from "@/shared/components/common/DataTable";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { HeroBanner } from "@/shared/components/common/HeroBanner";
import { StatCards } from "@/shared/components/common/StatCards";
import { useClientContracts } from "@/features/client/hooks/useClientContracts";
import { FileText, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

const statusMap: Record<string, "info" | "success" | "warning" | "error" | "neutral"> = {
  Draft: "neutral", Signed: "info", Active: "success", Completed: "success", Suspended: "warning", Terminated: "error",
};

export default function ClientContracts() {
  const { data: contracts, isLoading } = useClientContracts();

  const active = contracts?.filter(c => c.status === "Active").length ?? 0;
  const totalValue = contracts?.filter(c => ["Active", "Signed"].includes(c.status)).reduce((s, c) => s + Number(c.total_value), 0) ?? 0;
  const expiringSoon = contracts?.filter(c => { if (!c.end_date || c.status !== "Active") return false; return differenceInDays(parseISO(c.end_date), new Date()) <= 60; }).length ?? 0;
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
        <HeroBanner icon={FileText} title="Kontrak" subtitle="Perjanjian kerja sama dan status kontrak Anda" breadcrumb="Dasbor > Kontrak" />
        <StatCards stats={stats} />

        {expiringSoon > 0 && (
          <RevealCard delay={120}>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5" role="alert">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive font-medium">{expiringSoon} kontrak akan berakhir dalam 60 hari. Hubungi tim kami untuk perpanjangan.</p>
            </div>
          </RevealCard>
        )}

        <RevealCard delay={150}>
          <DataTable
            columns={[
              { key: "title", header: "Kontrak", render: (c: any) => <span className="font-medium">{c.title}</span> },
              { key: "status", header: "Status", render: (c: any) => <StatusBadge status={c.status} variant={statusMap[c.status] ?? "neutral"} /> },
              { key: "start", header: "Mulai", render: (c: any) => <span className="text-xs text-muted-foreground">{c.start_date ? new Date(c.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span> },
              {
                key: "end", header: "Berakhir", sortable: true, sortValue: (c: any) => c.end_date ?? "", render: (c: any) => {
                  const daysLeft = c.end_date ? differenceInDays(parseISO(c.end_date), new Date()) : null;
                  return (
                    <div>
                      <span className="text-xs text-muted-foreground">{c.end_date ? new Date(c.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                      {daysLeft !== null && daysLeft <= 60 && daysLeft > 0 && c.status === "Active" && <span className="ml-2 text-[10px] text-destructive font-medium">{daysLeft}h tersisa</span>}
                    </div>
                  );
                }
              },
              { key: "value", header: "Nilai", className: "text-right", render: (c: any) => <span className="font-mono text-xs font-semibold">Rp {Number(c.total_value).toLocaleString("id-ID")}</span> },
            ]}
            data={contracts ?? []}
            isLoading={isLoading}
            emptyMessage="Belum ada kontrak."
            searchField={(c: any) => c.title}
            searchPlaceholder="Cari kontrak..."
            rowClassName={(c: any) => { if (!c.end_date || c.status !== "Active") return ""; return differenceInDays(parseISO(c.end_date), new Date()) <= 30 ? "border-l-4 border-l-destructive" : ""; }}
          />
        </RevealCard>
      </div>
    </ClientLayout>
  );
}
