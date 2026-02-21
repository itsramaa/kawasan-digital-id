import { useEffect, useMemo, useId } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { useTemplateDetail } from "@/features/storefront/hooks/useTemplateDetail";
import { useCreateOrder } from "@/features/storefront/hooks/useCreateOrder";
import { useCart } from "@/features/storefront/hooks/useCart";
import { useAuth } from "@/features/auth/AuthContext";
import { Input } from "@/shared/components/ui/input";
import { HeroBanner } from "@/shared/components/common/HeroBanner";
import { CheckoutStepper } from "@/features/storefront/components/CheckoutStepper";
import { CheckoutOrderSummary } from "@/features/storefront/components/CheckoutOrderSummary";
import { Loader2, LogIn, CreditCard } from "lucide-react";

const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  customer_email: z.string().trim().email("Email tidak valid").max(255),
  customer_phone: z.string().trim().max(20).optional().or(z.literal("")),
  customer_company: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  payment_method: z.enum(["manual", "online"]),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

interface OrderItem {
  template_id: string;
  template_name: string;
  base_price: number;
  selected_features: Array<{ id: string; name: string; price: number }>;
  category: string | null;
  estimated_days: number | null;
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const { items: cartItems, isLoading: cartLoading, clearCart } = useCart();
  const formId = useId();

  // Determine mode: single template vs cart
  const templateId = searchParams.get("template_id") ?? "";
  const featureIds = searchParams.get("features")?.split(",").filter(Boolean) ?? [];
  const isSingleMode = !!templateId;

  const { template, features, isLoading: templateLoading } = useTemplateDetail(templateId || undefined);
  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: "manual" },
  });

  // Pre-fill from profile
  useEffect(() => {
    if (profile) {
      setValue("customer_name", profile.full_name || "");
      setValue("customer_email", profile.email || "");
      if (profile.phone) setValue("customer_phone", profile.phone);
    }
  }, [profile, setValue]);

  const paymentMethod = watch("payment_method");

  // Build order items from either mode
  const orderItems: OrderItem[] = useMemo(() => {
    if (isSingleMode && template) {
      const selectedFeatures = features.filter((f) => f.is_included || featureIds.includes(f.id));
      return [{
        template_id: template.id,
        template_name: template.name,
        base_price: template.base_price,
        selected_features: selectedFeatures.map((f) => ({ id: f.id, name: f.name, price: f.is_included ? 0 : f.price })),
        category: template.category,
        estimated_days: template.estimated_days,
      }];
    }
    if (!isSingleMode && cartItems.length > 0) {
      return cartItems.map((item) => ({
        template_id: item.template_id,
        template_name: item.template_name,
        base_price: item.base_price,
        selected_features: item.selected_features,
        category: item.category,
        estimated_days: item.estimated_days,
      }));
    }
    return [];
  }, [isSingleMode, template, features, featureIds, cartItems]);

  const total = orderItems.reduce((sum, item) => {
    const fc = item.selected_features.reduce((s, f) => s + f.price, 0);
    return sum + item.base_price + fc;
  }, 0);

  const isLoading = authLoading || (isSingleMode ? templateLoading : cartLoading);

  // Auth gate
  if (!authLoading && !user) {
    const redirectUrl = `/checkout${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    return (
      <StorefrontLayout>
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Login Diperlukan</h1>
          <p className="text-muted-foreground">
            Anda perlu login untuk menyelesaikan pesanan. Item keranjang Anda akan tetap tersimpan.
          </p>
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Login untuk Melanjutkan
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const onSubmit = async (values: CheckoutValues) => {
    if (!user || orderItems.length === 0) return;
    try {
      const orderNumbers: string[] = [];
      for (const item of orderItems) {
        const subtotal = item.base_price + item.selected_features.reduce((s, f) => s + f.price, 0);
        const result = await createOrder.mutateAsync({
          customer_name: values.customer_name,
          customer_email: values.customer_email,
          customer_phone: values.customer_phone || undefined,
          customer_company: values.customer_company || undefined,
          template_id: item.template_id,
          selected_features: item.selected_features.map((f) => ({ id: f.id, name: f.name, price: f.price })),
          notes: values.notes || undefined,
          subtotal,
          total: subtotal,
          payment_method: values.payment_method,
          user_id: user.id,
        });
        if (result.order_number) orderNumbers.push(result.order_number);
      }
      await clearCart();
      const params = new URLSearchParams();
      if (orderNumbers.length) params.set("orders", orderNumbers.join(","));
      params.set("total", total.toString());
      params.set("count", orderItems.length.toString());
      navigate(`/order-success?${params.toString()}`);
    } catch {
      // error handled by mutation state
    }
  };

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse space-y-6">
          <div className="h-20 bg-muted rounded-xl" />
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-4">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-48 bg-muted rounded-xl" />
              <div className="h-32 bg-muted rounded-xl" />
            </div>
            <div className="lg:col-span-2">
              <div className="h-64 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (orderItems.length === 0) {
    return (
      <StorefrontLayout>
        <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
          <p className="text-muted-foreground">
            Tidak ada item untuk di-checkout.{" "}
            <Link to="/templates" className="text-primary hover:underline">Jelajahi layanan kami</Link>
          </p>
        </div>
      </StorefrontLayout>
    );
  }

  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const phoneId = `${formId}-phone`;
  const companyId = `${formId}-company`;
  const notesId = `${formId}-notes`;

  return (
    <StorefrontLayout>
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Hero */}
        <HeroBanner
          icon={CreditCard}
          title="Checkout"
          subtitle={`${orderItems.length} layanan siap dipesan`}
          breadcrumb="Home › Keranjang › Checkout"
        />

        {/* Stepper */}
        <CheckoutStepper activeStep={1} />

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-5">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h2 className="font-semibold text-foreground">Informasi Kontak</h2>
              <div>
                <label htmlFor={nameId} className="text-sm font-medium text-foreground">Nama *</label>
                <Input id={nameId} {...register("customer_name")} placeholder="Nama lengkap Anda" className="mt-1" />
                {errors.customer_name && <p role="alert" className="text-xs text-destructive mt-1">{errors.customer_name.message}</p>}
              </div>
              <div>
                <label htmlFor={emailId} className="text-sm font-medium text-foreground">Email *</label>
                <Input id={emailId} {...register("customer_email")} type="email" placeholder="email@contoh.com" className="mt-1" />
                {errors.customer_email && <p role="alert" className="text-xs text-destructive mt-1">{errors.customer_email.message}</p>}
              </div>
              <div>
                <label htmlFor={phoneId} className="text-sm font-medium text-foreground">Telepon</label>
                <Input id={phoneId} {...register("customer_phone")} placeholder="+62..." className="mt-1" />
              </div>
              <div>
                <label htmlFor={companyId} className="text-sm font-medium text-foreground">Perusahaan</label>
                <Input id={companyId} {...register("customer_company")} placeholder="Nama perusahaan" className="mt-1" />
              </div>
              <div>
                <label htmlFor={notesId} className="text-sm font-medium text-foreground">Catatan</label>
                <textarea
                  id={notesId}
                  {...register("notes")}
                  placeholder="Catatan atau kebutuhan tambahan..."
                  rows={3}
                  className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h2 className="font-semibold text-foreground">Metode Pembayaran</h2>
              <div role="group" aria-label="Pilih metode pembayaran" className="grid grid-cols-2 gap-3">
                {[
                  { value: "manual" as const, label: "Minta Invoice", desc: "Kami akan mengirim invoice" },
                  { value: "online" as const, label: "Bayar Online", desc: "Bayar langsung via payment gateway" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <input type="radio" value={opt.value} {...register("payment_method")} className="sr-only" />
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={createOrder.isPending}
              aria-label="Buat pesanan"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createOrder.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
              ) : (
                "Buat Pesanan"
              )}
            </button>
            {createOrder.isError && (
              <p role="alert" className="text-sm text-destructive text-center">Gagal membuat pesanan. Silakan coba lagi.</p>
            )}
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <CheckoutOrderSummary items={orderItems} total={total} />
          </div>
        </form>
      </div>
    </StorefrontLayout>
  );
}
