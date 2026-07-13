export const dynamic = 'force-dynamic'

interface TasksPageProps {

  params: Promise<{ id: string }>;
}

export default async function TasksPage({ params }: TasksPageProps) {
  const { id } = await params;
  // TODO: fetch tasks for project from Prisma

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">Project ID: {id}</p>
      </div>
      {/* TODO: render task board / list */}
    </div>
  );
}
