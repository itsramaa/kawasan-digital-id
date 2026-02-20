import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { Settings as SettingsIcon, User, Bell, Shield, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">System configuration and preferences</p>
        </div>

        <div className="space-y-4">
          {[
            { icon: User, title: "Profile", desc: "Update your personal information and preferences" },
            { icon: Bell, title: "Notifications", desc: "Configure email, in-app, and SMS notifications" },
            { icon: Shield, title: "Roles & Permissions", desc: "Manage user roles and access control" },
            { icon: Database, title: "System Configuration", desc: "SLA definitions, workflow rules, status taxonomy" },
            { icon: SettingsIcon, title: "Integrations", desc: "API keys, webhook management, third-party services" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-card rounded-lg border border-border p-5 hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4"
            >
              <div className="p-2.5 rounded-lg bg-primary/10">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
