import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { PageHeader } from "@/shared/components/common/PageHeader";
import { useAuth } from "@/features/auth/AuthContext";
import { StatusBadge, KPICard } from "@/shared/components/common/StatusBadge";
import {
  TrendingUp, FolderKanban, Receipt, HeadphonesIcon,
  DollarSign, Clock, AlertTriangle,
  ListTodo, Globe, Users, ArrowUpRight
} from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from "recharts";

import { useProjectStats } from "@/features/projects/hooks/useProjectStats";
import { useSupportStats } from "@/features/support/hooks/useSupportStats";
import { useFinanceStats } from "@/features/finance/hooks/useFinanceStats";
import { useSalesStats } from "@/features/sales/hooks/useSalesStats";
import { useInfrastructureStats } from "@/features/infrastructure/hooks/useInfrastructureStats";
import { useDashboardRevenueTrend } from "@/features/finance/hooks/useDashboardRevenueTrend";

const CHART_COLORS = ["hsl(160, 60%, 45%)", "hsl(216, 51%, 48%)", "hsl(0, 84%, 60%)", "hsl(38, 92%, 50%)", "hsl(263, 70%, 58%)", "hsl(189, 100%, 50%)"];

export default function Dashboard() {
  const { profile, roles, isClient, isInternal } = useAuth();

  if (isClient && !isInternal) {
    return <Navigate to="/client" replace />;
  }

  const { projectCount, recentTasks } = useProjectStats();
  const { openTickets, recentTickets } = useSupportStats();
  const { outstanding, overdue, collected, invoices: finInvoices } = useFinanceStats();
  const { recentInquiries, pipelineSummary } = useSalesStats();
  const { domains } = useInfrastructureStats();
  const { data: revenueTrend } = useDashboardRevenueTrend();

  const primaryRole = roles[0] ?? "super_admin";
  const showSales = ["super_admin", "sales"].includes(primaryRole);
  const showProjects = ["super_admin", "project_manager", "developer"].includes(primaryRole);
  const showFinance = ["super_admin", "finance"].includes(primaryRole);
  const showSupport = ["super_admin", "support"].includes(primaryRole);
  const showInfra = ["super_admin", "infra"].includes(primaryRole);
  const isAdmin = primaryRole === "super_admin";

  const taskPriorityVariant: Record<string, "error" | "warning" | "neutral"> = {
    Critical: "error", High: "warning", Medium: "warning", Low: "neutral",
  };
  const taskStatusVariant: Record<string, "info" | "warning" | "neutral" | "success"> = {
    "To Do": "neutral", "In Progress": "info", Review: "warning", Done: "success",
  };

  // Pipeline pie data
  const pipelineChartData = pipelineSummary.map((s) => ({ name: s.stage, value: s.count }));

  // Invoice status distribution for pie chart
  const invoiceStatusData = [
    { name: "Paid", value: finInvoices?.filter(i => i.status === "Paid").length ?? 0 },
    { name: "Outstanding", value: finInvoices?.filter(i => ["Sent", "Viewed"].includes(i.status)).length ?? 0 },
    { name: "Overdue", value: finInvoices?.filter(i => i.status === "Overdue").length ?? 0 },
    { name: "Draft", value: finInvoices?.filter(i => i.status === "Draft").length ?? 0 },
  ].filter(d => d.value > 0);

  const totalBilled = finInvoices?.reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const collectionRate = totalBilled > 0 ? Math.round((collected / totalBilled) * 100) : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title={profile?.full_name ? `Welcome, ${profile.full_name}` : "Dashboard"}
          subtitle={`${roles.length > 0 ? primaryRole.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "User"} · ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {(isAdmin || showProjects) && <KPICard title="Active Projects" value={String(projectCount ?? 0)} icon={FolderKanban} />}
          {(isAdmin || showFinance) && (
            <KPICard
              title="Outstanding"
              value={`Rp ${(outstanding / 1e6).toFixed(0)}M`}
              change={`${overdue.length} overdue`}
              changeType={overdue.length > 0 ? "negative" : "neutral"}
              icon={Receipt}
            />
          )}
          {(isAdmin || showSupport) && <KPICard title="Open Tickets" value={String(openTickets ?? 0)} icon={HeadphonesIcon} />}
          {(isAdmin || showFinance) && (
            <KPICard
              title="Collection Rate"
              value={`${collectionRate}%`}
              change={`Rp ${(collected / 1e6).toFixed(0)}M collected`}
              changeType={collectionRate >= 70 ? "positive" : "negative"}
              icon={DollarSign}
            />
          )}
          {(isAdmin || showSales) && !showFinance && <KPICard title="Pipeline" value={`${recentInquiries?.length ?? 0} leads`} icon={TrendingUp} />}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Revenue Trend Area Chart */}
          {(isAdmin || showFinance) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" /> Monthly Revenue (Rp M)
                </h2>
                <Link to="/finance" className="text-xs text-primary hover:underline flex items-center gap-1">View All <ArrowUpRight className="w-3 h-3" /></Link>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueTrend ?? []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="collected" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Collected" />
                  <Area type="monotone" dataKey="billed" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth={1} strokeDasharray="5 5" name="Billed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Sales Pipeline or Invoice Pie */}
          {(isAdmin || showSales) && pipelineChartData.length > 0 ? (
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Sales Pipeline
                </h2>
                <Link to="/sales" className="text-xs text-primary hover:underline flex items-center gap-1">View All <ArrowUpRight className="w-3 h-3" /></Link>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={pipelineChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (isAdmin || showFinance) && invoiceStatusData.length > 0 ? (
            <div className="bg-card rounded-lg border border-border p-5">
              <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" /> Invoice Distribution
              </h2>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={invoiceStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {invoiceStatusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {invoiceStatusData.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span className="text-sm">{d.name}</span>
                      </div>
                      <span className="text-sm font-mono font-medium">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Overdue Invoices */}
          {(isAdmin || showFinance) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" /> Overdue Invoices
              </h2>
              {overdue.length === 0 ? (
                <p className="text-sm text-muted-foreground">No overdue invoices 🎉</p>
              ) : (
                <div className="space-y-3">
                  {overdue.slice(0, 5).map((inv, i) => (
                    <div key={i} className="border-l-2 border-destructive pl-3 py-1">
                      <p className="text-sm font-medium">Rp {Number(inv.amount).toLocaleString("id-ID")}</p>
                      <p className="text-xs text-destructive">Due: {inv.due_date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Tasks */}
          {(isAdmin || showProjects) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-primary" /> Active Tasks
                </h2>
                <Link to="/projects/tasks" className="text-xs text-primary hover:underline flex items-center gap-1">Board <ArrowUpRight className="w-3 h-3" /></Link>
              </div>
              {!recentTasks?.length ? (
                <p className="text-sm text-muted-foreground">No active tasks</p>
              ) : (
                <div className="space-y-2">
                  {recentTasks.map((task: any) => (
                    <div key={task.id} className="flex items-start gap-2 py-1.5">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-snug truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">{task.projects?.name}</span>
                          <StatusBadge status={task.status} variant={taskStatusVariant[task.status] ?? "neutral"} className="text-[9px] px-1.5 py-0" />
                        </div>
                      </div>
                      <StatusBadge status={task.priority} variant={taskPriorityVariant[task.priority] ?? "neutral"} className="text-[9px] px-1.5 py-0 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Support Tickets */}
          {(isAdmin || showSupport) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <HeadphonesIcon className="w-4 h-4 text-primary" /> Open Tickets
                </h2>
                <Link to="/support" className="text-xs text-primary hover:underline flex items-center gap-1">View All <ArrowUpRight className="w-3 h-3" /></Link>
              </div>
              {!recentTickets?.length ? (
                <p className="text-sm text-muted-foreground">No open tickets</p>
              ) : (
                <div className="space-y-2">
                  {recentTickets.map((t: any) => (
                    <div key={t.id} className={`py-2 px-3 rounded-md ${t.status === "Escalated" ? "bg-destructive/5 border border-destructive/20" : "bg-muted/30"}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-primary">{t.ticket_number}</span>
                        <StatusBadge status={t.priority} variant={taskPriorityVariant[t.priority] ?? "neutral"} className="text-[9px] px-1.5 py-0" />
                      </div>
                      <p className="text-sm mt-0.5 truncate">{t.subject}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{t.clients?.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Expiring Domains */}
          {(isAdmin || showInfra) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" /> Domain Alerts
              </h2>
              {!domains?.length ? (
                <p className="text-sm text-muted-foreground">All domains healthy ✓</p>
              ) : (
                <div className="space-y-2">
                  {domains.map((d: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <div>
                        <p className="text-sm font-mono">{d.domain_name}</p>
                        <p className="text-[10px] text-muted-foreground">{d.clients?.name}</p>
                      </div>
                      <StatusBadge status={d.status} variant={d.status === "Expired" ? "error" : "warning"} className="text-[10px]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Inquiries */}
          {(isAdmin || showSales) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Recent Inquiries
                </h2>
                <Link to="/sales" className="text-xs text-primary hover:underline flex items-center gap-1">Pipeline <ArrowUpRight className="w-3 h-3" /></Link>
              </div>
              {(!recentInquiries || recentInquiries.length === 0) ? (
                <p className="text-sm text-muted-foreground">No inquiries yet</p>
              ) : (
                <div className="space-y-3">
                  {recentInquiries.map((inq: any) => (
                    <div key={inq.id} className="flex gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <div>
                        <p className="text-sm leading-snug">{inq.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{inq.clients?.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
