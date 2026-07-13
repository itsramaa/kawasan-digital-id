import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ClientProjectsPage() {
  // TODO: fetch projects for this client from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Proyek Saya</h1>
        <p className="text-muted-foreground">Daftar proyek yang sedang berjalan.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Tidak ada proyek ditemukan. {/* TODO: wire up data */}
        </CardContent>
      </Card>
    </div>
  );
}
