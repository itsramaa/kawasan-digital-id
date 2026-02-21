import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { Slider } from "@/shared/components/ui/slider";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";
import {
  ArrowLeft, ArrowRight, Check, Sparkles, ClipboardList, Settings, Calendar,
  FileCheck, Zap, Clock, MessageSquare, Search, Monitor, Cpu, GraduationCap,
  Building2, Heart, ShoppingBag, Landmark, DollarSign, MoreHorizontal,
  Globe, ShoppingCart, CreditCard, Languages, UserCheck, CalendarCheck,
  Newspaper, Mail, MessageCircle, Timer, Hourglass, CalendarDays, CalendarRange,
  Infinity, Shield, RotateCcw, FileText, Target, Users, Headphones, Award,
  FileQuestion,
} from "lucide-react";
import { cn } from "@/shared/utils/utils";

/* ─── Constants ─── */

const INDUSTRIES = [
  { value: "Technology", icon: Cpu },
  { value: "F&B", icon: ShoppingBag },
  { value: "Fashion", icon: Award },
  { value: "Health", icon: Heart },
  { value: "Education", icon: GraduationCap },
  { value: "Real Estate", icon: Building2 },
  { value: "Finance", icon: Landmark },
  { value: "Other", icon: MoreHorizontal },
];

const WEBSITE_TYPES = [
  { value: "Company Profile", base: 3_000_000, baseDays: 14, desc: "Profil perusahaan profesional" },
  { value: "Ecommerce", base: 7_000_000, baseDays: 21, desc: "Toko online lengkap" },
  { value: "Landing Page", base: 2_000_000, baseDays: 7, desc: "Halaman promosi konversi tinggi" },
  { value: "Portfolio", base: 2_500_000, baseDays: 10, desc: "Showcase karya & proyek" },
  { value: "Blog", base: 2_000_000, baseDays: 10, desc: "Platform konten & artikel" },
  { value: "Web App", base: 10_000_000, baseDays: 30, desc: "Aplikasi web interaktif" },
];

const FEATURES = [
  { value: "Ecommerce / Product Catalog", price: 3_000_000, days: 7, icon: ShoppingCart, popular: true },
  { value: "Payment Gateway Integration", price: 2_000_000, days: 5, icon: CreditCard, popular: true },
  { value: "Multi-language Support", price: 1_500_000, days: 4, icon: Languages, popular: false },
  { value: "Membership / Login System", price: 2_500_000, days: 5, icon: UserCheck, popular: false },
  { value: "Booking / Appointment System", price: 2_000_000, days: 5, icon: CalendarCheck, popular: false },
  { value: "Blog / News Section", price: 1_000_000, days: 3, icon: Newspaper, popular: false },
  { value: "Contact Form", price: 500_000, days: 1, icon: Mail, popular: false },
  { value: "Live Chat Integration", price: 1_000_000, days: 2, icon: MessageCircle, popular: false },
];

const DEADLINES = [
  { value: "ASAP", icon: Zap, desc: "Secepatnya" },
  { value: "2 Minggu", icon: Timer, desc: "Timeline ketat" },
  { value: "1 Bulan", icon: CalendarDays, desc: "Standar" },
  { value: "2 Bulan", icon: CalendarRange, desc: "Lebih fleksibel" },
  { value: "Fleksibel", icon: Infinity, desc: "Tanpa batas waktu" },
];

const BUDGETS = [
  { value: "Rp 3 - 5 Juta", popular: false },
  { value: "Rp 5 - 10 Juta", popular: true },
  { value: "Rp 10 - 20 Juta", popular: false },
  { value: "Rp 20 Juta+", popular: false },
  { value: "Belum Tahu", popular: false },
];

const STEPS = [
  { label: "Basic Info", icon: ClipboardList },
  { label: "Features", icon: Settings },
  { label: "Timeline", icon: Calendar },
  { label: "Summary", icon: FileCheck },
];

const WHY_CUSTOM = [
  { icon: Target, title: "100% Sesuai Kebutuhan", desc: "Dirancang khusus untuk bisnis Anda" },
  { icon: Users, title: "Tim Berpengalaman", desc: "Developer & designer profesional" },
  { icon: Headphones, title: "Support Berkelanjutan", desc: "Dukungan teknis setelah launch" },
  { icon: Shield, title: "Full Ownership", desc: "Source code 100% milik Anda" },
];

/* ─── Estimation Logic ─── */

function estimate(websiteType: string, pages: number, features: string[]) {
  const wt = WEBSITE_TYPES.find((w) => w.value === websiteType);
  const basePrice = wt?.base ?? 3_000_000;
  const baseDays = wt?.baseDays ?? 14;
  const extraPages = Math.max(0, pages - 5);
  const pageCost = extraPages * 500_000;
  const pageDays = extraPages * 2;
  let featureCostMin = 0, featureCostMax = 0, featureDays = 0;
  for (const f of features) {
    const fd = FEATURES.find((ft) => ft.value === f);
    if (fd) { featureCostMin += fd.price * 0.8; featureCostMax += fd.price; featureDays += fd.days; }
  }
  return {
    priceMin: Math.round(basePrice + pageCost + featureCostMin),
    priceMax: Math.round(basePrice + pageCost + featureCostMax),
    daysMin: baseDays + pageDays + Math.round(featureDays * 0.7),
    daysMax: baseDays + pageDays + featureDays,
    basePrice, pageCost, featureCostMin, featureCostMax,
  };
}

/* ─── Sub-components ─── */

function HeroSection() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={cn("rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/3 border border-border p-8 lg:p-10 space-y-4 transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5" /> Custom Website
      </span>
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Wujudkan Website Impian Anda</h1>
      <p className="text-muted-foreground text-sm max-w-xl">Ceritakan kebutuhan bisnis Anda dan dapatkan estimasi harga serta timeline secara instan. Tanpa komitmen.</p>
      <div className="flex flex-wrap gap-4 pt-2">
        {[{ icon: Zap, text: "Estimasi Instan" }, { icon: Shield, text: "Tanpa Komitmen" }, { icon: MessageSquare, text: "Konsultasi Gratis" }].map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="w-3.5 h-3.5 text-primary" />{text}</span>
        ))}
      </div>
    </div>
  );
}

function WhyCustomSection() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
      {WHY_CUSTOM.map(({ icon: Icon, title, desc }, i) => (
        <div key={title} className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/30 hover:shadow-md transition-all" style={{ transitionDelay: `${i * 80}ms` }}>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="w-4.5 h-4.5 text-primary" /></div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      ))}
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between">
      {STEPS.map(({ label, icon: Icon }, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                done ? "bg-primary border-primary" : active ? "border-primary bg-primary/10" : "border-border bg-background"
              )}>
                {done ? <Check className="w-4 h-4 text-primary-foreground" /> : <Icon className={cn("w-4 h-4", active ? "text-primary" : "text-muted-foreground")} />}
              </div>
              <span className={cn("text-[11px] font-medium hidden sm:block", active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-2 rounded transition-colors duration-300", i < step ? "bg-primary" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Page Component ─── */

export default function CustomWebsitePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState("");
  const [websiteType, setWebsiteType] = useState("");
  const [pages, setPages] = useState(5);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");

  const toggleFeature = (f: string) => setSelectedFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const canNext = step === 0 ? industry !== "" && websiteType !== "" : step === 1 ? true : step === 2 ? deadline !== "" && budget !== "" : true;

  const est = estimate(websiteType, pages, selectedFeatures);

  const featureTotal = useMemo(() => {
    let cost = 0, days = 0;
    for (const f of selectedFeatures) { const fd = FEATURES.find(ft => ft.value === f); if (fd) { cost += fd.price; days += fd.days; } }
    return { cost, days };
  }, [selectedFeatures]);

  const handleDeposit = () => {
    const params = new URLSearchParams({ mode: "custom", industry, websiteType, pages: String(pages), features: selectedFeatures.join(","), deadline, budget, priceMin: String(est.priceMin), priceMax: String(est.priceMax), daysMin: String(est.daysMin), daysMax: String(est.daysMax) });
    navigate(`/store/checkout?${params.toString()}`);
  };

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <HeroSection />
        <WhyCustomSection />
        <Stepper step={step} />

        {/* Step Content */}
        <div key={step} className="rounded-xl border border-border bg-card p-6 lg:p-8 space-y-6 animate-fade-in">
          {step === 0 && (
            <>
              {/* Industry */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Pilih Industry</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {INDUSTRIES.map(({ value, icon: Icon }) => (
                    <button key={value} onClick={() => setIndustry(value)} className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all hover:scale-[1.02]",
                      industry === value ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border bg-background text-foreground hover:border-primary/40"
                    )}>
                      <Icon className="w-5 h-5" />{value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Website Type */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Jenis Website</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {WEBSITE_TYPES.map((wt) => (
                    <button key={wt.value} onClick={() => setWebsiteType(wt.value)} className={cn(
                      "rounded-xl border p-4 text-left transition-all hover:scale-[1.02]",
                      websiteType === wt.value ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-background hover:border-primary/40"
                    )}>
                      <div className={cn("text-sm font-semibold", websiteType === wt.value ? "text-primary" : "text-foreground")}>{wt.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{wt.desc}</div>
                      <div className="text-xs text-primary/70 font-medium mt-1.5">Mulai Rp {(wt.base).toLocaleString("id-ID")}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pages */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Jumlah Halaman: <span className="text-primary">{pages}</span></label>
                <Slider value={[pages]} onValueChange={([v]) => setPages(v)} min={1} max={20} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 halaman</span>
                  <span className="text-primary/70">5 halaman sudah termasuk</span>
                  <span>20 halaman</span>
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <label className="text-sm font-semibold text-foreground">Pilih Fitur yang Dibutuhkan</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {FEATURES.map((f) => {
                  const checked = selectedFeatures.includes(f.value);
                  const Icon = f.icon;
                  return (
                    <button key={f.value} onClick={() => toggleFeature(f.value)} className={cn(
                      "relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:scale-[1.01] hover:shadow-sm",
                      checked ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/40"
                    )}>
                      {f.popular && <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">Popular</span>}
                      <div className={cn("w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5", checked ? "bg-primary border-primary" : "border-muted-foreground/30")}>
                        {checked && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4 flex-shrink-0", checked ? "text-primary" : "text-muted-foreground")} />
                          <span className={cn("text-sm font-medium", checked ? "text-primary" : "text-foreground")}>{f.value}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">+Rp {f.price.toLocaleString("id-ID")}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />+{f.days} hari</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* Running total */}
              {selectedFeatures.length > 0 && (
                <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{selectedFeatures.length} fitur dipilih</span>
                  <span className="font-semibold text-primary">+Rp {featureTotal.cost.toLocaleString("id-ID")} · +{featureTotal.days} hari</span>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Deadline</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DEADLINES.map((d) => {
                    const Icon = d.icon;
                    return (
                      <button key={d.value} onClick={() => setDeadline(d.value)} className={cn(
                        "flex items-center gap-3 rounded-xl border p-4 text-left transition-all hover:scale-[1.02]",
                        deadline === d.value ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border bg-background text-foreground hover:border-primary/40"
                      )}>
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">{d.value}</div>
                          <div className="text-xs text-muted-foreground">{d.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Budget Range</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BUDGETS.map((b) => (
                    <button key={b.value} onClick={() => setBudget(b.value)} className={cn(
                      "relative rounded-xl border p-4 text-sm font-medium transition-all hover:scale-[1.02]",
                      budget === b.value ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border bg-background text-foreground hover:border-primary/40"
                    )}>
                      {b.popular && <span className="absolute -top-2 right-3 text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">Populer</span>}
                      {b.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Realtime preview */}
              {websiteType && (
                <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-2">
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" />Estimasi Sementara</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Harga</span>
                    <span className="font-bold text-primary">Rp {est.priceMin.toLocaleString("id-ID")} – {est.priceMax.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Timeline</span>
                    <span className="font-bold text-foreground">{est.daysMin} – {est.daysMax} hari</span>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Left: Detail */}
              <div className="lg:col-span-3 space-y-5">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" />Ringkasan Proyek</h3>
                <div className="space-y-3">
                  {[
                    { icon: Cpu, label: "Industry", val: industry },
                    { icon: Globe, label: "Jenis", val: websiteType },
                    { icon: FileQuestion, label: "Halaman", val: `~${pages} halaman` },
                    { icon: Calendar, label: "Deadline", val: deadline },
                    { icon: DollarSign, label: "Budget", val: budget },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-primary" /></div>
                      <span className="text-muted-foreground w-20">{label}</span>
                      <span className="font-medium text-foreground">{val}</span>
                    </div>
                  ))}
                </div>
                {selectedFeatures.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Fitur Tambahan</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeatures.map((f) => (
                        <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Pricing card */}
              <div className="lg:col-span-2">
                <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-5 space-y-4 lg:sticky lg:top-24">
                  <div className="text-sm font-semibold text-foreground">Estimasi Harga</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Base ({websiteType})</span><span className="font-medium">Rp {est.basePrice.toLocaleString("id-ID")}</span></div>
                    {est.pageCost > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Tambahan halaman</span><span className="font-medium">Rp {est.pageCost.toLocaleString("id-ID")}</span></div>}
                    {selectedFeatures.length > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Fitur ({selectedFeatures.length})</span><span className="font-medium">Rp {featureTotal.cost.toLocaleString("id-ID")}</span></div>}
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-primary">Rp {est.priceMin.toLocaleString("id-ID")} – {est.priceMax.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Timeline</span>
                    <span className="font-bold text-foreground">{est.daysMin} – {est.daysMax} hari</span>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    {[{ icon: Shield, text: "Garansi Uang Kembali" }, { icon: RotateCcw, text: "Revisi Gratis" }, { icon: FileText, text: "NDA Available" }].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="w-3.5 h-3.5 text-primary" />{text}</div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground/70">*Harga final dikonfirmasi setelah konsultasi</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", step === 0 ? "text-muted-foreground/40 cursor-not-allowed" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          {step < 3 ? (
            <button onClick={() => canNext && setStep(step + 1)} disabled={!canNext} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors", canNext ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed")}>
              Lanjut <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-3">
              <Link to="/store" className="px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"><MessageSquare className="w-4 h-4" />Hubungi Kami</Link>
              <button onClick={handleDeposit} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Bayar Deposit <ArrowRight className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
}
