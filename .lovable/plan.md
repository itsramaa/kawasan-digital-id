

## Plan: De-duplicate & Align Landing Pages with Storefront

### Audit Results -- Duplications Found

| Duplicated Content | Where It Appears | Resolution |
|---|---|---|
| **Stats counters** (50+ Klien, 100+ Proyek, etc.) | Landing Home, About Page, Portfolio Page, Storefront Hero | Keep only in: Landing Home (company-level) + Storefront Hero (social proof). Remove from About & Portfolio |
| **CTA gradient section** (identical design) | Landing Home, Services, Portfolio, Storefront FinalCTA | Keep in Storefront FinalCTA. Landing pages get unique CTAs per page (not identical copies) |
| **Process/How It Works** | Storefront HowItWorks (detailed 4-phase), Services "Proses Kerja Kami" (4-step) | Keep detailed version in Storefront only. Remove from Services page |
| **FAQ sections** | Storefront FAQ, Services FAQ, Contact FAQ | Keep Storefront FAQ (product). Services FAQ overlaps with Contact FAQ -- merge into Contact only |
| **"Why Us" / Values** | Landing Home "Mengapa Kawasan Digital" (4 cards), About "Nilai-Nilai Kami" (4 cards) | Keep "Why Us" in Landing Home (customer-facing benefits). Keep "Values" in About (internal culture). Make content clearly distinct |
| **Services overview** | Landing Home "Layanan Kami" (3 cards), Services page (4 cards) | Landing Home becomes a teaser (3 cards pointing to Services). Services page is the full detail. Remove overlap in descriptions |
| **Portfolio teaser** | Landing Home "Hasil Karya Kami" (3 static cards) | Keep as teaser -- this is intentional (links to full portfolio page) |
| **`useCounter` hook** | Duplicated in 3 files | Extract to shared hook |

### Inconsistent Data

| Issue | Fix |
|---|---|
| "50+ Klien" in Landing vs "100+ Proyek" in About -- confusing overlap | Landing: company metrics (Klien, Website, Kepuasan, Support). About: remove stat section entirely |
| Storefront Hero: "50+ Klien, 100+ Website, 4.9 Rating" vs Landing: same numbers | OK -- both are social proof but for different audiences |

### Changes Per File

#### 1. `src/shared/hooks/useCounter.ts` (NEW)
- Extract the duplicated `useCounter` hook into shared location

#### 2. `LandingHome.tsx`
- Import `useCounter` from shared hook
- Keep: Hero, Marquee, Stats, Why Us, Services teaser, Device Preview, Portfolio teaser
- **Change CTA**: Make it unique -- "Siap Mulai?" with buttons to `/` (storefront) and `/landing/contact`, remove identical gradient bubble decorations, use a different layout (e.g., side-by-side text + illustration instead of centered)

#### 3. `AboutPage.tsx`
- Import `useCounter` from shared hook
- **Remove**: Achievement Stats section (duplicates Landing Home stats)
- **Remove**: Tech Stack section (move to Services page where it's more relevant)
- Keep: Hero, Vision/Mission, Values, Team, Timeline
- These are all unique company-culture content with no storefront overlap

#### 4. `ServicesPage.tsx`
- **Remove**: Process Timeline section (duplicates Storefront HowItWorks)
- **Remove**: FAQ section (overlaps with Contact FAQ and Storefront FAQ)
- **Add**: Tech Stack section (moved from About -- fits better here as "what we build with")
- **Change CTA**: Unique wording, link to `/landing/contact` for consultation
- Keep: Hero, Services Grid, Pricing

#### 5. `PortfolioPage.tsx`
- Import `useCounter` from shared hook
- **Remove**: Stats Banner (duplicates Landing Home stats)
- **Change CTA**: Unique design -- not the same gradient bubble pattern as every other page
- Keep: Hero, Category filter, Project grid

#### 6. `ContactPage.tsx`
- **Merge in**: Service FAQ questions from ServicesPage (the 4 questions about template vs custom, maintenance, upgrades, etc.)
- Combine with existing pre-sales FAQ into one comprehensive "Pertanyaan Umum" section
- Keep everything else as-is

### Summary of Removals
- About: -2 sections (stats, tech stack)
- Services: -2 sections (process, FAQ), +1 section (tech stack from About)
- Portfolio: -1 section (stats)
- Contact: expand FAQ with merged questions
- All: extract shared `useCounter` hook, differentiate CTA sections

