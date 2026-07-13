import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTickets } from '@/app/actions/dashboard';

export const dynamic = 'force-dynamic';

export default async function SupportPage() {
  const tickets = await getTickets();

  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In_Progress').length;
  const escalatedCount = tickets.filter((t) => t.status === 'Escalated').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground">Manage customer support tickets.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Open', count: openCount },
          { label: 'In Progress', count: inProgressCount },
          { label: 'Escalated', count: escalatedCount },
        ].map(({ label, count }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No tickets found.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tickets</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {/* TODO: replace with TicketTable client component */}
            {(tickets as any[]).map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{t.ticketNumber}</span>
                <span>{t.subject}</span>
                <span>{t.client?.name}</span>
                <span className="text-muted-foreground">{t.priority}</span>
                <span className="text-muted-foreground">{t.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
