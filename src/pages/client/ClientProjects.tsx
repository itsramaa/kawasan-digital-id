import { useState, useMemo } from "react";
import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { DocumentUpload } from "@/features/client/components/DocumentUpload";
import { FeedbackSurvey } from "@/features/client/components/FeedbackSurvey";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { HeroBanner } from "@/shared/components/common/HeroBanner";
import { StatCards } from "@/shared/components/common/StatCards";
import { StatSkeleton } from "@/shared/components/common/LoadingSkeleton";
import { useClientProjects } from "@/features/client/hooks/useClientProjects";
import { Calendar, ListTodo, CheckSquare, FolderKanban, CheckCircle, AlertTriangle, Clock, Filter } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { cn } from "@/shared/utils/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { EmptyState } from "@/features/client/components/EmptyState";

const statusVariant: Record<string, "info" | "warning" | "hold" | "success" | "neutral"> = {
  Planning: "warning", "In Progress": "info", "On Hold": "hold", Completed: "success", Cancelled: "neutral",
};
const taskPriorityVariant: Record<string, "error" | "warning" | "neutral"> = {
  Critical: "error", High: "warning", Medium: "warning", Low: "neutral",
};

type StatusFilter = "all" | "active" | "completed" | "onhold";

export default function ClientProjects() {
  const { data: projects, isLoading } = useClientProjects();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activeCount = projects?.filter(p => ["Planning", "In Progress"].includes(p.status)).length ?? 0;
  const completedCount = projects?.filter(p => p.status === "Completed").length ?? 0;
  const overdueCount = projects?.filter(p => p.deadline && differenceInDays(parseISO(p.deadline), new Date()) < 0 && p.status !== "Completed").length ?? 0;
  const avgProgress = projects?.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    let list = projects;
    if (statusFilter === "active") list = list.filter(p => ["Planning", "In Progress"].includes(p.status));
    else if (statusFilter === "completed") list = list.filter(p => p.status === "Completed");
    else if (statusFilter === "onhold") list = list.filter(p => ["On Hold", "Cancelled"].includes(p.status));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [projects, statusFilter, searchQuery]);

  const filterTabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: projects?.length ?? 0 },
    { key: "active", label: "Aktif", count: activeCount },
    { key: "completed", label: "Selesai", count: completedCount },
    { key: "onhold", label: "Ditahan", count: projects?.filter(p => ["On Hold", "Cancelled"].includes(p.status)).length ?? 0 },
  ];

  const stats = [
    { label: "Proyek Aktif", value: String(activeCount), icon: FolderKanban, color: "text-primary" },
    { label: "Rata-rata Progres", value: `${avgProgress}%`, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Selesai", value: String(completedCount), icon: Clock, color: "text-primary" },
    { label: "Terlambat", value: String(overdueCount), icon: AlertTriangle, color: overdueCount > 0 ? "text-destructive" : "text-muted-foreground" },
  ];

  return (
    <ClientLayout>
      <div className="space-y-6">
        <HeroBanner icon={FolderKanban} title="Proyek Saya" subtitle="Pantau progres dan milestone proyek Anda" breadcrumb="Dasbor > Proyek" />

        {isLoading ? (
          <RevealCard delay={100}><StatSkeleton /></RevealCard>
        ) : (
          <StatCards stats={stats} />
        )}

        {/* Overdue Alert */}
        {overdueCount > 0 && (
          <RevealCard delay={120}>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5" role="alert">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive font-medium">
                {overdueCount} proyek telah melewati tenggat waktu. Silakan koordinasi dengan tim kami.
              </p>
            </div>
          </RevealCard>
        )}

        {/* Search & Filter */}
        <RevealCard delay={130}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari proyek..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Cari proyek"
              />
            </div>
            <div className="flex gap-1.5" role="tablist" aria-label="Filter status proyek">
              {filterTabs.map(tab => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={statusFilter === tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={cn(
                    "px-3 py-2 rounded-md text-xs font-medium transition-colors",
                    statusFilter === tab.key
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

        {/* Projects List */}
        {isLoading ? (
          <RevealCard delay={150}>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-5 space-y-4 animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-5 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-16" />
                  </div>
                  <div className="h-2.5 bg-muted rounded-full w-full" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          </RevealCard>
        ) : !filteredProjects.length ? (
          <RevealCard delay={150}>
            <EmptyState
              icon={projects?.length ? Filter : ListTodo}
              headline={projects?.length ? "Tidak ada proyek ditemukan" : "Belum ada proyek"}
              description={projects?.length ? "Coba ubah filter atau kata kunci pencarian." : "Proyek Anda akan muncul di sini setelah ditetapkan."}
            />
          </RevealCard>
        ) : (
          <div className="space-y-5">
            <p className="text-xs text-muted-foreground">{filteredProjects.length} proyek ditampilkan</p>
            {filteredProjects.map((project: any, idx: number) => {
              const isOverdue = project.deadline && differenceInDays(parseISO(project.deadline), new Date()) < 0 && project.status !== "Completed";
              const daysLeft = project.deadline ? differenceInDays(parseISO(project.deadline), new Date()) : null;
              const visibleTasks = (project.tasks ?? []).filter((t: any) => t.is_client_visible);
              const progressColor = isOverdue ? "bg-destructive" : project.progress >= 80 ? "bg-emerald-500" : "bg-primary";

              return (
                <RevealCard key={project.id} delay={150 + idx * 60}>
                  <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", isOverdue && "border-l-4 border-l-destructive")}>
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                          <h2 className="text-lg font-semibold">{project.name}</h2>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {project.deadline ? new Date(project.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Tanpa tenggat"}
                            </span>
                            {daysLeft !== null && project.status !== "Completed" && (
                              <span className={cn("font-medium", isOverdue ? "text-destructive" : daysLeft <= 7 ? "text-yellow-500" : "text-muted-foreground")}>
                                {isOverdue ? `${Math.abs(daysLeft)}h terlambat` : `${daysLeft}h tersisa`}
                              </span>
                            )}
                          </div>
                        </div>
                        <StatusBadge status={project.status} variant={statusVariant[project.status] ?? "neutral"} />
                      </div>

                      {/* Progress */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progres Keseluruhan</span>
                          <span className="font-mono font-medium">{project.progress}%</span>
                        </div>
                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-500", progressColor)} style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>

                      {/* Milestones */}
                      {project.milestones?.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                            <ListTodo className="w-3.5 h-3.5 text-primary" /> Milestone
                          </h3>
                          <div className="space-y-2">
                            {project.milestones.sort((a: any, b: any) => a.order_index - b.order_index).map((ms: any) => (
                              <div key={ms.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30">
                                <span className="text-sm">{ms.title}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    {ms.due_date ? new Date(ms.due_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—"}
                                  </span>
                                  <StatusBadge status={ms.status} variant={ms.status === "Approved" ? "success" : ms.status === "In Progress" ? "info" : ms.status === "Submitted" ? "warning" : "neutral"} className="text-[10px]" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Client-visible tasks */}
                      {visibleTasks.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                            <CheckSquare className="w-3.5 h-3.5 text-primary" /> Tugas
                          </h3>
                          <div className="space-y-2">
                            {visibleTasks.map((task: any) => (
                              <div key={task.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30">
                                <span className="text-sm">{task.title}</span>
                                <div className="flex items-center gap-2">
                                  <StatusBadge status={task.priority} variant={taskPriorityVariant[task.priority] ?? "neutral"} className="text-[10px]" />
                                  <StatusBadge status={task.status} variant={task.status === "Done" ? "success" : task.status === "In Progress" ? "info" : "neutral"} className="text-[10px]" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <DocumentUpload projectId={project.id} />
                      {project.status === "Completed" && <FeedbackSurvey projectId={project.id} />}
                    </CardContent>
                  </Card>
                </RevealCard>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
