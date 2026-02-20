import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { AlertBanner } from "@/features/client/components/AlertBanner";
import { EmptyState } from "@/features/client/components/EmptyState";
import { useClientDomains } from "@/features/client/hooks/useClientDomains";
import { useClientHostings } from "@/features/client/hooks/useClientHostings";
import { Globe, Server, Shield, CheckCircle } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { cn } from "@/shared/utils/utils";

const statusMap: Record<string, "success" | "warning" | "error" | "neutral"> = {
  Active: "success", Suspended: "warning", Expired: "error", Pending: "neutral",
};

export default function ClientInfrastructure() {
  const { data: domains, isLoading: domainsLoading } = useClientDomains();
  const { data: hostings, isLoading: hostingsLoading } = useClientHostings();

  const expiringDomains = domains?.filter(d => differenceInDays(parseISO(d.expiry_date), new Date()) <= 30 && d.status === "Active") ?? [];
  const expiringHostings = hostings?.filter(h => h.expiry_date && differenceInDays(parseISO(h.expiry_date), new Date()) <= 30 && h.status === "Active") ?? [];

  const isLoading = domainsLoading || hostingsLoading;

  if (isLoading) return <ClientLayout><div className="text-center py-12 text-muted-foreground">Loading...</div></ClientLayout>;

  return (
    <ClientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Infrastructure</h1>

        {expiringDomains.length > 0 && (
          <AlertBanner variant="warning" title={`${expiringDomains.length} domain(s) expiring within 30 days`} description={expiringDomains.map(d => d.domain_name).join(", ")} />
        )}
        {expiringHostings.length > 0 && (
          <AlertBanner variant="warning" title={`${expiringHostings.length} hosting(s) expiring within 30 days`} description={expiringHostings.map(h => h.name).join(", ")} />
        )}

        {/* Domains */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Domains</h2>
          {!domains?.length ? (
            <EmptyState icon={Globe} headline="No domains" description="Your registered domains will appear here." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domains.map(d => {
                const daysLeft = differenceInDays(parseISO(d.expiry_date), new Date());
                const isExpiring = daysLeft <= 30 && d.status === "Active";
                return (
                  <div key={d.id} className={cn("bg-card rounded-lg border p-4 hover:shadow-md transition-shadow", isExpiring && "border-l-4 border-l-status-error")}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{d.domain_name}</h3>
                      <StatusBadge status={d.status} variant={statusMap[d.status] ?? "neutral"} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div><span className="block text-[10px] uppercase tracking-wider">Registrar</span>{d.registrar ?? "—"}</div>
                      <div><span className="block text-[10px] uppercase tracking-wider">Expires</span>{d.expiry_date}</div>
                      <div><span className="block text-[10px] uppercase tracking-wider">Auto-Renew</span>{d.auto_renew ? <CheckCircle className="w-3.5 h-3.5 text-status-success inline" /> : "No"}</div>
                      {isExpiring && <div className="text-status-error font-medium">{daysLeft > 0 ? `${daysLeft} days left` : "Expired"}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Hostings */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Server className="w-5 h-5 text-primary" /> Hostings</h2>
          {!hostings?.length ? (
            <EmptyState icon={Server} headline="No hostings" description="Your hosting services will appear here." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hostings.map(h => {
                const daysLeft = h.expiry_date ? differenceInDays(parseISO(h.expiry_date), new Date()) : null;
                const isExpiring = daysLeft !== null && daysLeft <= 30 && h.status === "Active";
                return (
                  <div key={h.id} className={cn("bg-card rounded-lg border p-4 hover:shadow-md transition-shadow", isExpiring && "border-l-4 border-l-status-error")}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{h.name}</h3>
                      <StatusBadge status={h.status} variant={statusMap[h.status] ?? "neutral"} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div><span className="block text-[10px] uppercase tracking-wider">Provider</span>{h.provider ?? "—"}</div>
                      <div><span className="block text-[10px] uppercase tracking-wider">Type</span>{h.server_type ?? "—"}</div>
                      <div><span className="block text-[10px] uppercase tracking-wider">Expires</span>{h.expiry_date ?? "—"}</div>
                      {isExpiring && <div className="text-status-error font-medium">{daysLeft! > 0 ? `${daysLeft}d left` : "Expired"}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
