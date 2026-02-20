import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { useClientProjects } from "@/features/client/hooks/useClientProjects";
import { Calendar, ListTodo } from "lucide-react";

const statusVariant: Record<string, "info" | "warning" | "hold" | "success" | "neutral"> = {
  Planning: "warning", "In Progress": "info", "On Hold": "hold", Completed: "success", Cancelled: "neutral",
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
          <p className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">No projects assigned yet.</p>
        ) : (
          <div className="space-y-6">
            {projects.map((project: any) => (
              <div key={project.id} className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">{project.name}</h2>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{project.deadline ?? "No deadline"}</span>
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
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>

                  {/* Milestones */}
                  {project.milestones?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <ListTodo className="w-3.5 h-3.5 text-primary" /> Milestones
                      </h3>
                      <div className="space-y-2">
                        {project.milestones.sort((a: any, b: any) => a.order_index - b.order_index).map((ms: any) => (
                          <div key={ms.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30">
                            <span className="text-sm">{ms.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{ms.due_date ?? "—"}</span>
                              <StatusBadge status={ms.status} variant={ms.status === "Approved" ? "success" : ms.status === "In Progress" ? "info" : "neutral"} className="text-[10px]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
