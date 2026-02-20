import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { Search, Plus, Filter, MoreHorizontal, Building2 } from "lucide-react";
import { useInquiries } from "@/features/sales/hooks/useInquiries";

const statusVariantMap: Record<string, "info" | "warning" | "hold" | "success" | "neutral" | "error"> = {
  New: "info", Qualified: "warning", "Proposal Sent": "hold", "Contract Pending": "success", Won: "success", Lost: "neutral", Rejected: "error",
};

export default function Sales() {
  const { data: inquiries, isLoading } = useInquiries();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sales Pipeline</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage inquiries, quotations, and contracts</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> New Inquiry
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search inquiries..." className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Budget</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !inquiries?.length ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No inquiries yet. Create your first inquiry to get started.</td></tr>
                ) : (
                  inquiries.map((inq: any) => (
                    <tr key={inq.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="font-medium">{inq.clients?.name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{inq.title}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs">
                        {inq.budget_estimate ? `Rp ${Number(inq.budget_estimate).toLocaleString("id-ID")}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inq.status} variant={statusVariantMap[inq.status] ?? "neutral"} />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(inq.created_at).toLocaleDateString("id-ID")}</td>
                      <td className="px-4 py-3">
                        <button className="p-1 hover:bg-muted rounded"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
