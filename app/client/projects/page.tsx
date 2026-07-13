import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/src/auth'
import { getClientProjects } from '@/app/actions/client-portal'

export const dynamic = 'force-dynamic'

export default async function ClientProjectsPage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const clientId = (session.user as any).clientId as string
  const projects = await getClientProjects(clientId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Proyek Saya</h1>
        <p className="text-muted-foreground">Daftar proyek yang sedang berjalan.</p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Tidak ada proyek ditemukan.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((p: any) => (
            <Card key={p.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold">{p.name}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Mulai: {p.startDate ? new Date(p.startDate).toLocaleDateString('id-ID') : '—'}</span>
                      <span>Tenggat: {p.dueDate ? new Date(p.dueDate).toLocaleDateString('id-ID') : '—'}</span>
                    </div>
                    {typeof p.progress === 'number' && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{p.progress}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <Badge variant="outline">{p.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
