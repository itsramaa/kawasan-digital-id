import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ClientSupportPage() {
  // TODO: fetch support tickets for this client from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bantuan</h1>
        <p className="text-muted-foreground">Tiket dukungan dan pertanyaan Anda.</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Tidak ada tiket ditemukan. {/* TODO: buat tiket baru */}
        </CardContent>
      </Card>
    </div>
  );
}
