import { useState } from "react";
import { AppLayout } from "@/shared/components/layouts/AppLayout";
import { StatusBadge, KPICard } from "@/shared/components/common/StatusBadge";
import { DataTable } from "@/shared/components/common/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Globe, Server, AlertTriangle, Shield } from "lucide-react";
import { useDomains } from "@/features/infrastructure/hooks/useDomains";
import { useHostings } from "@/features/infrastructure/hooks/useHostings";

const domainStatusMap: Record<string, "success" | "warning" | "error" | "neutral"> = {
  Active: "success", "Expiring Soon": "warning", Expired: "error", Suspended: "neutral",
};

export default function Infrastructure() {
  const { data: domains, isLoading: domainsLoading } = useDomains();
  const { data: hostings, isLoading: hostingsLoading } = useHostings();

  const expiringDomains = domains?.filter(d => d.status === "Expiring Soon" || d.status === "Expired").length ?? 0;
  const totalDomains = domains?.length ?? 0;
  const totalHostings = hostings?.length ?? 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Infrastructure</h1>
          <p className="text-sm text-muted-foreground mt-1">Domain registrations, hosting, and server management</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard title="Total Domains" value={String(totalDomains)} icon={Globe} />
          <KPICard title="Expiring / Expired" value={String(expiringDomains)} changeType={expiringDomains > 0 ? "negative" : "neutral"} icon={AlertTriangle} />
          <KPICard title="Active Hostings" value={String(totalHostings)} icon={Server} />
          <KPICard title="SSL Status" value="—" icon={Shield} />
        </div>

        <Tabs defaultValue="domains" className="space-y-4">
          <TabsList>
            <TabsTrigger value="domains" className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" />Domains</TabsTrigger>
            <TabsTrigger value="hostings" className="flex items-center gap-2"><Server className="w-3.5 h-3.5" />Hosting</TabsTrigger>
          </TabsList>

          <TabsContent value="domains">
            <DataTable
              columns={[
                { key: "domain", header: "Domain", render: (d: any) => <span className="font-medium font-mono text-xs">{d.domain_name}</span> },
                { key: "client", header: "Client", render: (d: any) => <span className="text-muted-foreground">{d.clients?.name ?? "—"}</span> },
                { key: "registrar", header: "Registrar", render: (d: any) => <span className="text-muted-foreground">{d.registrar ?? "—"}</span> },
                { key: "expiry", header: "Expiry", render: (d: any) => {
                  const isExpired = new Date(d.expiry_date) < new Date();
                  return <span className={`text-xs ${isExpired ? "text-status-error font-medium" : "text-muted-foreground"}`}>{d.expiry_date}</span>;
                }},
                { key: "auto_renew", header: "Auto Renew", render: (d: any) => <span className="text-xs">{d.auto_renew ? "✓ Yes" : "✕ No"}</span> },
                { key: "status", header: "Status", render: (d: any) => <StatusBadge status={d.status} variant={domainStatusMap[d.status] ?? "neutral"} /> },
              ]}
              data={domains ?? []}
              isLoading={domainsLoading}
              emptyMessage="No domains registered."
              searchField={(d: any) => `${d.domain_name} ${d.clients?.name}`}
              searchPlaceholder="Search domains..."
            />
          </TabsContent>

          <TabsContent value="hostings">
            <DataTable
              columns={[
                { key: "name", header: "Server Name", render: (h: any) => <span className="font-medium">{h.name}</span> },
                { key: "client", header: "Client", render: (h: any) => <span className="text-muted-foreground">{h.clients?.name ?? "—"}</span> },
                { key: "provider", header: "Provider", render: (h: any) => <span className="text-muted-foreground">{h.provider ?? "—"}</span> },
                { key: "type", header: "Type", render: (h: any) => <StatusBadge status={h.server_type ?? "—"} variant="info" /> },
                { key: "ip", header: "IP Address", render: (h: any) => <span className="font-mono text-xs text-muted-foreground">{h.ip_address ?? "—"}</span> },
                { key: "expiry", header: "Expiry", render: (h: any) => <span className="text-xs text-muted-foreground">{h.expiry_date ?? "No expiry"}</span> },
                { key: "status", header: "Status", render: (h: any) => <StatusBadge status={h.status} variant={h.status === "Active" ? "success" : "neutral"} /> },
              ]}
              data={hostings ?? []}
              isLoading={hostingsLoading}
              emptyMessage="No hosting records."
              searchField={(h: any) => `${h.name} ${h.provider} ${h.clients?.name}`}
              searchPlaceholder="Search hostings..."
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
