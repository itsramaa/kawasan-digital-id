import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { EmptyState } from "@/features/client/components/EmptyState";
import { useClientProjects } from "@/features/client/hooks/useClientProjects";
import { Calendar, ListTodo, CheckSquare } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { cn } from "@/shared/utils/utils";

const statusVariant: Record<string, "info" | "warning" | "hold" | "success" | "neutral"> = {
  Planning: "warning", "In Progress": "info", "On Hold": "hold", Completed: "success", Cancelled: "neutral",
};

const taskPriorityVariant: Record<string, "error" | "warning" | "neutral"> = {
  Critical: "error", High: "warning", Medium: "warning", Low: "neutral",
};

export default function ClientProjects() {
  const { data: projects, isLoading } = useClientProjects();

  if (isLoading) return <ClientLayout><div className="text-center py-12 text-muted-foreground">Loading...</div></ClientLayout>;

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your project progress and milestones</p>
        </div>

        {!projects?.length ? (
          <EmptyState icon={ListTodo} headline="No projects assigned" description="Your projects will appear here once assigned." />
        ) : (
          <div className="space-y-6">
            {projects.map((project: any) => {
              const isOverdue = project.deadline && differenceInDays(parseISO(project.deadline), new Date()) < 0 && project.status !== "Completed";
              const daysLeft = project.deadline ? differenceInDays(parseISO(project.deadline), new Date()) : null;
              const visibleTasks = (project.tasks ?? []).filter((t: any) => t.is_client_visible);
              const progressColor = isOverdue ? "bg-status-error" : project.progress >= 80 ? "bg-status-success" : "bg-primary";

              return (
                <div key={project.id} className={cn("bg-card rounded-lg border border-border overflow-hidden", isOverdue && "border-l-4 border-l-status-error")}>
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-lg font-semibold">{project.name}</h2>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {project.deadline ?? "No deadline"}
                          </span>
                          {daysLeft !== null && project.status !== "Completed" && (
                            <span className={cn("font-medium", isOverdue ? "text-status-error" : daysLeft <= 7 ? "text-status-warning" : "text-muted-foreground")}>
                              {isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                            </span>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={project.status} variant={statusVariant[project.status] ?? "neutral"} />
                    </div>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-mono font-medium">{project.progress}%</span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", progressColor)} style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>

                    {/* Milestones */}
                    {project.milestones?.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                          <ListTodo className="w-3.5 h-3.5 text-primary" /> Milestones
                        </h3>
                        <div className="space-y-2">
                          {project.milestones.sort((a: any, b: any) => a.order_index - b.order_index).map((ms: any) => (
                            <div key={ms.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30">
                              <span className="text-sm">{ms.title}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{ms.due_date ?? "—"}</span>
                                <StatusBadge status={ms.status} variant={ms.status === "Approved" ? "success" : ms.status === "In Progress" ? "info" : ms.status === "Submitted" ? "warning" : "neutral"} className="text-[10px]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Client-visible tasks */}
                    {visibleTasks.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-primary" /> Tasks
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
