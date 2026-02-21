import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { useAuth } from "@/features/auth/AuthContext";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { AlertBanner } from "@/features/client/components/AlertBanner";
import { ActivityTimeline } from "@/features/client/components/ActivityTimeline";
import { ActivityLogList } from "@/features/client/components/ActivityLogList";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { HeroBanner } from "@/shared/components/common/HeroBanner";
import { StatCards } from "@/shared/components/common/StatCards";
import { FolderKanban, Receipt, HeadphonesIcon, ArrowUpRight, CheckCircle, AlertTriangle, Clock, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useClientProjects } from "@/features/client/hooks/useClientProjects";
import { useClientInvoices } from "@/features/client/hooks/useClientInvoices";
import { useClientTickets } from "@/features/client/hooks/useClientTickets";
import { useClientContracts } from "@/features/client/hooks/useClientContracts";
import { useClientDomains } from "@/features/client/hooks/useClientDomains";
import { useClientActivity } from "@/features/client/hooks/useClientActivity";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { differenceInDays, parseISO } from "date-fns";
import { lazy, Suspense, useState } from "react";
import { cn } from "@/shared/utils/utils";
import { Card, CardContent } from "@/shared/components/ui/card";

const statusVariant: Record<string, "info" | "warning" | "hold" | "success" | "neutral"> = {
  Planning: "warning", "In Progress": "info", "On Hold": "hold", Completed: "success", Cancelled: "neutral",
};

const PIE_COLORS = ["hsl(160, 60%, 45%)", "hsl(216, 51%, 48%)", "hsl(0, 84%, 60%)", "hsl(220, 9%, 46%)"];

export default function ClientDashboard() {
  const { profile } = useAuth();
  const [activityTab, setActivityTab] = useState<"recent" | "log">("recent");
  const { data: projects } = useClientProjects();
  const { data: invoices } = useClientInvoices();
  const { data: tickets } = useClientTickets();
  const { data: contracts } = useClientContracts();
  const { data: domains } = useClientDomains();
  const { data: activity } = useClientActivity();

  const activeProjects = projects?.filter(p => ["Planning", "In Progress"].includes(p.status)).length ?? 0;
  const outstandingAmt = invoices?.filter(i => ["Sent", "Viewed", "Overdue"].includes(i.status)).reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const paidAmt = invoices?.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const openTickets = tickets?.filter(t => ["Open", "In Progress"].includes(t.status)).length ?? 0;
  const overdueInv = invoices?.filter(i => i.status === "Overdue").length ?? 0;

  const expiringContracts = contracts?.filter(c => c.end_date && c.status === "Active" && differenceInDays(parseISO(c.end_date), new Date()) <= 60) ?? [];
  const expiringDomains = domains?.filter(d => d.status === "Active" && differenceInDays(parseISO(d.expiry_date), new Date()) <= 30) ?? [];
  const pendingMilestones = projects?.flatMap(p => (p.milestones ?? []).filter(m => m.status === "Submitted").map(m => ({ ...m, projectName: p.name }))) ?? [];

  const invoicePie = [
    { name: "Lunas", value: paidAmt },
    { name: "Belum Lunas", value: outstandingAmt },
  ].filter(d => d.value > 0);

  const stats = [
    { label: "Proyek Aktif", value: String(activeProjects), icon: FolderKanban, color: "text-primary" },
    { label: "Belum Dibayar", value: `Rp ${(outstandingAmt / 1e6).toFixed(0)}M`, icon: Receipt, color: "text-primary" },
    { label: "Tiket Terbuka", value: String(openTickets), icon: HeadphonesIcon, color: "text-primary" },
    { label: "Invoice Terlambat", value: String(overdueInv), icon: AlertTriangle, color: overdueInv > 0 ? "text-destructive" : "text-muted-foreground" },
  ];

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Hero Banner */}
        <HeroBanner
          icon={LayoutDashboard}
          title={profile?.full_name ? `Halo, ${profile.full_name}` : "Dashboard Saya"}
          subtitle="Ringkasan proyek dan akun Anda"
          breadcrumb="Dasbor"
        />

        {/* Alerts */}
        <RevealCard delay={80}>
          <div className="space-y-3">
            {overdueInv > 0 && <AlertBanner variant="critical" title={`${overdueInv} invoice terlambat`} description="Segera tinjau dan selesaikan invoice yang belum dibayar." />}
            {expiringContracts.length > 0 && <AlertBanner variant="warning" title={`${expiringContracts.length} kontrak akan berakhir dalam 60 hari`} description={expiringContracts.map(c => c.title).join(", ")} />}
            {expiringDomains.length > 0 && <AlertBanner variant="warning" title={`${expiringDomains.length} domain akan kadaluarsa dalam 30 hari`} description={expiringDomains.map(d => d.domain_name).join(", ")} />}
          </div>
        </RevealCard>

        {/* Stat Cards */}
        <StatCards stats={stats} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Action Items + Projects */}
          <div className="xl:col-span-2 space-y-6">
            {/* Action Items */}
            {(pendingMilestones.length > 0 || overdueInv > 0) && (
              <RevealCard delay={130}>
                <Card>
                  <CardContent className="p-5">
                    <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" /> Item Tindakan
                    </h2>
                    <div className="space-y-2">
                      {pendingMilestones.map(m => (
                        <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-yellow-500/5 border border-yellow-500/20">
                          <div>
                            <p className="text-sm">Milestone menunggu persetujuan: <strong>{m.title}</strong></p>
                            <p className="text-xs text-muted-foreground">{m.projectName}</p>
                          </div>
                          <StatusBadge status="Menunggu" variant="warning" className="text-[10px]" />
                        </div>
                      ))}
                      {invoices?.filter(i => i.status === "Overdue").map(i => (
                        <div key={i.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-destructive/5 border border-destructive/20">
                          <div>
                            <p className="text-sm">Terlambat: <strong>{i.invoice_number}</strong> — Rp {Number(i.amount).toLocaleString("id-ID")}</p>
                            <p className="text-xs text-muted-foreground">Tenggat: {i.due_date ? new Date(i.due_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}</p>
                          </div>
                          <StatusBadge status="Terlambat" variant="error" className="text-[10px]" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </RevealCard>
            )}

            {/* Projects */}
            <RevealCard delay={160}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2"><FolderKanban className="w-4 h-4 text-primary" /> Proyek Saya</h2>
                  <Link to="/dashboard/projects" className="text-xs text-primary hover:underline flex items-center gap-1">Lihat Semua <ArrowUpRight className="w-3 h-3" /></Link>
                </div>
                {!projects?.length ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-sm text-muted-foreground">Belum ada proyek yang ditetapkan.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.slice(0, 4).map((p) => (
                      <Card key={p.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-medium">{p.name}</h3>
                            <StatusBadge status={p.status} variant={statusVariant[p.status] ?? "neutral"} />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Progres</span>
                              <span className="font-mono font-medium">{p.progress}%</span>
                            </div>
                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${p.progress}%` }} />
                            </div>
                          </div>
                          {p.milestones?.length > 0 && (
                            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                              <CheckCircle className="w-3 h-3" />
                              {p.milestones.filter((m: any) => m.status === "Approved").length}/{p.milestones.length} milestone selesai
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </RevealCard>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Pie Chart */}
            {invoicePie.length > 0 && (
              <RevealCard delay={140}>
                <Card>
                  <CardContent className="p-5">
                    <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Receipt className="w-4 h-4 text-primary" /> Ringkasan Pembayaran</h2>
                    {/* Screen reader summary */}
                    <p className="sr-only">
                      Pembayaran lunas: Rp {(paidAmt / 1e6).toFixed(1)}M. Belum lunas: Rp {(outstandingAmt / 1e6).toFixed(1)}M.
                    </p>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={invoicePie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                          {invoicePie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                        </Pie>
                        <Tooltip formatter={(val: number) => `Rp ${(val / 1e6).toFixed(1)}M`} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-2">
                      {invoicePie.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-1.5 text-xs">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                          {d.name}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </RevealCard>
            )}

            {/* Activity */}
            <RevealCard delay={180}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-sm font-semibold">Aktivitas</h2>
                    <div className="flex gap-1 ml-auto" role="tablist" aria-label="Tab aktivitas">
                      {(["recent", "log"] as const).map((tab) => (
                        <button
                          key={tab}
                          role="tab"
                          aria-selected={activityTab === tab}
                          onClick={() => setActivityTab(tab)}
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-medium transition-colors",
                            activityTab === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {tab === "recent" ? "Terbaru" : "Semua Log"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {activityTab === "recent" ? (
                    <ActivityTimeline items={activity ?? []} />
                  ) : (
                    <ActivityLogList />
                  )}
                </CardContent>
              </Card>
            </RevealCard>

            {/* Recent Invoices */}
            <RevealCard delay={200}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold">Invoice Terbaru</h2>
                    <Link to="/dashboard/invoices" className="text-xs text-primary hover:underline flex items-center gap-1">Semua <ArrowUpRight className="w-3 h-3" /></Link>
                  </div>
                  {!invoices?.length ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Belum ada invoice.</p>
                  ) : (
                    <div className="space-y-2">
                      {invoices.slice(0, 4).map(inv => (
                        <div key={inv.id} className="flex items-center justify-between py-2">
                          <div>
                            <p className="font-mono text-xs">{inv.invoice_number}</p>
                            <p className="text-xs text-muted-foreground">
                              {inv.due_date ? new Date(inv.due_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-xs font-medium">Rp {Number(inv.amount).toLocaleString("id-ID")}</p>
                            <StatusBadge status={inv.status} variant={inv.status === "Paid" ? "success" : inv.status === "Overdue" ? "error" : "info"} className="text-[9px] px-1.5 py-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </RevealCard>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
