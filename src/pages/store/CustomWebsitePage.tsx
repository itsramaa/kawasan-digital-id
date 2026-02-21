import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { Progress } from "@/shared/components/ui/progress";
import { Slider } from "@/shared/components/ui/slider";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/shared/utils/utils";

/* ─── Constants ─── */

const INDUSTRIES = ["Technology", "F&B", "Fashion", "Health", "Education", "Real Estate", "Finance", "Other"];

const WEBSITE_TYPES = [
  { value: "Company Profile", base: 3_000_000, baseDays: 14 },
  { value: "Ecommerce", base: 7_000_000, baseDays: 21 },
  { value: "Landing Page", base: 2_000_000, baseDays: 7 },
  { value: "Portfolio", base: 2_500_000, baseDays: 10 },
  { value: "Blog", base: 2_000_000, baseDays: 10 },
  { value: "Web App", base: 10_000_000, baseDays: 30 },
];

const FEATURES = [
  { value: "Ecommerce / Product Catalog", price: 3_000_000, days: 7 },
  { value: "Payment Gateway Integration", price: 2_000_000, days: 5 },
  { value: "Multi-language Support", price: 1_500_000, days: 4 },
  { value: "Membership / Login System", price: 2_500_000, days: 5 },
  { value: "Booking / Appointment System", price: 2_000_000, days: 5 },
  { value: "Blog / News Section", price: 1_000_000, days: 3 },
  { value: "Contact Form", price: 500_000, days: 1 },
  { value: "Live Chat Integration", price: 1_000_000, days: 2 },
];

const DEADLINES = ["ASAP", "2 Minggu", "1 Bulan", "2 Bulan", "Fleksibel"];

const BUDGETS = [
  "Rp 3 - 5 Juta",
  "Rp 5 - 10 Juta",
  "Rp 10 - 20 Juta",
  "Rp 20 Juta+",
  "Belum Tahu",
];

const STEP_LABELS = ["Basic Info", "Features", "Timeline & Budget", "Summary"];

/* ─── Estimation Logic ─── */

function estimate(
  websiteType: string,
  pages: number,
  features: string[]
) {
  const wt = WEBSITE_TYPES.find((w) => w.value === websiteType);
  const basePrice = wt?.base ?? 3_000_000;
  const baseDays = wt?.baseDays ?? 14;

  const extraPages = Math.max(0, pages - 5);
  const pageCost = extraPages * 500_000;
  const pageDays = extraPages * 2;

  let featureCostMin = 0;
  let featureCostMax = 0;
  let featureDays = 0;
  for (const f of features) {
    const fd = FEATURES.find((ft) => ft.value === f);
    if (fd) {
      featureCostMin += fd.price * 0.8;
      featureCostMax += fd.price;
      featureDays += fd.days;
    }
  }

  return {
    priceMin: Math.round(basePrice + pageCost + featureCostMin),
    priceMax: Math.round(basePrice + pageCost + featureCostMax),
    daysMin: baseDays + pageDays + Math.round(featureDays * 0.7),
    daysMax: baseDays + pageDays + featureDays,
  };
}

/* ─── Page Component ─── */

export default function CustomWebsitePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Step 1
  const [industry, setIndustry] = useState("");
  const [websiteType, setWebsiteType] = useState("");
  const [pages, setPages] = useState(5);

  // Step 2
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Step 3
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");

  const toggleFeature = (f: string) =>
    setSelectedFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  const canNext =
    step === 0 ? industry !== "" && websiteType !== "" :
    step === 1 ? true :
    step === 2 ? deadline !== "" && budget !== "" :
    true;

  const est = estimate(websiteType, pages, selectedFeatures);

  const handleDeposit = () => {
    const params = new URLSearchParams({
      mode: "custom",
      industry,
      websiteType,
      pages: String(pages),
      features: selectedFeatures.join(","),
      deadline,
      budget,
      priceMin: String(est.priceMin),
      priceMax: String(est.priceMax),
      daysMin: String(est.daysMin),
      daysMax: String(est.daysMax),
    });
    navigate(`/store/checkout?${params.toString()}`);
  };

  return (
    <StorefrontLayout>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Custom Website</h1>
          <p className="text-muted-foreground text-sm">
            Ceritakan kebutuhan Anda dan dapatkan estimasi harga & timeline instan.
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            {STEP_LABELS.map((label, i) => (
              <span key={label} className={cn(i <= step && "text-primary font-semibold")}>
                {label}
              </span>
            ))}
          </div>
          <Progress value={((step + 1) / STEP_LABELS.length) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          {step === 0 && (
            <>
              {/* Industry */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Pilih industry...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* Website Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Website Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {WEBSITE_TYPES.map((wt) => (
                    <button
                      key={wt.value}
                      onClick={() => setWebsiteType(wt.value)}
                      className={cn(
                        "rounded-lg border p-3 text-sm font-medium text-left transition-all",
                        websiteType === wt.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-foreground hover:border-primary/40"
                      )}
                    >
                      {wt.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pages */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Estimated Pages: <span className="text-primary">{pages}</span>
                </label>
                <Slider
                  value={[pages]}
                  onValueChange={([v]) => setPages(v)}
                  min={1}
                  max={20}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span><span>20</span>
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Pilih Fitur yang Dibutuhkan</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {FEATURES.map((f) => {
                  const checked = selectedFeatures.includes(f.value);
                  return (
                    <button
                      key={f.value}
                      onClick={() => toggleFeature(f.value)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 text-sm text-left transition-all",
                        checked
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/40"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0",
                        checked ? "bg-primary border-primary" : "border-muted-foreground/30"
                      )}>
                        {checked && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div>
                        <span className={cn("font-medium", checked ? "text-primary" : "text-foreground")}>
                          {f.value}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          +Rp {f.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Deadline</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DEADLINES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDeadline(d)}
                      className={cn(
                        "rounded-lg border p-3 text-sm font-medium transition-all",
                        deadline === d
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-foreground hover:border-primary/40"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Budget Range</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={cn(
                        "rounded-lg border p-3 text-sm font-medium transition-all",
                        budget === b
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-foreground hover:border-primary/40"
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Scope Summary
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-muted-foreground">Industry</div>
                  <div className="font-medium text-foreground">{industry}</div>
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium text-foreground">{websiteType}</div>
                  <div className="text-muted-foreground">Pages</div>
                  <div className="font-medium text-foreground">~{pages} halaman</div>
                  <div className="text-muted-foreground">Deadline</div>
                  <div className="font-medium text-foreground">{deadline}</div>
                  <div className="text-muted-foreground">Budget</div>
                  <div className="font-medium text-foreground">{budget}</div>
                </div>
                {selectedFeatures.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Features</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeatures.map((f) => (
                        <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-muted/50 border border-border p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Price</span>
                  <span className="font-bold text-primary">
                    Rp {est.priceMin.toLocaleString("id-ID")} – Rp {est.priceMax.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Timeline</span>
                  <span className="font-bold text-foreground">
                    {est.daysMin} – {est.daysMax} hari
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              step === 0
                ? "text-muted-foreground/40 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => canNext && setStep(step + 1)}
              disabled={!canNext}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                canNext
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/store"
                className="px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:bg-muted transition-colors"
              >
                Contact Us
              </Link>
              <button
                onClick={handleDeposit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Pay Deposit to Start <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
}
