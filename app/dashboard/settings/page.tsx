import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  // TODO: load and save settings via server actions
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure application and account settings.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          {/* TODO: settings form */}
          Settings configuration coming soon.
        </CardContent>
      </Card>
    </div>
  );
}
