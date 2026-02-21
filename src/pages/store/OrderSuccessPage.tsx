import { Link, useSearchParams } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { CheckCircle, FileText, Clock, Headphones, ArrowRight } from "lucide-react";
import { CheckoutStepper } from "@/features/storefront/components/CheckoutStepper";

const nextSteps = [
  { icon: FileText, title: "Pesanan Diterima", desc: "Tim kami akan meninjau pesanan Anda." },
  { icon: Clock, title: "Proses Pengerjaan", desc: "Kami mulai mengerjakan proyek Anda." },
  { icon: Headphones, title: "Selesai & Dukungan", desc: "Proyek selesai, dukungan penuh tersedia." },
];

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderNumbers = searchParams.get("orders")?.split(",").filter(Boolean) ?? [];
  const total = Number(searchParams.get("total") || 0);
  const count = Number(searchParams.get("count") || 0);

  return (
    <StorefrontLayout>
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <CheckoutStepper activeStep={2} />

        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Pesanan Berhasil Dibuat!</h1>
          <p className="text-muted-foreground">
            Terima kasih atas pesanan Anda. Tim kami akan segera meninjau dan menghubungi Anda melalui email.
          </p>
        </div>

        {/* Order details */}
        {(orderNumbers.length > 0 || total > 0) && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/20" />
            <div className="p-5 space-y-3">
              <h3 className="font-semibold text-foreground text-sm">Detail Pesanan</h3>
              {orderNumbers.length > 0 && (
                <div className="text-sm space-y-1">
                  {orderNumbers.map((num) => (
                    <div key={num} className="flex justify-between">
                      <span className="text-muted-foreground">No. Pesanan</span>
                      <span className="font-mono font-medium text-foreground">{num}</span>
                    </div>
                  ))}
                </div>
              )}
              {count > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jumlah Layanan</span>
                  <span className="font-medium">{count} layanan</span>
                </div>
              )}
              {total > 0 && (
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next steps */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-sm text-center">Langkah Selanjutnya</h3>
          <div className="grid gap-3">
            {nextSteps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <step.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{i + 1}. {step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/client"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            Pantau Pesanan <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/templates"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-border font-medium hover:bg-muted transition-colors text-sm"
          >
            Jelajahi Layanan Lainnya
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-border font-medium hover:bg-muted transition-colors text-sm"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </StorefrontLayout>
  );
}
