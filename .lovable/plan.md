

## Plan: Align Storefront & Landing -- Remove Duplicates, Unify Style

### Problem
Both pages share duplicated sections (How It Works, Testimonials, FAQ, CTA) and have inconsistent visual styling (different max-widths, card styles, icon treatments).

### Content Strategy

**Landing Page (`/landing`)** = Company brand & agency story. Answers "Who is Kawasan Digital?"
**Storefront (`/`)** = Product catalog & buying flow. Answers "What can I buy?"

Each section lives in ONE place only:

| Section | Keep In | Remove From | Reason |
|---------|---------|-------------|--------|
| How It Works (process) | Storefront | Landing | Purchase-flow content belongs in shop |
| Testimonials | Storefront | Landing | Social proof for buying decisions |
| FAQ | Storefront | Landing | Product/purchase FAQ belongs in shop |
| Stats (counters) | Landing | -- | Company credibility, unique to landing |
| Client Marquee | Landing | -- | Brand trust, unique to landing |
| Device Preview | Landing | -- | Showcases capability, unique |
| Why Us (highlights) | Landing | -- | Company differentiators |
| Categories | Storefront | -- | Product browsing |
| Featured Templates | Storefront | -- | Product showcase |
| Add-ons | Storefront | -- | Product upsell |
| Custom Highlight | Storefront | -- | Service upsell |

### Landing Home: Replace removed sections with
- **Services Overview**: 3 cards linking to `/landing/services` (Template, Custom, Maintenance) -- gives landing its own unique content instead of duplicating storefront
- **Portfolio Showcase**: 2-3 highlight cards linking to `/landing/portfolio` -- drives traffic to other landing pages
- Keep: Hero, Client Marquee, Stats, Highlights/Why Us, Device Preview, CTA (reworded to "Kunjungi Storefront")

### Storefront: Visual upgrade to match Landing style
Update all 7 storefront home components to use the same design language:
- `max-w-6xl` → `max-w-7xl` across all sections
- Add `gradient-text` to section headings
- Add `glass-card` + `hover-lift` to cards
- Icon containers: flat `bg-primary/10` → gradient `bg-gradient-to-br from-primary to-primary/70`
- Section backgrounds: add subtle gradient overlays (`from-muted/30 via-background`)
- CTA section: gradient background (`from-primary to-secondary`) instead of flat `bg-primary`

### Files to modify

1. **`LandingHome.tsx`** -- Remove: Process section, Testimonials section, FAQ section. Add: Services Overview cards, Portfolio Showcase cards. Reword CTA.

2. **Storefront components (7 files)** -- Visual upgrade only, no content changes:
   - `HeroSection.tsx` -- gradient text, floating shapes, badge styling
   - `CategorySection.tsx` -- `max-w-7xl`, gradient icon bg, `hover-lift`
   - `FeaturedSection.tsx` -- `max-w-7xl`, `glass-card`, gradient heading
   - `CustomHighlight.tsx` -- `max-w-7xl`, gradient accents
   - `AddOnSection.tsx` -- `max-w-7xl`, `glass-card`, `hover-lift`, gradient icons
   - `TestimonialsSection.tsx` -- `max-w-7xl`, `glass-card`, gradient quote icon, colored stars
   - `FAQSection.tsx` -- `max-w-7xl`, gradient heading, styled accordion
   - `FinalCTA.tsx` -- gradient bg (`from-primary to-secondary`), floating decorative shapes
   - `HowItWorks.tsx` -- gradient phase badges, `glass-card` step cards

### Design tokens used consistently everywhere
- Headings: `gradient-text` class
- Cards: `glass-card hover-lift` + `border border-border`
- Icons: `bg-gradient-to-br from-{color} to-{color}/70`
- Sections: alternating `bg-gradient-to-br from-muted/30` backgrounds
- Container: `max-w-7xl mx-auto px-4 lg:px-8`

