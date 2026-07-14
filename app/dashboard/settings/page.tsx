export const dynamic = 'force-dynamic'

import { getSystemSettings } from '@/app/actions/admin'
import { SettingsForm } from '@/components/settings-form'

export default async function SettingsPage() {
  const settings = await getSystemSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Konfigurasi pengaturan sistem aplikasi.</p>
      </div>
      {settings.length === 0 ? (
        <p className="text-muted-foreground">Belum ada konfigurasi sistem.</p>
      ) : (
        <SettingsForm settings={settings} />
      )}
    </div>
  )
}
