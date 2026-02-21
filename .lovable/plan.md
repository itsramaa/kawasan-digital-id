
# Maksimalkan Template Detail Page

## Ringkasan
Upgrade halaman detail template (`/store/templates/:id`) agar lebih profesional, informatif, dan conversion-optimized -- sejajar dengan homepage dan templates page yang sudah di-upgrade.

## Perubahan yang Akan Dilakukan

### 1. Breadcrumb -- Lebih Informatif
- Ganti tombol "Back" sederhana menjadi breadcrumb trail: Home > Templates > [Category] > [Template Name]
- Setiap level bisa diklik untuk navigasi

### 2. Gallery Section -- Lebih Interaktif
- Tambahkan transisi smooth (fade) saat ganti gambar
- Tambahkan image zoom on hover (scale effect di main image)
- Tambahkan counter "1 / 5" pada gallery
- Tambahkan badge "Best Seller" dan "New" kondisional (overlay di gambar utama)
- Perbaiki thumbnail strip dengan active indicator yang lebih jelas

### 3. Info Panel -- Lebih Kaya
- Tambahkan star rating placeholder (5 bintang)
- Tambahkan badge "Garansi Uang Kembali" dan "Revisi Gratis" sebagai trust signals
- Tambahkan harga coret (original price hint) untuk kesan value
- Sticky behavior pada Order Summary saat scroll di desktop (`lg:sticky lg:top-24`)

### 4. Package Includes -- Visual Upgrade
- Tambahkan icon per item (bukan hanya checkmark)
- Gunakan grid 3 kolom pada desktop
- Tambahkan animasi scroll-reveal
- Heading dengan icon dekoratif

### 5. Scope Customization & Infra Add-Ons -- Lebih Engaging
- Tambahkan badge "Popular" pada add-on tertentu (harga tertinggi atau kondisional)
- Hover effect lebih dramatis: border glow + subtle scale
- Tambahkan info tooltip pada setiap add-on yang punya description
- Animasi scroll-reveal per section

### 6. Tambah Section Baru: "Mengapa Memilih Template Ini?"
- Section trust/value proposition dengan 3-4 poin (Desain Profesional, SEO Optimized, Full Ownership, Support Responsif)
- Layout icon grid 2x2
- Scroll-reveal animation

### 7. FAQ Section -- Lebih Polished
- Tambahkan link "Lihat Semua FAQ" ke `/store/help`
- Scroll-reveal animation
- Subtle gradient background

### 8. Related Templates -- Lebih Menarik
- Hover effect: lift + shadow + border glow
- Tambahkan category badge dan estimasi hari pada card
- Tambahkan "Best Seller" badge kondisional
- Horizontal scroll pada mobile

### 9. Loading State -- Lebih Realistis
- Skeleton shimmer yang lebih detail (breadcrumb, gallery, sidebar, sections)
- Skeleton mengikuti layout asli

### 10. Scroll Animation Global
- Gunakan `useScrollReveal` hook pada setiap section (Package Includes, Scope, Infra, FAQ, Related)
- Smooth fade-in + slide-up effect

## Detail Teknis

### File yang Dimodifikasi/Dibuat
- **Refactor**: `src/pages/store/TemplateDetailPage.tsx` -- dipecah menjadi sub-components
- **Buat baru**: `src/features/storefront/components/detail/DetailBreadcrumb.tsx`
- **Buat baru**: `src/features/storefront/components/detail/DetailGallery.tsx`
- **Buat baru**: `src/features/storefront/components/detail/DetailInfoPanel.tsx`
- **Buat baru**: `src/features/storefront/components/detail/PackageIncludes.tsx`
- **Buat baru**: `src/features/storefront/components/detail/ScopeCustomization.tsx`
- **Buat baru**: `src/features/storefront/components/detail/InfraAddOns.tsx`
- **Buat baru**: `src/features/storefront/components/detail/WhyChooseSection.tsx`
- **Buat baru**: `src/features/storefront/components/detail/DetailFAQ.tsx`
- **Buat baru**: `src/features/storefront/components/detail/RelatedTemplates.tsx`
- **Buat baru**: `src/features/storefront/components/detail/DetailSkeleton.tsx`

### Pendekatan
- Tidak ada perubahan database
- Tidak ada dependency baru
- Menggunakan `useScrollReveal` hook yang sudah ada
- Semua data dari hooks yang sudah ada (`useTemplateDetail`, `useRelatedTemplates`, `useFAQs`, `useCart`)
- Semua styling menggunakan Tailwind classes
- Komponen parent `TemplateDetailPage.tsx` menjadi orchestrator yang memanggil sub-components
