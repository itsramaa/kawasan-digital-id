import { useState, useMemo } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { FormDialog } from "@/shared/components/common/FormDialog";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { EmptyState } from "@/features/client/components/EmptyState";
import { ValidatedInput, ValidatedTextarea, ValidatedSelect } from "@/shared/components/common/ValidatedInput";
import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { ticketSchema, type TicketFormValues } from "@/shared/lib/validations";
import { useClientTickets, useClientTicketMutation } from "@/features/client/hooks/useClientTickets";
import { useClientProjects } from "@/features/client/hooks/useClientProjects";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Clock, Plus, MessageSquare, AlertTriangle, CheckCircle, Search,
  Headphones, ChevronRight, Inbox, TicketCheck, AlertCircle, ArrowRight
} from "lucide-react";
import { differenceInMinutes, parseISO } from "date-fns";
import { cn } from "@/shared/utils/utils";

// --- Maps ---
const statusMap: Record<string, "info" | "success" | "error" | "neutral"> = {
  Open: "info", "In Progress": "info", Escalated: "error", Resolved: "success", Closed: "neutral",
};
const priorityMap: Record<string, "error" | "warning" | "neutral"> = {
  Critical: "error", High: "warning", Medium: "warning", Low: "neutral",
};

// --- SLA Indicator ---
function SlaIndicator({ deadline }: { deadline: string }) {
  const minutesLeft = differenceInMinutes(parseISO(deadline), new Date());
  const hoursLeft = Math.floor(minutesLeft / 60);
  const isBreached = minutesLeft <= 0;
  const isUrgent = minutesLeft > 0 && minutesLeft <= 120;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded",
      isBreached ? "bg-destructive/10 text-destructive" : isUrgent ? "bg-accent/20 text-accent-foreground animate-pulse" : "bg-muted text-muted-foreground"
    )}>
      <Clock className="w-3 h-3" />
      {isBreached ? "SLA Terlewat" : hoursLeft > 0 ? `${hoursLeft}j tersisa` : `${minutesLeft}m tersisa`}
    </span>
  );
}

// --- Status Timeline ---
const TIMELINE_STEPS = ["Open", "In Progress", "Resolved", "Closed"];
function StatusTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIdx = TIMELINE_STEPS.indexOf(currentStatus);
  const isEscalated = currentStatus === "Escalated";

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-medium">Alur Status</p>
      <div className="flex items-center gap-1">
        {TIMELINE_STEPS.map((step, i) => {
          const isActive = isEscalated ? false : i <= currentIdx;
          const isCurrent = !isEscalated && i === currentIdx;
          return (
            <div key={step} className="flex items-center gap-1 flex-1">
              <div className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full text-[9px] font-bold shrink-0 transition-colors",
                isCurrent ? "bg-primary text-primary-foreground" : isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div className={cn("h-0.5 flex-1 rounded-full", isActive && i < currentIdx ? "bg-primary/30" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground">
        {TIMELINE_STEPS.map(s => <span key={s}>{s === "In Progress" ? "Proses" : s === "Resolved" ? "Selesai" : s === "Closed" ? "Ditutup" : "Baru"}</span>)}
      </div>
      {isEscalated && (
        <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="font-medium">Tiket di-eskalasi</span>
        </div>
      )}
    </div>
  );
}

// --- Filter types ---
type FilterTab = "all" | "active" | "escalated" | "done";

export default function ClientSupport() {
  const { profile } = useAuth();
  const { data: tickets, isLoading } = useClientTickets();
  const { data: projects } = useClientProjects();
  const createTicket = useClientTicketMutation();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<TicketFormValues>({ subject: "", description: "", priority: "Medium" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = ticketSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => { fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    createTicket.mutate({ subject: result.data.subject!, description: result.data.description!, priority: result.data.priority! }, { onSuccess: () => setFormOpen(false) });
  };

  // Stats
  const activeCount = tickets?.filter(t => ["Open", "In Progress"].includes(t.status)).length ?? 0;
  const escalatedCount = tickets?.filter(t => t.status === "Escalated").length ?? 0;
  const resolvedCount = tickets?.filter(t => ["Resolved", "Closed"].includes(t.status)).length ?? 0;
  const totalCount = tickets?.length ?? 0;

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    let list = tickets;
    if (activeTab === "active") list = list.filter(t => ["Open", "In Progress"].includes(t.status));
    else if (activeTab === "escalated") list = list.filter(t => t.status === "Escalated");
    else if (activeTab === "done") list = list.filter(t => ["Resolved", "Closed"].includes(t.status));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.subject.toLowerCase().includes(q) || t.ticket_number.toLowerCase().includes(q));
    }
    return list;
  }, [tickets, activeTab, searchQuery]);

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: totalCount },
    { key: "active", label: "Aktif", count: activeCount },
    { key: "escalated", label: "Eskalasi", count: escalatedCount },
    { key: "done", label: "Selesai", count: resolvedCount },
  ];

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">Support</span>
        </div>

        {/* Hero Banner */}
        <RevealCard>
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border">
            <div className="px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Headphones className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Pusat Bantuan</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Kelola tiket dukungan dan pantau statusnya</p>
                </div>
              </div>
              <button
                onClick={() => { setForm({ subject: "", description: "", priority: "Medium" }); setErrors({}); setFormOpen(true); }}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
              >
                <Plus className="w-4 h-4" /> Tiket Baru
              </button>
            </div>
          </div>
        </RevealCard>

        {/* Stat Cards */}
        <RevealCard delay={100}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Tiket Aktif", count: activeCount, icon: TicketCheck, color: "text-primary", bg: "bg-primary/10" },
              { label: "Menunggu", count: totalCount - activeCount - escalatedCount - resolvedCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10" },
              { label: "Eskalasi", count: escalatedCount, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
              { label: "Terselesaikan", count: resolvedCount, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-500/10" },
            ].map(stat => (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.count}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RevealCard>

        {/* Search & Filters */}
        <RevealCard delay={150}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari tiket..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-1.5">
              {filterTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-3 py-2 rounded-md text-xs font-medium transition-colors",
                    activeTab === tab.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </RevealCard>

        {/* Main Content: List + Detail */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Ticket List */}
          <RevealCard delay={200} className="xl:col-span-2">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Memuat...</div>
            ) : !filteredTickets.length ? (
              <EmptyState
                icon={tickets?.length ? Search : Inbox}
                headline={tickets?.length ? "Tidak ada tiket ditemukan" : "Belum ada tiket"}
                description={tickets?.length ? "Coba ubah filter atau kata kunci pencarian." : "Buat tiket baru untuk mendapatkan bantuan dari tim kami."}
                action={!tickets?.length ? { label: "Buat Tiket Baru", onClick: () => setFormOpen(true) } : undefined}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">{filteredTickets.length} tiket ditampilkan</p>
                {filteredTickets.map((ticket: any) => (
                  <Card
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-all",
                      ticket.priority === "Critical" && "border-l-4 border-l-destructive",
                      ticket.priority === "High" && "border-l-4 border-l-amber-500",
                      ticket.status === "Escalated" && "border-l-4 border-l-destructive",
                      selectedTicket?.id === ticket.id && "border-primary/40 bg-primary/5"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-mono text-xs text-primary font-medium">{ticket.ticket_number}</span>
                        <StatusBadge status={ticket.priority} variant={priorityMap[ticket.priority] ?? "neutral"} className={ticket.priority === "Critical" ? "animate-pulse" : ""} />
                        <StatusBadge status={ticket.status} variant={statusMap[ticket.status] ?? "neutral"} />
                        {ticket.sla_deadline && !["Resolved", "Closed"].includes(ticket.status) && <SlaIndicator deadline={ticket.sla_deadline} />}
                      </div>
                      <h3 className="font-medium text-sm">{ticket.subject}</h3>
                      {ticket.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {ticket.projects?.name && <span>{ticket.projects.name}</span>}
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket.created_at).toLocaleDateString("id-ID")}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </RevealCard>

          {/* Detail Panel */}
          <RevealCard delay={250}>
            {selectedTicket ? (
              <Card className="sticky top-6">
                <CardHeader className="pb-3">
                  <p className="font-mono text-xs text-primary font-medium">{selectedTicket.ticket_number}</p>
                  <CardTitle className="text-base mt-1">{selectedTicket.subject}</CardTitle>
                  <div className="flex gap-2 flex-wrap mt-2">
                    <StatusBadge status={selectedTicket.status} variant={statusMap[selectedTicket.status] ?? "neutral"} />
                    <StatusBadge status={selectedTicket.priority} variant={priorityMap[selectedTicket.priority] ?? "neutral"} />
                    {selectedTicket.sla_deadline && !["Resolved", "Closed"].includes(selectedTicket.status) && <SlaIndicator deadline={selectedTicket.sla_deadline} />}
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Description */}
                  {selectedTicket.description && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Deskripsi</p>
                      <p className="text-sm">{selectedTicket.description}</p>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Dibuat</p>
                      <p className="font-medium">{new Date(selectedTicket.created_at).toLocaleDateString("id-ID")}</p>
                    </div>
                    {selectedTicket.resolved_at && (
                      <div>
                        <p className="text-muted-foreground">Diselesaikan</p>
                        <p className="font-medium">{new Date(selectedTicket.resolved_at).toLocaleDateString("id-ID")}</p>
                      </div>
                    )}
                    {selectedTicket.projects?.name && (
                      <div>
                        <p className="text-muted-foreground">Proyek</p>
                        <p className="font-medium">{selectedTicket.projects.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <StatusTimeline currentStatus={selectedTicket.status} />
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground">Pilih tiket untuk melihat detail</p>
                </CardContent>
              </Card>
            )}
          </RevealCard>
        </div>
      </div>

      <FormDialog open={formOpen} onOpenChange={setFormOpen} title="Tiket Dukungan Baru" description="Jelaskan masalah Anda dan kami akan segera menindaklanjuti.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <ValidatedInput label="Subjek" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} error={errors.subject} placeholder="Deskripsi singkat masalah Anda" />
          <ValidatedTextarea label="Deskripsi" rows={4} value={form.description ?? ""} onChange={e => setForm({...form, description: e.target.value})} error={errors.description} placeholder="Jelaskan detail masalah..." />
          <ValidatedSelect label="Prioritas" value={form.priority} onChange={e => setForm({...form, priority: e.target.value as any})} error={errors.priority} options={[{ value: "Low", label: "Rendah" }, { value: "Medium", label: "Sedang" }, { value: "High", label: "Tinggi" }, { value: "Critical", label: "Kritis" }]} />
          {projects && projects.length > 0 && (
            <ValidatedSelect label="Proyek (opsional)" value={(form as any).project_id ?? ""} onChange={e => setForm({...form, project_id: e.target.value} as any)} options={[{ value: "", label: "— Tidak ada —" }, ...projects.map(p => ({ value: p.id, label: p.name }))]} />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted">Batal</button>
            <button type="submit" disabled={createTicket.isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50">Kirim Tiket</button>
          </div>
        </form>
      </FormDialog>
    </ClientLayout>
  );
}
