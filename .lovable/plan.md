
# Maksimalkan UI/UX Halaman Legal

## Masalah Saat Ini

Ketiga halaman legal (Privacy Policy, Terms of Service, Refund Policy) saat ini hanya berupa "dinding teks" biasa tanpa elemen visual yang menarik. Tidak konsisten dengan standar UI/UX halaman storefront lainnya (HelpFAQPage, ShowcasePage, dll) yang sudah menggunakan hero section, scroll-reveal animations, ikon, badge, dan card-based layout.

## Perubahan yang Dilakukan

### 1. Buat Komponen Reusable `LegalPageLayout`

File baru: `src/features/storefront/components/legal/LegalPageLayout.tsx`

Komponen wrapper khusus untuk semua halaman legal, berisi:
- **Hero Section** dengan gradient background, Badge (ikon Shield), judul, dan deskripsi singkat
- **Table of Contents (TOC)** -- sidebar navigasi sticky di desktop, horizontal scroll di mobile, untuk jump ke setiap section
- **Cross-Navigation** di bagian bawah -- card link ke halaman legal lainnya (misalnya di Privacy ada link ke Terms dan Refund)
- **Scroll-to-top button** dan breadcrumb sederhana (Home > Legal > [Page])

### 2. Buat Komponen `LegalSection`

File baru: `src/features/storefront/components/legal/LegalSection.tsx`

Komponen reusable per-section yang menggantikan `<section>` biasa:
- Setiap section dibungkus dalam card dengan border halus (`rounded-xl border border-border bg-card`)
- Ikon per-section (setiap topik legal mendapat ikon relevan dari Lucide)
- Nomor section ditampilkan sebagai badge kecil
- **useScrollReveal** untuk animasi masuk saat scroll (konsisten dengan halaman lain)
- Anchor ID untuk TOC navigation (`id="section-1"`, dst)

### 3. Update Ketiga Halaman Legal

Refactor `PrivacyPolicyPage.tsx`, `TermsOfServicePage.tsx`, dan `RefundPolicyPage.tsx` untuk menggunakan komponen baru:

**Struktur setiap halaman:**
```
StorefrontLayout
  LegalPageLayout (hero + TOC + cross-nav)
    LegalSection (per topik, dengan ikon & scroll-reveal)
    LegalSection ...
    Cross-Navigation Cards
```

**Ikon per section (contoh Privacy Policy):**
- Informasi yang Dikumpulkan: `ClipboardList`
- Penggunaan Informasi: `Target`
- Perlindungan Data: `ShieldCheck`
- Berbagi Informasi: `Share2`
- Cookie: `Cookie` / `Globe`
- Hak Anda: `UserCheck`
- Perubahan Kebijakan: `RefreshCw`
- Hubungi Kami: `Mail`

### 4. Fitur UI/UX yang Ditambahkan

| Fitur | Detail |
|-------|--------|
| Hero gradient | `bg-gradient-to-br from-primary/5 via-transparent to-primary/3` dengan Badge |
| Scroll-reveal | Setiap section muncul dengan animasi fade-up via `useScrollReveal` |
| Card-based sections | Setiap section dalam card dengan hover effect (`hover:border-primary/30`) |
| Section icons | Ikon Lucide relevan di samping judul setiap section |
| Table of Contents | Sidebar sticky (desktop) / horizontal pills (mobile) untuk navigasi cepat |
| Cross-navigation | 2 card di bawah konten untuk navigasi ke halaman legal lainnya |
| "Last updated" badge | Tanggal update ditampilkan sebagai Badge, bukan plain text |
| Responsive design | Layout 1-kolom di mobile, TOC sidebar di desktop (lg breakpoint) |
| Accessibility | Semantic HTML (`nav`, `article`, `section`), proper heading hierarchy, anchor links |

## Detail Teknis

### File Baru
- `src/features/storefront/components/legal/LegalPageLayout.tsx` -- Layout wrapper dengan hero, TOC, dan cross-nav
- `src/features/storefront/components/legal/LegalSection.tsx` -- Card section dengan ikon dan scroll-reveal

### File Diubah
- `src/pages/store/PrivacyPolicyPage.tsx` -- Refactor menggunakan komponen baru
- `src/pages/store/TermsOfServicePage.tsx` -- Refactor menggunakan komponen baru
- `src/pages/store/RefundPolicyPage.tsx` -- Refactor menggunakan komponen baru

### File Tidak Diubah
- `StorefrontLayout.tsx` -- Tidak ada perubahan
- `App.tsx` -- Route tetap sama
