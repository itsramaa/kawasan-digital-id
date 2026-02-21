
# Refactor URL Structure

## Ringkasan
Mengubah struktur URL aplikasi menjadi lebih bersih:
- **Storefront (publik)**: `/store/*` menjadi `/*` (root level)
- **Client Dashboard**: `/client/*` menjadi `/dashboard/*`
- **Admin/Internal**: `/` (dashboard), `/sales`, `/projects`, dll menjadi `/admin/*`

## Pemetaan URL Baru

```text
SEBELUM                     SESUDAH
────────────────────────────────────────────────
STOREFRONT (Public)
/store                  ->  /
/store/templates        ->  /templates
/store/templates/:id    ->  /templates/:id
/store/showcase         ->  /showcase
/store/showcase/:id     ->  /showcase/:id
/store/custom           ->  /custom
/store/cart             ->  /cart
/store/checkout         ->  /checkout
/store/order-success    ->  /order-success
/store/how-it-works     ->  /how-it-works
/store/help             ->  /help
/store/contact          ->  /contact

CLIENT DASHBOARD (Protected)
/client                 ->  /dashboard
/client/projects        ->  /dashboard/projects
/client/orders          ->  /dashboard/orders
/client/contracts       ->  /dashboard/contracts
/client/invoices        ->  /dashboard/invoices
/client/payments        ->  /dashboard/payments
/client/infrastructure  ->  /dashboard/infrastructure
/client/support         ->  /dashboard/support
/client/account         ->  /dashboard/account

ADMIN/INTERNAL (Protected)
/                       ->  /admin
/sales                  ->  /admin/sales
/sales/clients          ->  /admin/sales/clients
/sales/quotations       ->  /admin/sales/quotations
/sales/contracts        ->  /admin/sales/contracts
/projects               ->  /admin/projects
/projects/:id           ->  /admin/projects/:id
/projects/tasks         ->  /admin/projects/tasks
/finance                ->  /admin/finance
/finance/payments       ->  /admin/finance/payments
/support                ->  /admin/support
/infrastructure         ->  /admin/infrastructure
/settings               ->  /admin/settings

UNCHANGED
/login                  ->  /login
```

## File yang Dimodifikasi

### 1. `src/App.tsx`
- Update semua route path sesuai pemetaan baru

### 2. `src/shared/components/layouts/StorefrontLayout.tsx`
- `navLinks` paths: `/store` -> `/`, `/store/templates` -> `/templates`, dll
- `helpCenterLinks` paths
- Logo link, cart link, footer links
- `isActive` logic: root path check dari `/store` ke `/`
- "My Dashboard" link: `/client` -> `/dashboard`
- "Get Started" link: `/store/templates` -> `/templates`

### 3. `src/shared/components/layouts/ClientLayout.tsx`
- Semua `navItems` paths: `/client` -> `/dashboard`, `/client/projects` -> `/dashboard/projects`, dll
- Active state check: dari `/client` ke `/dashboard`

### 4. `src/shared/components/layouts/AppSidebar.tsx`
- Semua `sections` paths di LogoDropdown: `/` -> `/admin`, `/sales` -> `/admin/sales`, dll
- Client portal paths: `/client` -> `/dashboard`
- `navItems` paths: semua ditambah prefix `/admin`
- `isActive` logic update

### 5. `src/features/auth/ProtectedRoute.tsx`
- Redirect dari `/client` ke `/dashboard`

### 6. `src/features/auth/hooks/useAuthForm.ts`
- Default redirect setelah login: `/` -> tetap `/` (sekarang storefront, tapi logic di `Dashboard.tsx` akan redirect)
- Perlu logic baru: setelah login, redirect ke `/dashboard` untuk client atau `/admin` untuk internal

### 7. `src/pages/Dashboard.tsx`
- Redirect client dari `/client` ke `/dashboard`
- Route ini sendiri pindah ke `/admin`

### 8. Semua file storefront component (14 file):
- `src/features/storefront/components/home/HeroSection.tsx`
- `src/features/storefront/components/home/FeaturedSection.tsx`
- `src/features/storefront/components/home/CategorySection.tsx`
- `src/features/storefront/components/home/CustomHighlight.tsx`
- `src/features/storefront/components/home/ShowcaseSection.tsx`
- `src/features/storefront/components/home/FAQSection.tsx`
- `src/features/storefront/components/home/HowItWorks.tsx`
- `src/features/storefront/components/home/FinalCTA.tsx`
- `src/features/storefront/components/detail/DetailBreadcrumb.tsx`
- `src/features/storefront/components/detail/DetailFAQ.tsx`
- `src/features/storefront/components/detail/RelatedTemplates.tsx`
- `src/features/storefront/components/templates/TemplateCard.tsx`
- `src/features/storefront/components/templates/TemplateListItem.tsx`
- `src/features/storefront/components/home/ShowcaseGrid.tsx` (jika ada link)

### 9. Semua file store pages (10 file):
- `src/pages/store/CartPage.tsx`
- `src/pages/store/CheckoutPage.tsx`
- `src/pages/store/ContactPage.tsx`
- `src/pages/store/CustomWebsitePage.tsx`
- `src/pages/store/HelpFAQPage.tsx`
- `src/pages/store/HowItWorksPage.tsx`
- `src/pages/store/OrderSuccessPage.tsx`
- `src/pages/store/ShowcasePage.tsx`
- `src/pages/store/TemplateDetailPage.tsx`
- `src/pages/store/StorefrontHome.tsx`

## Detail Teknis

### Login Redirect Logic
Setelah login, `useAuthForm.ts` saat ini redirect ke `/` (yang sebelumnya admin dashboard). Perlu diubah:
- Setelah login sukses, redirect ke `redirectTo || "/dashboard"` (karena `/` sekarang storefront)
- Di `Dashboard.tsx` (sekarang `/admin`), client user tetap di-redirect ke `/dashboard`
- Di `ProtectedRoute.tsx`, `requireInternal` redirect ke `/dashboard` bukan `/client`

### Pendekatan
- Tidak ada perubahan database
- Tidak ada dependency baru
- Hanya find-and-replace path strings di seluruh codebase
- Semua link internal diperbarui secara konsisten
- File pages tetap di folder yang sama (tidak di-rename/move), hanya route path yang berubah
