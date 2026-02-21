import { useEffect } from "react";
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
import { Loader2, LogIn } from "lucide-react";

const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, "Name min 2 chars").max(100),
  customer_email: z.string().trim().email("Invalid email").max(255),
  customer_phone: z.string().trim().max(20).optional().or(z.literal("")),
  customer_company: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  payment_method: z.enum(["manual", "online"]),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const { clearCart } = useCart();

  const templateId = searchParams.get("template_id") ?? "";
  const featureIds = searchParams.get("features")?.split(",").filter(Boolean) ?? [];
  const { template, features, isLoading } = useTemplateDetail(templateId || undefined);
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

  const selectedFeatures = features.filter((f) => f.is_included || featureIds.includes(f.id));
  const optionalSelected = features.filter((f) => !f.is_included && featureIds.includes(f.id));
  const additionalCost = optionalSelected.reduce((sum, f) => sum + f.price, 0);
  const subtotal = (template?.base_price ?? 0) + additionalCost;
  const total = subtotal;

  // Auth gate: must be logged in
  if (!authLoading && !user) {
    const redirectUrl = `/checkout?${searchParams.toString()}`;
    return (
      <StorefrontLayout>
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
          <LogIn className="w-12 h-12 mx-auto text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Login Required</h1>
          <p className="text-muted-foreground">
            You need to log in to complete your order. Your cart items will be preserved.
          </p>
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Login to Continue
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const onSubmit = async (values: CheckoutValues) => {
    if (!template || !user) return;
    try {
      await createOrder.mutateAsync({
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone || undefined,
        customer_company: values.customer_company || undefined,
        template_id: template.id,
        selected_features: selectedFeatures.map((f) => ({ id: f.id, name: f.name, price: f.price })),
        notes: values.notes || undefined,
        subtotal,
        total,
        payment_method: values.payment_method,
        user_id: user.id,
      });
      await clearCart();
      navigate("/order-success");
    } catch (e) {
      // error handled by mutation
    }
  };

  if (isLoading || authLoading) {
    return (
      <StorefrontLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </StorefrontLayout>
    );
  }

  if (!template) {
    return (
      <StorefrontLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-muted-foreground">
          <p>No template selected. <a href="/templates" className="text-primary hover:underline">Browse templates</a></p>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-5">
            <div className="space-y-4">
              <h2 className="font-semibold text-foreground">Contact Information</h2>
              <div>
                <label className="text-sm font-medium text-foreground">Name *</label>
                <Input {...register("customer_name")} placeholder="Your full name" className="mt-1" />
                {errors.customer_name && <p className="text-xs text-destructive mt-1">{errors.customer_name.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email *</label>
                <Input {...register("customer_email")} type="email" placeholder="you@email.com" className="mt-1" />
                {errors.customer_email && <p className="text-xs text-destructive mt-1">{errors.customer_email.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input {...register("customer_phone")} placeholder="+62..." className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Company</label>
                <Input {...register("customer_company")} placeholder="Company name" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Notes</label>
                <textarea
                  {...register("notes")}
                  placeholder="Any additional notes or requirements..."
                  rows={3}
                  className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-semibold text-foreground">Payment Method</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "manual" as const, label: "Request Invoice", desc: "We'll send you an invoice" },
                  { value: "online" as const, label: "Pay Online", desc: "Pay now via payment gateway" },
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createOrder.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                "Place Order"
              )}
            </button>
            {createOrder.isError && (
              <p className="text-sm text-destructive text-center">Failed to place order. Please try again.</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 lg:sticky lg:top-24">
              <h3 className="font-semibold text-foreground">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{template.name}</span>
                  <span>Rp {template.base_price.toLocaleString("id-ID")}</span>
                </div>
                {optionalSelected.map((f) => (
                  <div key={f.id} className="flex justify-between">
                    <span className="text-muted-foreground">{f.name}</span>
                    <span>+Rp {f.price.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </StorefrontLayout>
  );
}
