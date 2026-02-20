import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard, StatusBadge } from "@/components/shared/StatusBadge";
import {
  TrendingUp,
  FolderKanban,
  Receipt,
  HeadphonesIcon,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const recentActivities = [
  { action: "Invoice #INV-2024-042 sent to PT Maju Jaya", time: "12 min ago", type: "finance" },
  { action: "Project 'E-Commerce Revamp' milestone approved", time: "1 hour ago", type: "project" },
  { action: "New inquiry from CV Digital Nusantara", time: "2 hours ago", type: "sales" },
  { action: "Support ticket #TK-089 escalated (SLA breach)", time: "3 hours ago", type: "support" },
  { action: "Contract signed by PT Sentosa Group", time: "5 hours ago", type: "sales" },
  { action: "Payment Rp 45,000,000 received for INV-2024-038", time: "6 hours ago", type: "finance" },
];

const pipelineSummary = [
  { stage: "New Inquiries", count: 8, color: "info" as const },
  { stage: "Qualified", count: 5, color: "warning" as const },
  { stage: "Proposal Sent", count: 3, color: "hold" as const },
  { stage: "Contract Pending", count: 2, color: "success" as const },
];

const overdueItems = [
  { label: "INV-2024-031 — PT Abadi Sejahtera", days: 12, amount: "Rp 28,500,000" },
  { label: "INV-2024-035 — CV Mandiri Tech", days: 5, amount: "Rp 15,000,000" },
  { label: "Milestone 'Design Review' — Project Alpha", days: 3, amount: "" },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your agency operations · {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="Active Projects"
            value="14"
            change="+2 this month"
            changeType="positive"
            icon={FolderKanban}
          />
          <KPICard
            title="Revenue (MTD)"
            value="Rp 285M"
            change="+12% vs last month"
            changeType="positive"
            icon={DollarSign}
          />
          <KPICard
            title="Outstanding Invoices"
            value="Rp 89M"
            change="7 invoices pending"
            changeType="negative"
            icon={Receipt}
          />
          <KPICard
            title="Open Tickets"
            value="6"
            change="2 SLA at risk"
            changeType="negative"
            icon={HeadphonesIcon}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Pipeline Summary */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Sales Pipeline
            </h2>
            <div className="space-y-3">
              {pipelineSummary.map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={String(stage.count)} variant={stage.color} />
                  </div>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-1 text-xs text-primary font-medium mt-4 hover:underline">
              View full pipeline <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Overdue Items */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-status-error" />
              Overdue Items
            </h2>
            <div className="space-y-3">
              {overdueItems.map((item, i) => (
                <div key={i} className="border-l-2 border-status-error pl-3 py-1">
                  <p className="text-sm font-medium text-card-foreground">{item.label}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-status-error font-medium">{item.days} days overdue</span>
                    {item.amount && (
                      <span className="text-xs text-muted-foreground font-mono">{item.amount}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="text-sm text-card-foreground leading-snug">{activity.action}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Utilization Mini */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h2 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Team Utilization
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Andi (Dev)", util: 92 },
              { name: "Budi (Dev)", util: 78 },
              { name: "Citra (Design)", util: 85 },
              { name: "Diana (PM)", util: 65 },
            ].map((member) => (
              <div key={member.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{member.name}</span>
                  <span className="text-xs font-mono font-medium text-card-foreground">{member.util}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${member.util}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
