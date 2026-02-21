import { useState, useMemo } from "react";
import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { DataTable } from "@/shared/components/common/DataTable";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { HeroBanner } from "@/shared/components/common/HeroBanner";
import { StatCards } from "@/shared/components/common/StatCards";
import { StatSkeleton } from "@/shared/components/common/LoadingSkeleton";
import { useClientInvoices } from "@/features/client/hooks/useClientInvoices";
import { useClientPayments } from "@/features/client/hooks/useClientPayments";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Receipt, CheckCircle, AlertTriangle, Clock, CreditCard, Wallet, Printer, Download, BarChart3, Filter } from "lucide-react";
import { differenceInDays, parseISO, format, startOfMonth, subMonths } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/shared/utils/utils";

const statusMap: Record<string, "info" | "success" | "error" | "neutral"> = {
  Draft: "neutral", Sent: "info", Paid: "success", Overdue: "error", Void: "neutral",
};

const STATUS_OPTIONS = ["Semua", "Paid", "Sent", "Overdue", "Draft", "Void"];
const PERIOD_OPTIONS = [
  { label: "Semua Periode", value: "all" },
  { label: "3 Bulan Terakhir", value: "3" },
  { label: "6 Bulan Terakhir", value: "6" },
  { label: "12 Bulan Terakhir", value: "12" },
];

function formatCurrency(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function printInvoice(inv: any) {
  const w = window.open("", "_blank", "width=800,height=600");
  if (!w) return;
  w.document.write(`
    <html><head><title>Invoice ${inv.invoice_number}</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a1a; }
      h1 { font-size: 24px; margin-bottom: 4px; }
      .meta { color: #666; font-size: 14px; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e5e5e5; font-size: 14px; }
      th { background: #f5f5f5; font-weight: 600; }
      .total { font-size: 18px; font-weight: 700; text-align: right; margin-top: 20px; }
      .badge { display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
      .paid { background: #dcfce7; color: #166534; }
      .sent { background: #dbeafe; color: #1e40af; }
      .overdue { background: #fee2e2; color: #991b1b; }
      @media print { body { padding: 20px; } }
    </style></head><body>
    <h1>Invoice ${inv.invoice_number}</h1>
    <p class="meta">Proyek: ${inv.projects?.name ?? "—"}</p>
    <table>
      <tr><th>Status</th><td><span class="badge ${inv.status.toLowerCase()}">${inv.status}</span></td></tr>
      <tr><th>Jumlah</th><td>${formatCurrency(Number(inv.amount))}</td></tr>
      <tr><th>Tenggat</th><td>${inv.due_date ? new Date(inv.due_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}</td></tr>
      <tr><th>Dibayar</th><td>${inv.paid_at ? new Date(inv.paid_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}</td></tr>
    </table>
    <p class="total">Total: ${formatCurrency(Number(inv.amount))}</p>
    <script>window.print();</script>
    </body></html>
  `);
  w.document.close();
}

export default function ClientFinance() {
  const { data: invoices, isLoading: loadingInv } = useClientInvoices();
  const { data: payments, isLoading: loadingPay } = useClientPayments();
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("Semua");

  const isLoading = loadingInv || loadingPay;

  // Stats
  const outstanding = invoices?.filter(i => ["Sent", "Overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const paid = invoices?.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const overdueCount = invoices?.filter(i => i.status === "Overdue").length ?? 0;
  const totalPayments = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;

  const stats = [
    { label: "Belum Dibayar", value: `Rp ${(outstanding / 1e6).toFixed(1)}M`, icon: Receipt, color: "text-amber-500" },
    { label: "Sudah Dibayar", value: `Rp ${(paid / 1e6).toFixed(1)}M`, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Total Pembayaran", value: `Rp ${(totalPayments / 1e6).toFixed(1)}M`, icon: CreditCard, color: "text-primary" },
    { label: "Terlambat", value: String(overdueCount), icon: AlertTriangle, color: overdueCount > 0 ? "text-destructive" : "text-muted-foreground" },
  ];

  // Project list for filter
  const projectNames = useMemo(() => {
    const names = new Set<string>();
    invoices?.forEach(i => { if (i.projects?.name) names.add(i.projects.name); });
    return ["Semua", ...Array.from(names).sort()];
  }, [invoices]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    let list = [...(invoices ?? [])];
    if (statusFilter !== "Semua") list = list.filter(i => i.status === statusFilter);
    if (projectFilter !== "Semua") list = list.filter(i => i.projects?.name === projectFilter);
    if (periodFilter !== "all") {
      const cutoff = subMonths(new Date(), Number(periodFilter));
      list = list.filter(i => new Date(i.created_at) >= cutoff);
    }
    return list.sort((a, b) => {
      if (a.status === "Overdue" && b.status !== "Overdue") return -1;
      if (b.status === "Overdue" && a.status !== "Overdue") return 1;
      return (b.due_date ?? "").localeCompare(a.due_date ?? "");
    });
  }, [invoices, statusFilter, projectFilter, periodFilter]);

  // Chart data — monthly spending last 6 months
  const chartData = useMemo(() => {
    const months: { month: string; invoice: number; payment: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const start = startOfMonth(d);
      const label = format(start, "MMM yy", { locale: idLocale });
      const invTotal = invoices
        ?.filter(inv => {
          const dt = new Date(inv.created_at);
          return dt.getMonth() === start.getMonth() && dt.getFullYear() === start.getFullYear();
        })
        .reduce((s, inv) => s + Number(inv.amount), 0) ?? 0;
      const payTotal = payments
        ?.filter(p => {
          const dt = new Date(p.payment_date);
          return dt.getMonth() === start.getMonth() && dt.getFullYear() === start.getFullYear();
        })
        .reduce((s, p) => s + Number(p.amount), 0) ?? 0;
      months.push({ month: label, invoice: invTotal, payment: payTotal });
    }
    return months;
  }, [invoices, payments]);

  return (
    <ClientLayout>
      <div className="space-y-6">
        <HeroBanner icon={Wallet} title="Keuangan" subtitle="Kelola invoice, pembayaran, dan laporan keuangan Anda" breadcrumb="Dasbor > Keuangan" />

        {isLoading ? (
          <RevealCard delay={100}><StatSkeleton /></RevealCard>
        ) : (
          <StatCards stats={stats} />
        )}

        {!isLoading && overdueCount > 0 && (
          <RevealCard delay={120}>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5" role="alert">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive font-medium">
                {overdueCount} invoice telah melewati tenggat pembayaran. Segera lakukan pembayaran.
              </p>
            </div>
          </RevealCard>
        )}

        {/* Chart */}
        {!isLoading && (
          <RevealCard delay={130}>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Tren Keuangan (6 Bulan)</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                    />
                    <Legend />
                    <Bar dataKey="invoice" name="Invoice" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="payment" name="Pembayaran" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </RevealCard>
        )}

        {/* Tabs */}
        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="invoices" className="gap-1.5"><Receipt className="w-3.5 h-3.5" /> Invoice</TabsTrigger>
            <TabsTrigger value="payments" className="gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Pembayaran</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <RevealCard delay={150}>
              {/* Filters */}
              <div className="p-4 pb-0 flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s === "Semua" ? "Semua Status" : s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERIOD_OPTIONS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {projectNames.length > 2 && (
                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {projectNames.map(p => <SelectItem key={p} value={p}>{p === "Semua" ? "Semua Proyek" : p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <DataTable
                columns={[
                  { key: "number", header: "No. Invoice", render: (i: any) => <span className="font-mono text-xs text-primary font-medium">{i.invoice_number}</span> },
                  { key: "project", header: "Proyek", render: (i: any) => <span className="text-sm">{i.projects?.name ?? "—"}</span> },
                  { key: "amount", header: "Jumlah", className: "text-right", render: (i: any) => <span className="font-mono text-xs font-semibold">{formatCurrency(Number(i.amount))}</span> },
                  { key: "status", header: "Status", render: (i: any) => <StatusBadge status={i.status} variant={statusMap[i.status] ?? "neutral"} /> },
                  {
                    key: "due", header: "Tenggat", sortable: true, sortValue: (i: any) => i.due_date ?? "", render: (i: any) => {
                      const overdueDays = i.due_date && i.status === "Overdue" ? differenceInDays(new Date(), parseISO(i.due_date)) : 0;
                      return (
                        <div>
                          <span className="text-xs text-muted-foreground">{i.due_date ? new Date(i.due_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                          {overdueDays > 0 && <span className="ml-2 text-[10px] text-destructive font-medium">{overdueDays}h terlambat</span>}
                        </div>
                      );
                    }
                  },
                  {
                    key: "actions", header: "", render: (i: any) => (
                      <button
                        onClick={() => printInvoice(i)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Cetak Invoice"
                        aria-label={`Cetak invoice ${i.invoice_number}`}
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    )
                  },
                ]}
                data={filteredInvoices}
                isLoading={loadingInv}
                emptyMessage="Belum ada invoice."
                searchField={(i: any) => `${i.invoice_number} ${i.projects?.name}`}
                searchPlaceholder="Cari invoice..."
                rowClassName={(i: any) => i.status === "Overdue" ? "border-l-4 border-l-destructive" : ""}
              />
            </RevealCard>
          </TabsContent>

          <TabsContent value="payments">
            <RevealCard delay={150}>
              <DataTable
                columns={[
                  { key: "invoice", header: "No. Invoice", render: (p: any) => <span className="font-mono text-xs text-primary font-medium">{p.invoices?.invoice_number ?? "—"}</span> },
                  { key: "project", header: "Proyek", render: (p: any) => <span className="text-sm">{p.invoices?.projects?.name ?? "—"}</span> },
                  { key: "amount", header: "Jumlah", className: "text-right", render: (p: any) => <span className="font-mono text-xs font-semibold">{formatCurrency(Number(p.amount))}</span> },
                  { key: "date", header: "Tanggal", render: (p: any) => <span className="text-xs text-muted-foreground">{new Date(p.payment_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span> },
                  { key: "method", header: "Metode", render: (p: any) => p.payment_method ? <Badge variant="secondary" className="text-[10px]">{p.payment_method}</Badge> : <span className="text-xs text-muted-foreground">—</span> },
                  { key: "ref", header: "Referensi", hideMobile: true, render: (p: any) => <span className="font-mono text-xs text-muted-foreground">{p.reference_number ?? "—"}</span> },
                ]}
                data={payments ?? []}
                isLoading={loadingPay}
                emptyMessage="Belum ada pembayaran tercatat."
                searchField={(p: any) => `${p.invoices?.invoice_number} ${p.reference_number} ${p.invoices?.projects?.name}`}
                searchPlaceholder="Cari pembayaran..."
              />
            </RevealCard>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}
