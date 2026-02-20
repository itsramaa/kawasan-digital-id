

# Storefront Publik + Client Dashboard (Dual View)

## Ringkasan

Menambahkan **storefront publik** (tanpa login) di samping client dashboard yang sudah ada. Storefront berfungsi seperti website agency e-commerce: menampilkan portfolio project, katalog template, custom builder (pilih fitur), dan checkout (form order manual + opsi payment gateway).

---

## Arsitektur Dual View

Client sekarang punya 2 entry point:

| View | Route Prefix | Auth | Layout |
|---|---|---|---|
| **Storefront (Web Publik)** | `/store/*` | Tidak perlu login | `StorefrontLayout` (navbar + footer) |
| **Dashboard (Portal)** | `/client/*` | Login required | `ClientLayout` (existing) |

Navigasi antar kedua view: tombol "My Dashboard" di storefront header (jika sudah login), dan link "Browse Services" di client dashboard.

---

## Database Schema Baru

### Tabel: `showcase_projects`
Portfolio project agency yang ditampilkan ke publik.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| title | text NOT NULL | |
| description | text | |
| thumbnail_url | text | |
| category | text | e.g. "Web App", "Mobile", "Landing Page" |
| tech_stack | text[] | e.g. ["React", "Node.js"] |
| demo_url | text | Link ke demo |
| is_published | boolean DEFAULT false | Internal control |
| display_order | integer DEFAULT 0 | |
| created_at | timestamptz | |

RLS: SELECT publik (WHERE is_published = true), ALL untuk internal users.

### Tabel: `service_templates`
Template/paket layanan yang bisa di-order.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text NOT NULL | |
| description | text | |
| thumbnail_url | text | |
| category | text | e.g. "Website", "E-Commerce", "Landing Page" |
| base_price | numeric NOT NULL | Harga dasar |
| estimated_days | integer | Estimasi pengerjaan |
| is_active | boolean DEFAULT true | |
| display_order | integer DEFAULT 0 | |
| created_at | timestamptz | |

RLS: SELECT publik (WHERE is_active = true), ALL untuk internal users.

### Tabel: `template_features`
Fitur tambahan yang bisa dipilih saat custom builder.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| template_id | uuid FK -> service_templates | |
| name | text NOT NULL | e.g. "SEO Optimization" |
| description | text | |
| price | numeric NOT NULL DEFAULT 0 | Harga tambahan |
| is_included | boolean DEFAULT false | Sudah termasuk di base? |
| display_order | integer DEFAULT 0 | |

RLS: SELECT publik, ALL untuk internal users.

### Tabel: `orders`
Order dari checkout storefront.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| order_number | text UNIQUE NOT NULL | Auto-generated (ORD-001) |
| customer_name | text NOT NULL | |
| customer_email | text NOT NULL | |
| customer_phone | text | |
| customer_company | text | |
| template_id | uuid FK -> service_templates | |
| selected_features | jsonb DEFAULT '[]' | Array of feature IDs + names |
| notes | text | Catatan custom dari customer |
| subtotal | numeric NOT NULL | |
| total | numeric NOT NULL | |
| status | text DEFAULT 'Pending' | Pending, Confirmed, In Progress, Completed, Cancelled |
| payment_method | text | 'manual' atau 'online' |
| payment_status | text DEFAULT 'Unpaid' | Unpaid, Paid, Partial |
| created_at | timestamptz | |
| updated_at | timestamptz | |

RLS: INSERT untuk anon (publik bisa checkout), SELECT/UPDATE/DELETE untuk internal users.

---

## Halaman Storefront Baru

### Layout: `StorefrontLayout.tsx`
- Navbar: Logo, nav links (Home, Portfolio, Templates, Contact), tombol "My Dashboard" (jika sudah login)
- Footer: Copyright, social links
- Responsive, mobile-first

### Halaman:

#### 1. `/store` - Landing/Home
- Hero section dengan tagline agency
- Featured showcase projects (3-4 cards)
- Featured templates (3-4 cards)
- CTA: "Browse All Templates" dan "View Our Work"
- Stats section: jumlah project selesai, client puas, dll

#### 2. `/store/portfolio` - Showcase Projects
- Grid layout project cards dengan filter kategori
- Card: thumbnail, title, category, tech stack badges
- Click -> modal atau expand detail dengan description + demo link

#### 3. `/store/templates` - Template Catalog
- Grid cards template dengan filter kategori
- Card: thumbnail, name, base price, estimated days, category badge
- Click -> `/store/templates/:id` detail page

#### 4. `/store/templates/:id` - Template Detail + Custom Builder
- Template info: nama, deskripsi, base price, estimasi
- **Feature Selector**: Checklist fitur (included = checked & disabled, optional = toggle on/off)
- **Live price calculator**: base_price + sum(selected optional features)
- **Order Summary sidebar**: template name, selected features, total price
- CTA: "Proceed to Checkout"

#### 5. `/store/checkout` - Checkout Page
- Form fields: nama, email, phone, company (Zod validated)
- Order summary review
- Pilih payment method: "Request Invoice (Manual)" atau "Pay Online"
- Submit -> insert ke `orders` table
- Success page / confirmation

---

## Hooks Baru (SRP)

| Hook | Table | Deskripsi |
|---|---|---|
| `useShowcaseProjects` | showcase_projects | Fetch published projects |
| `useServiceTemplates` | service_templates | Fetch active templates |
| `useTemplateDetail` | service_templates + template_features | Fetch 1 template + fiturnya |
| `useCreateOrder` | orders | Mutation untuk submit order |

---

## Struktur File

```text
src/features/storefront/
  types/index.ts
  hooks/
    useShowcaseProjects.ts
    useServiceTemplates.ts
    useTemplateDetail.ts
    useCreateOrder.ts
  components/
    HeroSection.tsx
    ProjectCard.tsx
    TemplateCard.tsx
    FeatureSelector.tsx
    OrderSummary.tsx
    CheckoutForm.tsx

src/shared/components/layouts/
  StorefrontLayout.tsx    -- NEW

src/pages/store/
  StorefrontHome.tsx      -- NEW
  PortfolioPage.tsx       -- NEW
  TemplatesPage.tsx       -- NEW
  TemplateDetailPage.tsx  -- NEW
  CheckoutPage.tsx        -- NEW
  OrderSuccessPage.tsx    -- NEW
```

---

## Routing (App.tsx)

```text
/store              -> StorefrontHome       (public)
/store/portfolio    -> PortfolioPage        (public)
/store/templates    -> TemplatesPage        (public)
/store/templates/:id -> TemplateDetailPage  (public)
/store/checkout     -> CheckoutPage         (public)
/store/order-success -> OrderSuccessPage    (public)
```

Semua route storefront TIDAK dibungkus `ProtectedRoute`.

---

## Integrasi dengan Sistem Existing

1. **Client Dashboard**: Tambahkan link "Browse Services" di dashboard yang mengarah ke `/store`
2. **Internal Portal**: Order yang masuk dari storefront bisa dilihat oleh tim Sales/Admin di halaman internal (future enhancement - bisa jadi halaman `/sales/orders`)
3. **Order -> Inquiry pipeline**: Order baru bisa otomatis membuat entry di tabel `inquiries` yang sudah ada, sehingga masuk ke pipeline Sales CRM

---

## Detail Teknis

### Payment Gateway
- Fase 1 (sekarang): Form order manual saja (`payment_method = 'manual'`, status 'Pending')
- Fase 2 (nanti): Integrasi Stripe/Midtrans bisa ditambahkan ke CheckoutPage dengan edge function

### Zod Validation untuk Checkout
```text
- customer_name: string, min 2, max 100
- customer_email: string, valid email
- customer_phone: string, optional
- customer_company: string, optional, max 100
- selected_features: array of UUIDs
- notes: string, optional, max 500
```

### RLS Policies
- `showcase_projects`: anon SELECT WHERE is_published = true
- `service_templates`: anon SELECT WHERE is_active = true
- `template_features`: anon SELECT (semua, karena hanya fitur dari template aktif)
- `orders`: anon INSERT (siapa saja bisa checkout), internal ALL

### Order Number Generation
Database function `generate_order_number()` yang auto-increment: ORD-0001, ORD-0002, dst.

### Prinsip
- **KISS**: Setiap halaman storefront adalah presentational component sederhana
- **DRY**: Reuse StatusBadge, EmptyState; shared TemplateCard di home + catalog
- **SOLID/SRP**: Hook per entity, component per concern, layout terpisah dari content
- **Mobile-first**: Grid responsive, touch-friendly cards (min 44px tap targets)

