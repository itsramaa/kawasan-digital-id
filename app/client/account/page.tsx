import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/src/auth'

export const dynamic = 'force-dynamic'

export default async function ClientAccountPage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const user = session.user as any

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Akun Saya</h1>
        <p className="text-muted-foreground">Kelola profil dan pengaturan akun Anda.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nama</p>
              <p className="text-base font-semibold">{user.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base font-semibold">{user.email ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="text-base font-semibold">{user.role ?? '—'}</p>
            </div>
            {user.clientId && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client ID</p>
                <p className="font-mono text-sm">{user.clientId}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
