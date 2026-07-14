'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckoutStepper } from '@/src/features/storefront/components/CheckoutStepper';
import { CheckoutTrustSignals } from '@/src/features/storefront/components/CheckoutTrustSignals';
import { CheckoutOrderSummary } from '@/src/features/storefront/components/CheckoutOrderSummary';
import { useCart } from '@/src/features/storefront/hooks/useCart';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

const emptyForm: ContactForm = { name: '', email: '', phone: '', company: '', notes: '' };

export default function CheckoutClient() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(0); // 0 = contact info, 1 = review
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-muted-foreground text-lg">Belanja dulu yuk 🛍️</p>
        <Button asChild>
          <Link href="/templates">Lihat Templates</Link>
        </Button>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function placeOrder() {
    setLoading(true);
    // ponytail: mock — replace with server action / API call when backend ready
    await new Promise((r) => setTimeout(r, 800));
    clearCart();
    router.push('/orders/success');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <CheckoutStepper activeStep={step + 1} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">

          {step === 0 && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Informasi Kontak</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    No. WhatsApp <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="08xxxxxxxxxx"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="company" className="text-sm font-medium text-foreground">
                    Nama Perusahaan
                  </label>
                  <input
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="PT. Contoh"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="notes" className="text-sm font-medium text-foreground">
                  Catatan Tambahan
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tuliskan kebutuhan khusus atau pertanyaan Anda..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary border-0"
                disabled={!form.name || !form.email || !form.phone}
                onClick={() => setStep(1)}
              >
                Lanjutkan
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Review Pesanan</h2>

              <dl className="text-sm space-y-1">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Nama</dt>
                  <dd className="font-medium">{form.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">{form.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">WhatsApp</dt>
                  <dd className="font-medium">{form.phone}</dd>
                </div>
                {form.company && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Perusahaan</dt>
                    <dd className="font-medium">{form.company}</dd>
                  </div>
                )}
                {form.notes && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground shrink-0">Catatan</dt>
                    <dd className="font-medium text-right">{form.notes}</dd>
                  </div>
                )}
              </dl>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                  Kembali
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-secondary border-0"
                  disabled={loading}
                  onClick={placeOrder}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Konfirmasi Pesanan'
                  )}
                </Button>
              </div>
            </div>
          )}

          <CheckoutTrustSignals />
        </div>

        <div className="lg:col-span-1">
          <CheckoutOrderSummary items={items} total={totalPrice} showEditLink />
        </div>
      </div>
    </div>
  );
}
