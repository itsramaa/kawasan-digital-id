import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Search, Plus, Filter, MoreHorizontal, Building2, Mail, Phone } from "lucide-react";

const inquiries = [
  { id: "INQ-001", client: "PT Maju Jaya", title: "Company Website Redesign", budget: "Rp 75,000,000", status: "New", statusVariant: "info" as const, date: "2026-02-18" },
  { id: "INQ-002", client: "CV Digital Nusantara", title: "E-Commerce Platform", budget: "Rp 150,000,000", status: "Qualified", statusVariant: "warning" as const, date: "2026-02-17" },
  { id: "INQ-003", client: "PT Sentosa Group", title: "Mobile App Landing Page", budget: "Rp 35,000,000", status: "Proposal Sent", statusVariant: "hold" as const, date: "2026-02-15" },
  { id: "INQ-004", client: "CV Mandiri Tech", title: "SaaS Dashboard", budget: "Rp 200,000,000", status: "Qualified", statusVariant: "warning" as const, date: "2026-02-14" },
  { id: "INQ-005", client: "PT Abadi Sejahtera", title: "Corporate Portal", budget: "Rp 120,000,000", status: "Contract Pending", statusVariant: "success" as const, date: "2026-02-12" },
  { id: "INQ-006", client: "CV Kreatif Media", title: "Blog & Portfolio", budget: "Rp 25,000,000", status: "New", statusVariant: "info" as const, date: "2026-02-11" },
  { id: "INQ-007", client: "PT Indo Digital", title: "Booking System", budget: "Rp 90,000,000", status: "Rejected", statusVariant: "neutral" as const, date: "2026-02-10" },
];

export default function Sales() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sales Pipeline</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage inquiries, quotations, and contracts</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            New Inquiry
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search inquiries..."
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total", count: 18, color: "bg-foreground/10" },
            { label: "New", count: 8, color: "bg-status-info/10" },
            { label: "Qualified", count: 5, color: "bg-status-warning/10" },
            { label: "Proposal", count: 3, color: "bg-status-hold/10" },
            { label: "Won", count: 2, color: "bg-status-success/10" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-lg px-4 py-3 ${stat.color}`}>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              <p className="text-xl font-bold mt-0.5">{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Budget</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-mono text-xs text-primary font-medium">{inq.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="font-medium">{inq.client}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{inq.title}</td>
                    <td className="px-4 py-3 font-mono text-xs">{inq.budget}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inq.status} variant={inq.statusVariant} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{inq.date}</td>
                    <td className="px-4 py-3">
                      <button className="p-1 hover:bg-muted rounded">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
