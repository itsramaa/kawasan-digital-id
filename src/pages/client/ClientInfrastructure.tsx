import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { AlertBanner } from "@/features/client/components/AlertBanner";
import { EmptyState } from "@/features/client/components/EmptyState";
import { useClientDomains } from "@/features/client/hooks/useClientDomains";
import { useClientHostings } from "@/features/client/hooks/useClientHostings";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { Globe, Server, Shield, AlertTriangle, CheckCircle, XCircle, Calendar } from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";
import { cn } from "@/shared/utils/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";

function RevealCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const statusMap: Record<string, "success" | "warning" | "error" | "neutral"> = {
  Active: "success", Suspended: "warning", Expired: "error", Pending: "neutral",
};

function getExpiryColor(daysLeft: number) {
  if (daysLeft <= 0) return "bg-destructive";
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

  if (isLoading) return <ClientLayout><div className="text-center py-12 text-muted-foreground">Memuat...</div></ClientLayout>;

  const stats = [
    { label: "Total Domain", value: domains?.length ?? 0, icon: Globe, color: "text-primary" },
    { label: "Domain Kadaluarsa", value: expiringDomains.length, icon: AlertTriangle, color: expiringDomains.length > 0 ? "text-destructive" : "text-muted-foreground" },
    { label: "Total Hosting", value: hostings?.length ?? 0, icon: Server, color: "text-primary" },
    { label: "Perpanjangan Otomatis", value: autoRenewCount, icon: Shield, color: "text-emerald-500" },
  ];

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Hero Banner */}
        <RevealCard>
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border">
            <div className="px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dashboard &gt; Infrastruktur</p>
                  <h1 className="text-2xl font-bold tracking-tight">Infrastruktur</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Domain, hosting, dan status layanan Anda</p>
                </div>
              </div>
            </div>
          </div>
        </RevealCard>

        {/* Alerts */}
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

        {/* Stat Cards */}
        <RevealCard delay={100}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <s.icon className={cn("w-5 h-5", s.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RevealCard>

        {/* Tabs */}
        <RevealCard delay={150}>
          <Tabs defaultValue="domains">
            <TabsList className="mb-4">
              <TabsTrigger value="domains" className="gap-2">
                <Globe className="w-4 h-4" />
                Domain ({domains?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value="hostings" className="gap-2">
                <Server className="w-4 h-4" />
                Hosting ({hostings?.length ?? 0})
              </TabsTrigger>
            </TabsList>

            {/* Domains Tab */}
            <TabsContent value="domains">
              {!domains?.length ? (
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

                            {/* Expiry Progress */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Sisa waktu</span>
                                <span className={cn(daysLeft <= 30 && "text-destructive font-medium")}>
                                  {daysLeft > 0 ? `${daysLeft} hari` : "Kadaluarsa"}
                                </span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full transition-all", getExpiryColor(daysLeft))}
                                  style={{ width: `${getExpiryPercent(daysLeft)}%` }}
                                />
                              </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Registrar</span>
                                <span className="font-medium">{d.registrar ?? "—"}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Kadaluarsa</span>
                                <span className="font-medium flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(parseISO(d.expiry_date), "dd MMM yyyy")}
                                </span>
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

            {/* Hostings Tab */}
            <TabsContent value="hostings">
              {!hostings?.length ? (
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

                            {/* Expiry Progress (if date exists) */}
                            {daysLeft !== null && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Sisa waktu</span>
                                  <span className={cn(daysLeft <= 30 && "text-destructive font-medium")}>
                                    {daysLeft > 0 ? `${daysLeft} hari` : "Kadaluarsa"}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                                  <div
                                    className={cn("h-full rounded-full transition-all", getExpiryColor(daysLeft))}
                                    style={{ width: `${getExpiryPercent(daysLeft)}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Info Grid */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
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
                                  {h.expiry_date ? (
                                    <><Calendar className="w-3 h-3" />{format(parseISO(h.expiry_date), "dd MMM yyyy")}</>
                                  ) : "—"}
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
