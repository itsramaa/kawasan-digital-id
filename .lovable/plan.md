

## Plan: Align Landing Services with Storefront Content

### Remaining Mismatches Found

| Issue | Landing Page | Storefront | Fix |
|---|---|---|---|
| **Services list mismatch** | ServicesPage has 4 services: Template, Custom, Maintenance, SEO & Digital Marketing | Storefront offers: Templates (6 categories), Custom Website, Add-ons (SEO, Extra Page, Speed Opt, Maintenance) | Landing services must reflect exactly what storefront sells -- 3 core services + add-ons as features, not a 4th service |
| **Pricing mismatch** | ServicesPage hardcodes 3 tiers (Rp 2.5jt / 7.5jt / 15jt) with static features | Storefront has dynamic pricing from DB (`service_templates.base_price`) + add-on pricing (500rb, 300rb, 400rb, 200rb/bln) | Remove static pricing from Landing (conflicts with real storefront prices). Replace with "mulai dari" teaser linking to storefront |
| **Category mismatch** | LandingHome "Services Overview" shows 3 generic cards (Template, Custom, Maintenance) | Storefront CategorySection has 6 specific categories (Ecommerce, Company Profile, Landing Page, Portfolio, Blog, UMKM) | Landing services teaser should reference the same 6 categories |
| **Add-on content duplication** | ServicesPage Maintenance card features overlap with Storefront AddOnSection items | Add-ons exist only in storefront | Landing should reference add-ons without duplicating details |
| **"SEO & Digital Marketing" service** | Listed as 4th service on ServicesPage | Not sold as standalone in storefront -- SEO is an add-on (Rp 500rb) | Remove as standalone service, mention as part of add-ons |
| **Custom features mismatch** | ServicesPage Custom card: "Analisis kebutuhan, UI/UX custom, API, Testing" | Storefront CustomHighlight: "Desain Eksklusif, Full Ownership, SEO Ready, Clean Code, Support Prioritas" | Align feature lists |
| **CTA links** | ServicesPage links to `/templates` and `/custom` | Correct storefront routes | OK, these match |

### Changes

#### 1. `ServicesPage.tsx` -- Major content alignment
- **Services grid**: Reduce to 3 services matching storefront: Template Website, Custom Development, Maintenance & Support
  - Template card: features match storefront categories (Ecommerce, Company Profile, Landing Page, etc.), CTA links to `/templates`
  - Custom card: features match storefront CustomHighlight (Desain Eksklusif, Full Ownership, SEO Ready, Clean Code, Support Prioritas), CTA links to `/custom`
  - Maintenance card: features match storefront AddOnSection items (SEO Setup, Extra Page, Speed Optimization, Maintenance Plan)
- **Remove**: Static pricing section entirely (conflicts with dynamic storefront prices)
- **Add**: Simple "Harga" teaser section -- 1 card per service showing "mulai dari Rp X" with CTA to storefront, pulling price context from what storefront actually charges
- **Keep**: Tech Stack, CTA sections (no changes)

#### 2. `LandingHome.tsx` -- Services overview alignment
- Update the 3 service cards to briefly mention storefront categories (e.g., "Template: Ecommerce, Company Profile, Landing Page, dan lainnya")
- Ensure descriptions match storefront messaging

### Files to modify
1. `src/pages/landing/ServicesPage.tsx` -- Align services, remove static pricing, add teaser pricing
2. `src/pages/landing/LandingHome.tsx` -- Update service card descriptions

