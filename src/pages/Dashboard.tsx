import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/features/auth/AuthContext";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { KPICard } from "@/components/shared/StatusBadge";
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { profile, roles } = useAuth();

  const { data: projectCount } = useQuery({
    queryKey: ["projects-count"],
    queryFn: async () => {
      const { count } = await supabase.from("projects").select("*", { count: "exact", head: true }).in("status", ["Planning", "In Progress", "On Hold"]);
      return count ?? 0;
    },
  });

  const { data: openTickets } = useQuery({
    queryKey: ["tickets-count"],
    queryFn: async () => {
      const { count } = await supabase.from("support_tickets").select("*", { count: "exact", head: true }).in("status", ["Open", "In Progress", "Escalated"]);
      return count ?? 0;
    },
  });

  const { data: invoices } = useQuery({
    queryKey: ["invoices-dashboard"],
    queryFn: async () => {
      const { data } = await supabase.from("invoices").select("amount, status, due_date");
      return data ?? [];
    },
  });

  const { data: recentInquiries } = useQuery({
    queryKey: ["recent-inquiries"],
    queryFn: async () => {
      const { data } = await supabase.from("inquiries").select("id, title, status, created_at, clients(name)").order("created_at", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  const outstanding = invoices?.filter((i) => ["Sent", "Viewed", "Overdue"].includes(i.status)).reduce((sum, i) => sum + Number(i.amount), 0) ?? 0;
  const overdue = invoices?.filter((i) => i.status === "Overdue") ?? [];

  const pipelineSummary = [
    { stage: "New Inquiries", count: recentInquiries?.filter(i => i.status === "New").length ?? 0, color: "info" as const },
    { stage: "Qualified", count: recentInquiries?.filter(i => i.status === "Qualified").length ?? 0, color: "warning" as const },
    { stage: "Proposal Sent", count: recentInquiries?.filter(i => i.status === "Proposal Sent").length ?? 0, color: "hold" as const },
    { stage: "Won", count: recentInquiries?.filter(i => i.status === "Won").length ?? 0, color: "success" as const },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {profile?.full_name ? `Welcome, ${profile.full_name}` : "Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {roles.length > 0 && <span className="capitalize">{roles[0].replace("_", " ")}</span>}
            {" · "}
            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard title="Active Projects" value={String(projectCount ?? 0)} icon={FolderKanban} />
          <KPICard
            title="Outstanding Invoices"
            value={`Rp ${(outstanding / 1e6).toFixed(0)}M`}
            change={`${overdue.length} overdue`}
            changeType={overdue.length > 0 ? "negative" : "neutral"}
            icon={Receipt}
          />
          <KPICard title="Open Tickets" value={String(openTickets ?? 0)} icon={HeadphonesIcon} />
          <KPICard title="Revenue (MTD)" value="—" icon={DollarSign} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Pipeline */}
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

          {/* Overdue */}
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

          {/* Recent inquiries */}
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
        </div>
      </div>
    </AppLayout>
  );
}
