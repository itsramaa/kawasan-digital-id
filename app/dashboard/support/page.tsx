import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function SupportPage() {
  // TODO: fetch support tickets from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground">Manage customer support tickets.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No tickets found. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
