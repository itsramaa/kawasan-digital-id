export const dynamic = 'force-dynamic'

interface ProjectDetailsPageProps {

  params: Promise<{ id: string }>;
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { id } = await params;
  // TODO: fetch project by id from Prisma

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Project Details</h1>
        <p className="text-muted-foreground">Project ID: {id}</p>
      </div>
      {/* TODO: render project details, team, milestones */}
    </div>
  );
}
