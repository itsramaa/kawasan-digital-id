import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { useClientOrders } from "@/features/storefront/hooks/useClientOrders";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { HeroBanner } from "@/shared/components/common/HeroBanner";
import { StatCards } from "@/shared/components/common/StatCards";
import { ShoppingBag, ExternalLink, Package, CreditCard, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { cn } from "@/shared/utils/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

const statusVariant: Record<string, "info" | "warning" | "success" | "neutral" | "error"> = {
  Pending: "warning", Confirmed: "info", "In Progress": "info", Completed: "success", Cancelled: "neutral",
};
const paymentVariant: Record<string, "info" | "warning" | "success" | "error"> = {
  Unpaid: "warning", Paid: "success", Partial: "info",
};

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
        <HeroBanner
          icon={ShoppingBag}
          title="Pesanan Saya"
          subtitle="Lacak pesanan dan status pembayaran Anda"
          breadcrumb="Dasbor > Pesanan"
          actions={
            <Link to="/templates" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0">
              Jelajahi Template <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <StatCards stats={stats} />

        {!orders?.length ? (
          <RevealCard delay={150}>
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground font-medium">Belum ada pesanan</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">Pesanan Anda akan muncul di sini</p>
              <Link to="/templates" className="text-sm text-primary hover:underline inline-block">Jelajahi template kami</Link>
            </div>
          </RevealCard>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any, idx: number) => {
              const features = (order.selected_features as any[]) ?? [];
              const isOverdue = order.payment_status === "Unpaid";
              return (
                <RevealCard key={order.id} delay={150 + idx * 50}>
                  <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", isOverdue && "border-l-4 border-l-destructive")}>
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm font-semibold">{order.order_number}</span>
                            <StatusBadge status={order.status} variant={statusVariant[order.status] ?? "neutral"} />
                          </div>
                          <p className="text-sm text-foreground">
                            {order.service_templates?.name ?? "Pesanan Kustom"}
                            {order.service_templates?.category && <Badge variant="secondary" className="ml-2 text-[10px]">{order.service_templates.category}</Badge>}
                          </p>
                          <p className="text-xs text-muted-foreground">Dipesan {format(parseISO(order.created_at), "dd MMM yyyy, HH:mm")}</p>
                        </div>
                        <div className="text-right space-y-1.5 shrink-0">
                          <p className="text-lg font-bold text-primary font-mono">Rp {Number(order.total).toLocaleString("id-ID")}</p>
                          <div className="flex items-center gap-2 justify-end">
                            <StatusBadge status={order.payment_status} variant={paymentVariant[order.payment_status] ?? "neutral"} className="text-[10px]" />
                            {order.payment_method && <span className="text-[10px] text-muted-foreground uppercase">{order.payment_method}</span>}
                          </div>
                        </div>
                      </div>
                      {features.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-1.5">Fitur:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {features.map((f: any) => (
                              <span key={f.id} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{f.name}</span>
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
