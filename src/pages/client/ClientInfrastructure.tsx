import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { AlertBanner } from "@/features/client/components/AlertBanner";
import { EmptyState } from "@/features/client/components/EmptyState";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { HeroBanner } from "@/shared/components/common/HeroBanner";
import { StatCards } from "@/shared/components/common/StatCards";
import { StatSkeleton } from "@/shared/components/common/LoadingSkeleton";
import { useClientDomains } from "@/features/client/hooks/useClientDomains";
import { useClientHostings } from "@/features/client/hooks/useClientHostings";
import { Globe, Server, Shield, AlertTriangle, CheckCircle, XCircle, Calendar } from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";
import { cn } from "@/shared/utils/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";

const statusMap: Record<string, "success" | "warning" | "error" | "neutral"> = {
  Active: "success", Suspended: "warning", Expired: "error", Pending: "neutral",
};

function getExpiryColor(daysLeft: number) {
  if (daysLeft <= 30) return "bg-destructive";
  if (daysLeft <= 90) return "bg-yellow-500";
  return "bg-emerald-500";
}

function getExpiryPercent(daysLeft: number) {
  if (daysLeft <= 0) return 0;
  if (daysLeft >= 365) return 100;
  return Math.round((daysLeft / 365) * 100);
}

function getBorderColor(status: string, daysLeft: number | null) {
  if (status === "Expired") return "border-l-4 border-l-destructive";
  if (daysLeft !== null && daysLeft <= 30 && status === "Active") return "border-l-4 border-l-yellow-500";
  if (status === "Active") return "border-l-4 border-l-emerald-500";
  return "border-l-4 border-l-muted";
}

export default function ClientInfrastructure() {
  const { data: domains, isLoading: domainsLoading } = useClientDomains();
  const { data: hostings, isLoading: hostingsLoading } = useClientHostings();

  const expiringDomains = domains?.filter(d => differenceInDays(parseISO(d.expiry_date), new Date()) <= 30 && d.status === "Active") ?? [];
  const expiringHostings = hostings?.filter(h => h.expiry_date && differenceInDays(parseISO(h.expiry_date), new Date()) <= 30 && h.status === "Active") ?? [];
  const autoRenewCount = domains?.filter(d => d.auto_renew).length ?? 0;

  const isLoading = domainsLoading || hostingsLoading;

  const stats = [
    { label: "Total Domain", value: String(domains?.length ?? 0), icon: Globe, color: "text-primary" },
    { label: "Domain Kadaluarsa", value: String(expiringDomains.length), icon: AlertTriangle, color: expiringDomains.length > 0 ? "text-destructive" : "text-muted-foreground" },
    { label: "Total Hosting", value: String(hostings?.length ?? 0), icon: Server, color: "text-primary" },
    { label: "Perpanjangan Otomatis", value: String(autoRenewCount), icon: Shield, color: "text-emerald-500" },
  ];

  return (
    <ClientLayout>
      <div className="space-y-6">
        <HeroBanner icon={Globe} title="Infrastruktur" subtitle="Domain, hosting, dan status layanan Anda" breadcrumb="Dasbor > Infrastruktur" />

        {expiringDomains.length > 0 && (
          <RevealCard delay={50}>
            <AlertBanner variant="warning" title={`${expiringDomains.length} domain akan kadaluarsa dalam 30 hari`} description={expiringDomains.map(d => d.domain_name).join(", ")} />
          </RevealCard>
        )}
        {expiringHostings.length > 0 && (
          <RevealCard delay={50}>
            <AlertBanner variant="warning" title={`${expiringHostings.length} hosting akan kadaluarsa dalam 30 hari`} description={expiringHostings.map(h => h.name).join(", ")} />
          </RevealCard>
        )}

        {isLoading ? (
          <RevealCard delay={100}><StatSkeleton /></RevealCard>
        ) : (
          <StatCards stats={stats} />
        )}

        <RevealCard delay={150}>
          <Tabs defaultValue="domains">
            <TabsList className="mb-4">
              <TabsTrigger value="domains" className="gap-2"><Globe className="w-4 h-4" />Domain ({domains?.length ?? 0})</TabsTrigger>
              <TabsTrigger value="hostings" className="gap-2"><Server className="w-4 h-4" />Hosting ({hostings?.length ?? 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="domains">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-lg border border-border p-4 space-y-3 animate-pulse">
                      <div className="flex justify-between"><div className="h-4 bg-muted rounded w-1/2" /><div className="h-5 bg-muted rounded w-16" /></div>
                      <div className="h-1.5 bg-muted rounded-full" />
                      <div className="grid grid-cols-3 gap-2"><div className="h-8 bg-muted rounded" /><div className="h-8 bg-muted rounded" /><div className="h-8 bg-muted rounded" /></div>
                    </div>
                  ))}
                </div>
              ) : !domains?.length ? (
                <EmptyState icon={Globe} headline="Belum ada domain" description="Domain yang terdaftar akan muncul di sini." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domains.map((d, i) => {
                    const daysLeft = differenceInDays(parseISO(d.expiry_date), new Date());
                    return (
                      <RevealCard key={d.id} delay={200 + i * 50}>
                        <Card className={cn("hover:shadow-md transition-shadow", getBorderColor(d.status, daysLeft))}>
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <h3 className="font-mono font-medium text-sm">{d.domain_name}</h3>
                              <StatusBadge status={d.status} variant={statusMap[d.status] ?? "neutral"} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Sisa waktu</span>
                                <span className={cn(daysLeft <= 30 && "text-destructive font-medium")}>{daysLeft > 0 ? `${daysLeft} hari` : "Kadaluarsa"}</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all", getExpiryColor(daysLeft))} style={{ width: `${getExpiryPercent(daysLeft)}%` }} />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Registrar</span>
                                <span className="font-medium">{d.registrar ?? "—"}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Kadaluarsa</span>
                                <span className="font-medium flex items-center gap-1"><Calendar className="w-3 h-3" />{format(parseISO(d.expiry_date), "dd MMM yyyy")}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Perpanjangan</span>
                                {d.auto_renew ? (
                                  <span className="font-medium text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Otomatis</span>
                                ) : (
                                  <span className="font-medium text-muted-foreground flex items-center gap-1"><XCircle className="w-3 h-3" />Manual</span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </RevealCard>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="hostings">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-lg border border-border p-4 space-y-3 animate-pulse">
                      <div className="flex justify-between"><div className="h-4 bg-muted rounded w-1/2" /><div className="h-5 bg-muted rounded w-16" /></div>
                      <div className="h-1.5 bg-muted rounded-full" />
                      <div className="grid grid-cols-3 gap-2"><div className="h-8 bg-muted rounded" /><div className="h-8 bg-muted rounded" /><div className="h-8 bg-muted rounded" /></div>
                    </div>
                  ))}
                </div>
              ) : !hostings?.length ? (
                <EmptyState icon={Server} headline="Belum ada hosting" description="Layanan hosting Anda akan muncul di sini." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hostings.map((h, i) => {
                    const daysLeft = h.expiry_date ? differenceInDays(parseISO(h.expiry_date), new Date()) : null;
                    return (
                      <RevealCard key={h.id} delay={200 + i * 50}>
                        <Card className={cn("hover:shadow-md transition-shadow", getBorderColor(h.status, daysLeft))}>
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-sm">{h.name}</h3>
                                {h.server_type && <Badge variant="secondary" className="text-[10px]">{h.server_type}</Badge>}
                              </div>
                              <StatusBadge status={h.status} variant={statusMap[h.status] ?? "neutral"} />
                            </div>
                            {daysLeft !== null && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Sisa waktu</span>
                                  <span className={cn(daysLeft <= 30 && "text-destructive font-medium")}>{daysLeft > 0 ? `${daysLeft} hari` : "Kadaluarsa"}</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                                  <div className={cn("h-full rounded-full transition-all", getExpiryColor(daysLeft))} style={{ width: `${getExpiryPercent(daysLeft)}%` }} />
                                </div>
                              </div>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Penyedia</span>
                                <span className="font-medium">{h.provider ?? "—"}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Tipe Server</span>
                                <span className="font-medium">{h.server_type ?? "—"}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Kadaluarsa</span>
                                <span className="font-medium flex items-center gap-1">
                                  {h.expiry_date ? <><Calendar className="w-3 h-3" />{format(parseISO(h.expiry_date), "dd MMM yyyy")}</> : "—"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </RevealCard>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </RevealCard>
      </div>
    </ClientLayout>
  );
}
