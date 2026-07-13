import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function InfrastructurePage() {
  // TODO: fetch infrastructure assets from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Infrastructure</h1>
        <p className="text-muted-foreground">Monitor servers, domains, and services.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No infrastructure assets found. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
