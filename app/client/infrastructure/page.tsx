import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ClientInfrastructurePage() {
  // TODO: fetch infrastructure services for this client from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Infrastruktur</h1>
        <p className="text-muted-foreground">Server, domain, dan layanan aktif Anda.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Tidak ada layanan infrastruktur ditemukan. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
