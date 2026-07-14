export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getProjectTasks } from '@/app/actions/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const STATUSES = ['To_Do', 'In_Progress', 'In_Review', 'Done', 'Blocked'] as const;

const STATUS_LABELS: Record<string, string> = {
  To_Do: 'To Do',
  In_Progress: 'In Progress',
  In_Review: 'In Review',
  Done: 'Done',
  Blocked: 'Blocked',
};

const PRIORITY_CLASS: Record<string, string> = {
  Low: 'bg-gray-100 text-gray-700 border-gray-200',
  Medium: 'bg-blue-100 text-blue-700 border-blue-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Critical: 'bg-red-100 text-red-700 border-red-200',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TasksPage({ params }: Props) {
  const { id } = await params;
  const tasks = await getProjectTasks(id);

  const grouped = Object.fromEntries(
    STATUSES.map((s) => [s, tasks.filter((t) => t.status === s)]),
  ) as Record<string, typeof tasks>;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/projects/${id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Kembali ke Proyek
        </Link>
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>

      {/* Kanban board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {STATUSES.map((status) => {
          const col = grouped[status];
          return (
            <div key={status} className="flex flex-col gap-3">
              {/* Column header */}
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold">{STATUS_LABELS[status]}</span>
                <Badge variant="secondary" className="text-xs">
                  {col.length}
                </Badge>
              </div>

              {/* Task cards */}
              {col.length === 0 ? (
                <p className="text-xs text-muted-foreground px-1">Tidak ada task</p>
              ) : (
                col.map((task) => (
                  <Card key={task.id} className="shadow-none border">
                    <CardHeader className="p-3 pb-1">
                      <CardTitle className="text-sm font-medium leading-snug">
                        {task.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-1 flex flex-col gap-1">
                      {task.priority && (
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold w-fit ${PRIORITY_CLASS[task.priority] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}
                        >
                          {task.priority}
                        </span>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString('id-ID')}
                        </p>
                      )}
                      {/* ponytail: assignee is included via getProjectTasks include: { assignee: true } */}
                      {(task as { assignee?: { name?: string | null } | null }).assignee?.name && (
                        <p className="text-xs text-muted-foreground">
                          {(task as { assignee?: { name?: string | null } | null }).assignee!.name}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
