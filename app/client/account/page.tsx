import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function ClientAccountPage() {
  // TODO: fetch account/profile data for this client from Prisma
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Akun Saya</h1>
        <p className="text-muted-foreground">Kelola profil dan pengaturan akun Anda.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          {/* TODO: profile form with server action */}
          Pengaturan akun segera hadir.
        </CardContent>
      </Card>
    </div>
  );
}
