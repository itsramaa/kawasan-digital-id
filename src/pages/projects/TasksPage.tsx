import { useState } from "react";
import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { PageHeader } from "@/shared/components/common/PageHeader";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { useTasks } from "@/features/projects/hooks/useTasks";
import { useSupabaseUpdate } from "@/shared/hooks/useSupabaseCrud";
import { GripVertical, Calendar, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/utils";

const KANBAN_COLUMNS = [
  { status: "To Do", label: "To Do", variant: "neutral" as const, color: "bg-muted-foreground" },
  { status: "In Progress", label: "In Progress", variant: "info" as const, color: "bg-status-info" },
  { status: "Review", label: "Review", variant: "warning" as const, color: "bg-status-warning" },
  { status: "Done", label: "Done", variant: "success" as const, color: "bg-status-success" },
];

const priorityVariant: Record<string, "error" | "warning" | "neutral"> = {
  Critical: "error", High: "warning", Medium: "warning", Low: "neutral",
};
const priorityOrder: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export default function TasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const updateMut = useSupabaseUpdate("tasks", [["tasks"], ["tasks", undefined]]);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState("all");

  const filteredTasks = tasks?.filter(t => projectFilter === "all" || t.project_id === projectFilter) ?? [];
  const projects = Array.from(new Set(tasks?.map(t => t.projects?.name).filter(Boolean) ?? []));

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragOverCol(status);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverCol(null);
    if (draggedTask) {
      const task = tasks?.find(t => t.id === draggedTask);
      if (task && task.status !== newStatus) {
        updateMut.mutate({ id: draggedTask, status: newStatus });
      }
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverCol(null);
  };

  if (isLoading) return <AppLayout><div className="text-center py-12 text-muted-foreground">Loading tasks...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Task Board"
          subtitle={`Kanban view · ${tasks?.length ?? 0} total tasks`}
          actions={
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[200px]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Project" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p} value={tasks?.find(t => t.projects?.name === p)?.project_id ?? p!}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {KANBAN_COLUMNS.map(col => {
            const colTasks = filteredTasks
              .filter(t => t.status === col.status)
              .sort((a, b) => (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99));

            return (
              <div
                key={col.status}
                onDragOver={(e) => handleDragOver(e, col.status)}
                onDrop={(e) => handleDrop(e, col.status)}
                onDragLeave={() => setDragOverCol(null)}
                className={cn(
                  "min-h-[200px] rounded-lg transition-colors",
                  dragOverCol === col.status && "bg-primary/5 ring-2 ring-primary/20 ring-dashed"
                )}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full", col.color)} />
                    <span className="text-sm font-semibold">{col.label}</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>

                {/* Task Cards */}
                <div className="space-y-2">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "bg-card rounded-lg border border-border p-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group",
                        draggedTask === task.id && "opacity-50 rotate-1 scale-95",
                        task.priority === "Critical" && "border-l-4 border-l-destructive"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge status={task.priority} variant={priorityVariant[task.priority] ?? "neutral"} className="text-[10px] px-1.5 py-0.5" />
                            <span className="text-[10px] text-muted-foreground truncate">{task.projects?.name ?? "—"}</span>
                          </div>
                          {task.due_date && (
                            <div className="flex items-center gap-1 mt-2 text-[11px] text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {task.due_date}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                      {dragOverCol === col.status ? "Drop here" : "No tasks"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
