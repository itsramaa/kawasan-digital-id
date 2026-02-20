import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { useAuth } from "@/features/auth/AuthContext";
import { StatusBadge, KPICard } from "@/shared/components/common/StatusBadge";
import {
  TrendingUp, FolderKanban, Receipt, HeadphonesIcon,
  DollarSign, Clock, AlertTriangle,
  ListTodo, Globe
} from "lucide-react";
import { Navigate } from "react-router-dom";

import { useProjectStats } from "@/features/projects/hooks/useProjectStats";
import { useSupportStats } from "@/features/support/hooks/useSupportStats";
import { useFinanceStats } from "@/features/finance/hooks/useFinanceStats";
import { useSalesStats } from "@/features/sales/hooks/useSalesStats";
import { useInfrastructureStats } from "@/features/infrastructure/hooks/useInfrastructureStats";

export default function Dashboard() {
  const { profile, roles, isClient, isInternal } = useAuth();

  // Redirect clients to their portal
  if (isClient && !isInternal) {
    return <Navigate to="/client" replace />;
  }

  const { projectCount, recentTasks } = useProjectStats();
  const { openTickets, recentTickets } = useSupportStats();
  const { outstanding, overdue, collected } = useFinanceStats();
  const { recentInquiries, pipelineSummary } = useSalesStats();
  const { domains } = useInfrastructureStats();

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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {profile?.full_name ? `Welcome, ${profile.full_name}` : "Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {roles.length > 0 && <span className="capitalize">{primaryRole.replace(/_/g, " ")}</span>}
            {" · "}
            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* KPI Cards - role-aware */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {(isAdmin || showProjects) && <KPICard title="Active Projects" value={String(projectCount ?? 0)} icon={FolderKanban} />}
          {(isAdmin || showFinance) && (
            <KPICard
              title="Outstanding Invoices"
              value={`Rp ${(outstanding / 1e6).toFixed(0)}M`}
              change={`${overdue.length} overdue`}
              changeType={overdue.length > 0 ? "negative" : "neutral"}
              icon={Receipt}
            />
          )}
          {(isAdmin || showSupport) && <KPICard title="Open Tickets" value={String(openTickets ?? 0)} icon={HeadphonesIcon} />}
          {(isAdmin || showFinance) && <KPICard title="Revenue Collected" value={`Rp ${(collected / 1e6).toFixed(0)}M`} icon={DollarSign} />}
          {(isAdmin || showSales) && !showFinance && <KPICard title="Pipeline Value" value={`${recentInquiries?.length ?? 0} leads`} icon={TrendingUp} />}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Sales Pipeline - Sales/Admin */}
          {(isAdmin || showSales) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Sales Pipeline
              </h2>
              <div className="space-y-3">
                {pipelineSummary.map((s) => (
                  <div key={s.stage} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.stage}</span>
                    <StatusBadge status={String(s.count)} variant={s.color} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overdue Invoices - Finance/Admin */}
          {(isAdmin || showFinance) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-status-error" /> Overdue Invoices
              </h2>
              {overdue.length === 0 ? (
                <p className="text-sm text-muted-foreground">No overdue invoices 🎉</p>
              ) : (
                <div className="space-y-3">
                  {overdue.slice(0, 5).map((inv, i) => (
                    <div key={i} className="border-l-2 border-status-error pl-3 py-1">
                      <p className="text-sm font-medium">Rp {Number(inv.amount).toLocaleString("id-ID")}</p>
                      <p className="text-xs text-status-error">Due: {inv.due_date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Tasks - PM/Developer/Admin */}
          {(isAdmin || showProjects) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-primary" /> Active Tasks
              </h2>
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

          {/* Support Tickets - Support/Admin */}
          {(isAdmin || showSupport) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <HeadphonesIcon className="w-4 h-4 text-primary" /> Open Tickets
              </h2>
              {!recentTickets?.length ? (
                <p className="text-sm text-muted-foreground">No open tickets</p>
              ) : (
                <div className="space-y-2">
                  {recentTickets.map((t: any) => (
                    <div key={t.id} className={`py-2 px-3 rounded-md ${t.status === "Escalated" ? "bg-status-error/5 border border-status-error/20" : "bg-muted/30"}`}>
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

          {/* Expiring Domains - Infra/Admin */}
          {(isAdmin || showInfra) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-status-warning" /> Domain Alerts
              </h2>
              {!domains?.length ? (
                <p className="text-sm text-muted-foreground">All domains are healthy ✓</p>
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

          {/* Recent Inquiries - Sales/Admin */}
          {(isAdmin || showSales) && (
            <div className="bg-card rounded-lg border border-border p-5">
              <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Recent Inquiries
              </h2>
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
