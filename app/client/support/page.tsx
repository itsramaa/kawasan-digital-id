import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/src/auth'
import { getClientTickets } from '@/app/actions/client-portal'
import CreateTicketForm from '@/components/create-ticket-form'

export const dynamic = 'force-dynamic'

function ticketBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Open': return 'destructive'
    case 'In_Progress': return 'default'
    case 'Resolved':
    case 'Closed': return 'secondary'
    default: return 'outline'
  }
}

export default async function ClientSupportPage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const clientId = (session.user as any).clientId as string | undefined
  if (!clientId) redirect('/auth/login')

  const tickets = (await getClientTickets(clientId)) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bantuan</h1>
        <p className="text-muted-foreground">Tiket dukungan dan pertanyaan Anda.</p>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Tidak ada tiket ditemukan.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((t: any) => (
            <Card key={t.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold">{t.subject}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {t.priority && <span>Prioritas: {t.priority}</span>}
                      <span>Dibuat: {t.createdAt ? new Date(t.createdAt).toLocaleDateString('id-ID') : '—'}</span>
                      {t.updatedAt && (
                        <span>Diperbarui: {new Date(t.updatedAt).toLocaleDateString('id-ID')}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant={ticketBadgeVariant(t.status ?? '')}>{t.status ?? '—'}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateTicketForm clientId={clientId} />
    </div>
  )
}
