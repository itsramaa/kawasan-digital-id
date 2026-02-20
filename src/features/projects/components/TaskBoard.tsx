import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { Task } from "../types";
import { EditTaskDialog } from "./EditTaskDialog";

interface TaskBoardProps {
  tasks: Task[];
}

const statusCols: Record<string, { label: string; variant: "neutral" | "info" | "warning" | "success" }> = {
  "To Do": { label: "To Do", variant: "neutral" },
  "In Progress": { label: "In Progress", variant: "info" },
  "Review": { label: "Review", variant: "warning" },
  "Done": { label: "Done", variant: "success" },
};

const priorityVariant: Record<string, "error" | "warning" | "neutral"> = {
  Critical: "error", High: "warning", Medium: "warning", Low: "neutral",
};

export function TaskBoard({ tasks }: TaskBoardProps) {
  const columns = Object.entries(statusCols);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map(([status, col]) => {
        const statusTasks = tasks?.filter((t) => t.status === status) ?? [];
        return (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between">
              <StatusBadge status={col.label} variant={col.variant} />
              <span className="text-xs text-muted-foreground font-mono">{statusTasks.length}</span>
            </div>
            <div className="space-y-2">
              {statusTasks.map((task: any) => (
                <EditTaskDialog key={task.id} task={task}>
                  <div className="bg-card rounded-lg border border-border p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
                      <StatusBadge status={task.priority} variant={priorityVariant[task.priority] ?? "neutral"} className="text-[10px] px-1.5 py-0.5" />
                    </div>
                    <p className="text-xs text-muted-foreground">{task.projects?.name ?? "—"}</p>
                    {task.due_date && (
                      <p className="text-[11px] text-muted-foreground mt-1.5">Due: {task.due_date}</p>
                    )}
                  </div>
                </EditTaskDialog>
              ))}
              {statusTasks.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">No tasks</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
