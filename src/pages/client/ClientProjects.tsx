import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { EmptyState } from "@/features/client/components/EmptyState";
import { DocumentUpload } from "@/features/client/components/DocumentUpload";
import { FeedbackSurvey } from "@/features/client/components/FeedbackSurvey";
import { useClientProjects } from "@/features/client/hooks/useClientProjects";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { Calendar, ListTodo, CheckSquare, FolderKanban, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { cn } from "@/shared/utils/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";

const statusVariant: Record<string, "info" | "warning" | "hold" | "success" | "neutral"> = {
  Planning: "warning", "In Progress": "info", "On Hold": "hold", Completed: "success", Cancelled: "neutral",
};

const taskPriorityVariant: Record<string, "error" | "warning" | "neutral"> = {
  Critical: "error", High: "warning", Medium: "warning", Low: "neutral",
};

function RevealCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function ClientProjects() {
  const { data: projects, isLoading } = useClientProjects();

  const activeCount = projects?.filter(p => ["Planning", "In Progress"].includes(p.status)).length ?? 0;
  const completedCount = projects?.filter(p => p.status === "Completed").length ?? 0;
  const overdueCount = projects?.filter(p => p.deadline && differenceInDays(parseISO(p.deadline), new Date()) < 0 && p.status !== "Completed").length ?? 0;
  const avgProgress = projects?.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;

  if (isLoading) return <ClientLayout><div className="text-center py-12 text-muted-foreground">Memuat...</div></ClientLayout>;

  const stats = [
    { label: "Proyek Aktif", value: String(activeCount), icon: FolderKanban, color: "text-primary" },
    { label: "Rata-rata Progres", value: `${avgProgress}%`, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Selesai", value: String(completedCount), icon: Clock, color: "text-primary" },
    { label: "Terlambat", value: String(overdueCount), icon: AlertTriangle, color: overdueCount > 0 ? "text-destructive" : "text-muted-foreground" },
  ];

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Hero Banner */}
        <RevealCard>
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border">
            <div className="px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FolderKanban className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dashboard &gt; Proyek</p>
                  <h1 className="text-2xl font-bold tracking-tight">Proyek Saya</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Pantau progres dan milestone proyek Anda</p>
                </div>
              </div>
            </div>
          </div>
        </RevealCard>

        {/* Stat Cards */}
        <RevealCard delay={100}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <s.icon className={cn("w-5 h-5", s.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold truncate">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RevealCard>

        {/* Overdue Alert */}
        {overdueCount > 0 && (
          <RevealCard delay={120}>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive font-medium">
                {overdueCount} proyek telah melewati tenggat waktu. Silakan koordinasi dengan tim kami.
              </p>
            </div>
          </RevealCard>
        )}

        {/* Projects List */}
        {!projects?.length ? (
          <RevealCard delay={150}>
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <ListTodo className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground font-medium">Belum ada proyek</p>
              <p className="text-xs text-muted-foreground mt-1">Proyek Anda akan muncul di sini setelah ditetapkan.</p>
            </div>
          </RevealCard>
        ) : (
          <div className="space-y-5">
            {projects.map((project: any, idx: number) => {
              const isOverdue = project.deadline && differenceInDays(parseISO(project.deadline), new Date()) < 0 && project.status !== "Completed";
              const daysLeft = project.deadline ? differenceInDays(parseISO(project.deadline), new Date()) : null;
              const visibleTasks = (project.tasks ?? []).filter((t: any) => t.is_client_visible);
              const progressColor = isOverdue ? "bg-destructive" : project.progress >= 80 ? "bg-emerald-500" : "bg-primary";

              return (
                <RevealCard key={project.id} delay={150 + idx * 60}>
                  <Card className={cn(
                    "overflow-hidden transition-shadow hover:shadow-md",
                    isOverdue && "border-l-4 border-l-destructive"
                  )}>
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                          <h2 className="text-lg font-semibold">{project.name}</h2>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {project.deadline
                                ? new Date(project.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                                : "Tanpa tenggat"}
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

                      {/* Document Upload */}
                      <DocumentUpload projectId={project.id} />

                      {/* Feedback Survey */}
                      {project.status === "Completed" && (
                        <FeedbackSurvey projectId={project.id} />
                      )}
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
