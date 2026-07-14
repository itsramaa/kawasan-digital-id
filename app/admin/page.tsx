export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAdminStats } from '@/app/actions/admin'
import { getTickets, getInquiries } from '@/app/actions/dashboard'
import { Users, Building2, Layers, Banknote } from 'lucide-react'

export default async function AdminPage() {
  const [stats, tickets, inquiries] = await Promise.all([
    getAdminStats(),
    getTickets(),
    getInquiries(),
  ])

  const recentTickets = tickets.slice(0, 5)
  const recentInquiries = inquiries.slice(0, 5)

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers.toString(), icon: Users, iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
    { title: 'Total Clients', value: stats.totalClients.toString(), icon: Building2, iconBg: 'bg-violet-100 dark:bg-violet-900/30', iconColor: 'text-violet-600 dark:text-violet-400' },
    { title: 'Total Templates', value: stats.totalTemplates.toString(), icon: Layers, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
    {
      title: 'Total Revenue',
      value: `Rp ${Number(stats.totalRevenue).toLocaleString('id-ID')}`,
      icon: Banknote,
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
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
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
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
