import { ClientLayout } from "@/shared/components/layouts/ClientLayout";
import { useClientOrders } from "@/features/storefront/hooks/useClientOrders";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

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

export default function ClientOrdersPage() {
  const { data: orders, isLoading } = useClientOrders();

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your storefront orders</p>
          </div>
          <Link
            to="/store/templates"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Browse Templates <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !orders?.length ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No orders yet.</p>
            <Link to="/store/templates" className="text-sm text-primary hover:underline mt-2 inline-block">
              Browse our templates
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const features = (order.selected_features as any[]) ?? [];
              return (
                <div key={order.id} className="bg-card rounded-lg border border-border p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold">{order.order_number}</span>
                        <StatusBadge
                          status={order.status}
                          variant={statusVariant[order.status] ?? "neutral"}
                        />
                      </div>
                      <p className="text-sm text-foreground">
                        {order.service_templates?.name ?? "Custom Order"}
                        {order.service_templates?.category && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({order.service_templates.category})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ordered {format(parseISO(order.created_at), "dd MMM yyyy, HH:mm")}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-lg font-bold text-primary">
                        Rp {Number(order.total).toLocaleString("id-ID")}
                      </p>
                      <div className="flex items-center gap-2 justify-end">
                        <StatusBadge
                          status={order.payment_status}
                          variant={paymentVariant[order.payment_status] ?? "neutral"}
                          className="text-[10px]"
                        />
                        {order.payment_method && (
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {order.payment_method}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {features.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {features.map((f: any) => (
                          <span key={f.id} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                            {f.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
