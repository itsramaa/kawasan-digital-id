import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ClientContractsPage() {
  // TODO: fetch contracts for this client from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kontrak</h1>
        <p className="text-muted-foreground">Kontrak layanan Anda dengan Kawasan Digital.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Tidak ada kontrak ditemukan. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
