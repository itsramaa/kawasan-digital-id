import { useState } from "react";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { supabase } from "@/integrations/supabase/client";
import { Search, Package, Clock, CreditCard, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/utils";
import { Link } from "react-router-dom";

interface TrackedOrder {
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  updated_at: string;
  customer_name: string;
  selected_features: Array<{ id: string; name: string; price: number }> | null;
  template_id: string | null;
  service_templates: { name: string; category: string | null } | null;
}

const STATUS_CONFIG: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  Pending: { color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock, label: "Menunggu" },
  Confirmed: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Package, label: "Dikonfirmasi" },
  "In Progress": { color: "bg-primary/10 text-primary border-primary/20", icon: Package, label: "Dalam Proses" },
  Completed: { color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2, label: "Selesai" },
  Cancelled: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle, label: "Dibatalkan" },
};

const PAYMENT_CONFIG: Record<string, { color: string; label: string }> = {
  Unpaid: { color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", label: "Belum Dibayar" },
  Paid: { color: "bg-green-500/10 text-green-600 border-green-500/20", label: "Lunas" },
  Partial: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "Sebagian" },
};

const TIMELINE_STEPS = ["Pending", "Confirmed", "In Progress", "Completed"];

function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIdx = TIMELINE_STEPS.indexOf(currentStatus);
  const isCancelled = currentStatus === "Cancelled";

  return (
    <div className="flex items-center gap-1 w-full">
      {TIMELINE_STEPS.map((step, i) => {
        const isPast = !isCancelled && i <= currentIdx;
        const config = STATUS_CONFIG[step];
        return (
          <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all text-xs font-bold",
              isCancelled
                ? "border-muted bg-muted text-muted-foreground"
                : isPast
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground"
            )}>
              {i + 1}
            </div>
            <span className={cn("text-[10px] font-medium text-center", isPast && !isCancelled ? "text-foreground" : "text-muted-foreground")}>
              {config?.label || step}
            </span>
            {i < TIMELINE_STEPS.length - 1 && (
              <div className={cn(
                "absolute h-0.5 top-4",
                isPast && !isCancelled && i < currentIdx ? "bg-primary" : "bg-border"
              )} style={{ width: "calc(100% - 2rem)", left: "calc(50% + 1rem)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderResult({ order }: { order: TrackedOrder }) {
  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
  const paymentCfg = PAYMENT_CONFIG[order.payment_status] || PAYMENT_CONFIG.Unpaid;
  const StatusIcon = statusCfg.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary via-primary/60 to-primary/20" />
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Nomor Pesanan</p>
              <p className="text-xl font-bold font-mono text-foreground">{order.order_number}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={cn("text-xs", statusCfg.color)}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusCfg.label}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", paymentCfg.color)}>
                <CreditCard className="w-3 h-3 mr-1" />
                {paymentCfg.label}
              </Badge>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <OrderTimeline currentStatus={order.status} />
          </div>

          {/* Details Grid */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl bg-muted/50 p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Nama Customer</p>
              <p className="text-sm font-medium text-foreground">{order.customer_name}</p>
            </div>
            {order.service_templates && (
              <div className="rounded-xl bg-muted/50 p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Layanan</p>
                <p className="text-sm font-medium text-foreground">{order.service_templates.name}</p>
                {order.service_templates.category && (
                  <p className="text-xs text-muted-foreground">{order.service_templates.category}</p>
                )}
              </div>
            )}
            <div className="rounded-xl bg-muted/50 p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-bold text-primary">Rp {order.total.toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Tanggal Pesanan</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Features */}
          {order.selected_features && order.selected_features.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Add-on yang Dipilih</p>
              <div className="flex flex-wrap gap-1.5">
                {order.selected_features.map((f) => (
                  <Badge key={f.id} variant="secondary" className="text-xs">
                    {f.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Ada pertanyaan tentang pesanan Anda?
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button asChild variant="outline" size="sm">
            <Link to="/help">Help & FAQ</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/templates">
              Jelajahi Layanan Lainnya <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("track-order", {
        body: { order_number: orderNumber.trim(), email: email.trim() },
      });

      if (fnError) {
        setError("Gagal menghubungi server. Silakan coba lagi.");
        return;
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      setOrder(data.order);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorefrontLayout>
      <div className="space-y-0">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
          <div className="relative max-w-2xl mx-auto px-4 lg:px-8 py-16 text-center space-y-6">
            <Badge variant="secondary">
              <Package className="w-3 h-3 mr-1" /> Order Tracking
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Lacak Pesanan Anda
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Masukkan nomor pesanan dan email untuk melihat status terkini.
            </p>

            {/* Search Form */}
            <form onSubmit={handleTrack} className="max-w-md mx-auto space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Nomor Pesanan (contoh: ORD-0001)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="pl-10 rounded-xl uppercase"
                  required
                />
              </div>
              <Input
                type="email"
                placeholder="Email yang digunakan saat checkout"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
                required
              />
              <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mencari...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" /> Lacak Pesanan
                  </>
                )}
              </Button>
            </form>
          </div>
        </section>

        {/* Results */}
        <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-center space-y-2 animate-fade-in">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <p className="text-sm font-medium text-destructive">{error}</p>
              <p className="text-xs text-muted-foreground">
                Pastikan nomor pesanan dan email sudah benar.
              </p>
            </div>
          )}

          {order && <OrderResult order={order} />}

          {!order && !error && !loading && (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground">
                Masukkan nomor pesanan dan email Anda di atas untuk mulai melacak.
              </p>
            </div>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
}
