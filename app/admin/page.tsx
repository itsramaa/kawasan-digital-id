export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAdminStats } from '@/app/actions/admin'
import { getTickets, getInquiries } from '@/app/actions/dashboard'

export default async function AdminPage() {
  const [stats, tickets, inquiries] = await Promise.all([
    getAdminStats(),
    getTickets(),
    getInquiries(),
  ])

  const recentTickets = tickets.slice(0, 5)
  const recentInquiries = inquiries.slice(0, 5)

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers.toString() },
    { title: 'Total Clients', value: stats.totalClients.toString() },
    { title: 'Total Templates', value: stats.totalTemplates.toString() },
    {
      title: 'Total Revenue',
      value: `Rp ${Number(stats.totalRevenue).toLocaleString('id-ID')}`,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview for super admins.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tickets found.</p>
            ) : (
              <ul className="space-y-3">
                {recentTickets.map((ticket) => (
                  <li key={ticket.id} className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.client?.name ?? '—'} ·{' '}
                        {new Date(ticket.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {ticket.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No inquiries found.</p>
            ) : (
              <ul className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <li key={inquiry.id} className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{inquiry.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {inquiry.client?.name ?? '—'} ·{' '}
                        {new Date(inquiry.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {inquiry.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
