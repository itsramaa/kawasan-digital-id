import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { useClientOrders } from "@/features/storefront/hooks/useClientOrders";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import { ShoppingBag, ExternalLink, Package, CreditCard, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { cn } from "@/shared/utils/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

const statusVariant: Record<string, "info" | "warning" | "success" | "neutral" | "error"> = {
  Pending: "warning",
  Confirmed: "info",
  "In Progress": "info",
  Completed: "success",
  Cancelled: "neutral",
};

const paymentVariant: Record<string, "info" | "warning" | "success" | "error"> = {
  Unpaid: "warning",
  Paid: "success",
  Partial: "info",
};

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

export default function ClientOrdersPage() {
  const { data: orders, isLoading } = useClientOrders();

  const totalSpent = orders?.reduce((s, o: any) => s + Number(o.total), 0) ?? 0;
  const count = orders?.length ?? 0;
  const pendingCount = orders?.filter((o: any) => o.status === "Pending").length ?? 0;
  const unpaidCount = orders?.filter((o: any) => o.payment_status === "Unpaid").length ?? 0;

  if (isLoading) return <ClientLayout><div className="text-center py-12 text-muted-foreground">Memuat...</div></ClientLayout>;

  const stats = [
    { label: "Total Belanja", value: `Rp ${(totalSpent / 1e6).toFixed(1)}M`, icon: CreditCard, color: "text-primary" },
    { label: "Total Pesanan", value: String(count), icon: Package, color: "text-primary" },
    { label: "Menunggu", value: String(pendingCount), icon: Clock, color: pendingCount > 0 ? "text-yellow-500" : "text-muted-foreground" },
    { label: "Belum Bayar", value: String(unpaidCount), icon: ShoppingBag, color: unpaidCount > 0 ? "text-destructive" : "text-muted-foreground" },
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
                  <ShoppingBag className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dashboard &gt; Pesanan</p>
                  <h1 className="text-2xl font-bold tracking-tight">Pesanan Saya</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Lacak pesanan dan status pembayaran Anda</p>
                </div>
              </div>
              <Link
                to="/templates"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
              >
                Jelajahi Template <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </RevealCard>

        {/* Stat Cards */}
        <RevealCard delay={100}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <s.icon className={cn("w-5 h-5", s.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold truncate">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RevealCard>

        {/* Orders List */}
        {!orders?.length ? (
          <RevealCard delay={150}>
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground font-medium">Belum ada pesanan</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">Pesanan Anda akan muncul di sini</p>
              <Link to="/templates" className="text-sm text-primary hover:underline inline-block">
                Jelajahi template kami
              </Link>
            </div>
          </RevealCard>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any, idx: number) => {
              const features = (order.selected_features as any[]) ?? [];
              const isOverdue = order.payment_status === "Unpaid";
              return (
                <RevealCard key={order.id} delay={150 + idx * 50}>
                  <Card className={cn(
                    "overflow-hidden transition-shadow hover:shadow-md",
                    isOverdue && "border-l-4 border-l-destructive"
                  )}>
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm font-semibold">{order.order_number}</span>
                            <StatusBadge status={order.status} variant={statusVariant[order.status] ?? "neutral"} />
                          </div>
                          <p className="text-sm text-foreground">
                            {order.service_templates?.name ?? "Pesanan Kustom"}
                            {order.service_templates?.category && (
                              <Badge variant="secondary" className="ml-2 text-[10px]">{order.service_templates.category}</Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Dipesan {format(parseISO(order.created_at), "dd MMM yyyy, HH:mm")}
                          </p>
                        </div>

                        <div className="text-right space-y-1.5 shrink-0">
                          <p className="text-lg font-bold text-primary font-mono">
                            Rp {Number(order.total).toLocaleString("id-ID")}
                          </p>
                          <div className="flex items-center gap-2 justify-end">
                            <StatusBadge
                              status={order.payment_status}
                              variant={paymentVariant[order.payment_status] ?? "neutral"}
                              className="text-[10px]"
                            />
                            {order.payment_method && (
                              <span className="text-[10px] text-muted-foreground uppercase">{order.payment_method}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {features.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-1.5">Fitur:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {features.map((f: any) => (
                              <span key={f.id} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                {f.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </RevealCard>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
