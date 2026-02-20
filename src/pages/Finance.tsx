import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { KPICard } from "@/components/shared/StatusBadge";
import { Search, Plus, Filter, MoreHorizontal, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const invoices = [
  { id: "INV-2024-042", client: "PT Maju Jaya", project: "E-Commerce Revamp", amount: "Rp 45,000,000", status: "Sent", statusVariant: "info" as const, dueDate: "2026-03-05", issuedDate: "2026-02-18" },
  { id: "INV-2024-041", client: "CV Digital Nusantara", project: "Mobile Landing Page", amount: "Rp 17,500,000", status: "Paid", statusVariant: "success" as const, dueDate: "2026-02-20", issuedDate: "2026-02-06" },
  { id: "INV-2024-040", client: "PT Sentosa Group", project: "Corporate Portal", amount: "Rp 60,000,000", status: "Draft", statusVariant: "neutral" as const, dueDate: "-", issuedDate: "2026-02-15" },
  { id: "INV-2024-038", client: "PT Indo Digital", project: "Booking System", amount: "Rp 45,000,000", status: "Paid", statusVariant: "success" as const, dueDate: "2026-02-15", issuedDate: "2026-02-01" },
  { id: "INV-2024-035", client: "CV Mandiri Tech", project: "SaaS Dashboard", amount: "Rp 15,000,000", status: "Overdue", statusVariant: "error" as const, dueDate: "2026-02-10", issuedDate: "2026-01-25" },
  { id: "INV-2024-031", client: "PT Abadi Sejahtera", project: "Inventory System", amount: "Rp 28,500,000", status: "Overdue", statusVariant: "error" as const, dueDate: "2026-02-03", issuedDate: "2026-01-18" },
  { id: "INV-2024-030", client: "CV Kreatif Media", project: "Blog & Portfolio", amount: "Rp 12,500,000", status: "Paid", statusVariant: "success" as const, dueDate: "2026-01-30", issuedDate: "2026-01-15" },
];

export default function Finance() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
            <p className="text-sm text-muted-foreground mt-1">Invoices, payments, and financial tracking</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>

        {/* Finance KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard title="Total Billed (MTD)" value="Rp 223M" change="+18% vs last month" changeType="positive" icon={DollarSign} />
          <KPICard title="Collected" value="Rp 134M" change="60% collection rate" changeType="neutral" icon={CheckCircle} />
          <KPICard title="Outstanding" value="Rp 89M" change="7 unpaid invoices" changeType="negative" icon={TrendingUp} />
          <KPICard title="Overdue" value="Rp 43.5M" change="2 invoices overdue" changeType="negative" icon={AlertTriangle} />
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Invoice Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Invoice #</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                      inv.statusVariant === "error" ? "border-l-4 border-l-status-error" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-primary font-medium">{inv.id}</td>
                    <td className="px-4 py-3 font-medium">{inv.client}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.project}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-medium">{inv.amount}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.status} variant={inv.statusVariant} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{inv.dueDate}</td>
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
