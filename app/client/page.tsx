import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/src/auth'
import {
  getClientProjects,
  getClientInvoices,
  getClientTickets,
  getClientDomains,
  getClientHostings,
} from '@/app/actions/client-portal'

export const dynamic = 'force-dynamic'

export default async function ClientDashboardPage() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const clientId = (session.user as any).clientId as string

  const [projects, invoices, tickets, domains, hostings] = await Promise.all([
    getClientProjects(clientId),
    getClientInvoices(clientId),
    getClientTickets(clientId),
    getClientDomains(clientId),
    getClientHostings(clientId),
  ])

  const activeProjects = projects.filter((p: any) => p.status === 'ACTIVE' || p.status === 'IN_PROGRESS').length
  const unpaidInvoices = invoices.filter((i: any) => i.status !== 'PAID').length
  const openTickets = tickets.filter((t: any) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length
  const servicesCount = domains.length + hostings.length

  const stats = [
    { title: 'Active Projects', value: String(activeProjects) },
    { title: 'Unpaid Invoices', value: String(unpaidInvoices) },
    { title: 'Open Tickets', value: String(openTickets) },
    { title: 'Services Active', value: String(servicesCount) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dasbor</h1>
        <p className="text-muted-foreground">Selamat datang di portal klien Kawasan Digital.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
