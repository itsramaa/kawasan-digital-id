import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Search, Plus, Filter, MoreHorizontal, Clock, AlertTriangle, User } from "lucide-react";

const tickets = [
  { id: "TK-089", subject: "Homepage loading slow after deployment", client: "PT Maju Jaya", priority: "Critical", priorityVariant: "error" as const, status: "Escalated", statusVariant: "error" as const, sla: "SLA Breached", assignee: "Andi", created: "2026-02-18 09:30" },
  { id: "TK-088", subject: "Contact form not sending emails", client: "CV Digital Nusantara", priority: "High", priorityVariant: "warning" as const, status: "In Progress", statusVariant: "info" as const, sla: "2h remaining", assignee: "Budi", created: "2026-02-18 11:00" },
  { id: "TK-087", subject: "SSL certificate renewal request", client: "PT Sentosa Group", priority: "Medium", priorityVariant: "warning" as const, status: "Open", statusVariant: "info" as const, sla: "5d remaining", assignee: "Unassigned", created: "2026-02-17 14:20" },
  { id: "TK-086", subject: "Update company logo on all pages", client: "CV Mandiri Tech", priority: "Low", priorityVariant: "neutral" as const, status: "Open", statusVariant: "info" as const, sla: "7d remaining", assignee: "Citra", created: "2026-02-17 10:15" },
  { id: "TK-085", subject: "Payment gateway integration issue", client: "PT Indo Digital", priority: "Critical", priorityVariant: "error" as const, status: "Resolved", statusVariant: "success" as const, sla: "Met", assignee: "Andi", created: "2026-02-16 08:45" },
  { id: "TK-084", subject: "Mobile responsive bug on product page", client: "PT Abadi Sejahtera", priority: "High", priorityVariant: "warning" as const, status: "Resolved", statusVariant: "success" as const, sla: "Met", assignee: "Budi", created: "2026-02-15 16:00" },
];

export default function Support() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage SLA tickets and client issues</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground font-medium">Open</p>
            <p className="text-2xl font-bold mt-1">4</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground font-medium">In Progress</p>
            <p className="text-2xl font-bold mt-1">1</p>
          </div>
          <div className="bg-status-error/5 rounded-lg border border-status-error/20 p-4">
            <p className="text-xs text-status-error font-medium">SLA Breached</p>
            <p className="text-2xl font-bold mt-1 text-status-error">1</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground font-medium">Resolved (MTD)</p>
            <p className="text-2xl font-bold mt-1">12</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Ticket List */}
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-card rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer ${
                ticket.sla === "SLA Breached" ? "border-l-4 border-l-status-error border-status-error/20" : "border-border"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-primary font-medium">{ticket.id}</span>
                    <StatusBadge status={ticket.priority} variant={ticket.priorityVariant} />
                    <StatusBadge status={ticket.status} variant={ticket.statusVariant} />
                  </div>
                  <h3 className="font-medium mt-1.5 text-card-foreground">{ticket.subject}</h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{ticket.client}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{ticket.assignee}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ticket.created}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    ticket.sla === "SLA Breached"
                      ? "bg-status-error/10 text-status-error"
                      : ticket.sla === "Met"
                      ? "bg-status-success/10 text-status-success"
                      : "bg-status-warning/10 text-status-warning"
                  }`}>
                    {ticket.sla === "SLA Breached" && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                    {ticket.sla}
                  </span>
                  <button className="p-1 hover:bg-muted rounded">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
