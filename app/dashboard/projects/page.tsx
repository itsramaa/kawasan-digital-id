import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ProjectsPage() {
  // TODO: fetch projects from Prisma
  const projects: { id: string; name: string; status: string }[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage all active and archived projects.</p>
        </div>
      </div>
      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No projects found. {/* TODO: wire up data */}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
              </CardHeader>
              <CardContent>{p.status}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
