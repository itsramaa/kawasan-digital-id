
# Redesain Homepage Store: Marketplace Style

## Ringkasan

Mengubah `/store` dari tampilan e-commerce sederhana menjadi **homepage marketplace lengkap** dengan 10 section sesuai permintaan. Beberapa section membutuhkan tabel database baru (testimonials, FAQ), dan beberapa menggunakan data statis/hardcoded.

---

## Struktur Halaman Baru

```text
1. Hero Section (headline + search + 2 CTA)
2. Category Shortcut (grid 6 kategori)
3. Best Selling Templates (grid 6-8 template + badge)
4. Custom Website Highlight (section terpisah + CTA)
5. Add-On Preview (4 add-on card)
6. How It Works (5 langkah e-commerce flow)
7. Showcase Preview (3-6 project dari DB)
8. Testimonials (dari DB baru)
9. FAQ Preview (5 pertanyaan, accordion)
10. Final CTA ("Start Your Website Today")
```

---

## Perubahan Database

### Tabel baru: `testimonials`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | PK |
| client_name | text | Nama klien |
| client_company | text | nullable |
| avatar_url | text | nullable |
| content | text | Isi testimoni |
| rating | integer | 1-5 |
| is_published | boolean | default true |
| display_order | integer | default 0 |
| created_at | timestamptz | |

RLS: SELECT untuk anon (publik).

### Tabel baru: `store_faqs`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | PK |
| question | text | Pertanyaan |
| answer | text | Jawaban |
| display_order | integer | default 0 |
| is_published | boolean | default true |
| created_at | timestamptz | |

RLS: SELECT untuk anon (publik).

### Update `service_templates`: tambah kolom `is_featured`

Kolom boolean (default false) untuk menandai template "Best Seller" yang tampil di homepage.

---

## Detail Implementasi per Section

### 1. Hero Section
- Headline: "Order Website Siap Pakai atau Custom"
- Subheadline value proposition
- Search bar (input pencarian, scroll ke section template grid)
- CTA 1: "Browse Templates" (link ke `/store/templates`)
- CTA 2: "Custom Website" (link/scroll ke custom section)
- Background: gradient/pattern subtle, bukan hero image besar

### 2. Category Shortcut
- Grid 2x3 (mobile) / 6 kolom (desktop)
- Kategori: Ecommerce, Company Profile, Landing Page, Portfolio, Blog, UMKM
- Setiap card: icon + label
- Klik navigasi ke `/store/templates?category=xxx`

### 3. Best Selling Templates
- Query `service_templates` WHERE `is_featured = true`, limit 8
- Grid 2-4 kolom responsive
- Card: thumbnail, nama, starting price, delivery time, badge "Best Seller"
- Link ke `/store/templates/:id`
- Tombol "Lihat Semua" ke `/store/templates`

### 4. Custom Website Highlight
- Section dengan background berbeda (muted/accent)
- Headline + deskripsi singkat tentang layanan custom
- CTA: "Mulai Project Custom" (ke form kontak/inquiry)
- Visualnya terpisah jelas dari template grid

### 5. Add-On Preview
- Data statis (hardcoded array): SEO Setup, Extra Page, Speed Optimization, Maintenance Plan
- Grid 4 kolom (2x2 mobile)
- Setiap card: icon, nama, deskripsi singkat
- Info saja (nanti bisa diklik saat checkout di PDP)

### 6. How It Works
- 5 langkah horizontal (mobile: vertikal)
- Steps: Pilih Template/Custom, Sesuaikan Paket, Checkout, Kirim Requirement, Review dan Launch
- Numbered steps dengan icon dan deskripsi singkat

### 7. Showcase Preview
- Data dari tabel `showcase_projects` (existing), limit 6
- Grid 3 kolom, card dengan thumbnail + judul
- Link "Lihat Semua" ke `/store/showcase`

### 8. Testimonials
- Data dari tabel `testimonials` (baru)
- Grid/carousel 3 card
- Card: avatar, nama, perusahaan, rating bintang, isi testimoni
- Jika data kosong, section tidak ditampilkan

### 9. FAQ Preview
- Data dari tabel `store_faqs` (baru), limit 5
- Menggunakan komponen Accordion (sudah ada di project)
- Jika data kosong, section tidak ditampilkan

### 10. Final CTA
- Background primary/accent
- Headline "Start Your Website Today"
- CTA button ke `/store/templates`

---

## File yang Diubah/Dibuat

| File | Aksi |
|------|------|
| `supabase/migrations/xxx.sql` | Buat tabel testimonials, store_faqs, tambah kolom is_featured |
| `src/pages/store/StorefrontHome.tsx` | Rewrite total dengan 10 section |
| `src/features/storefront/hooks/useTestimonials.ts` | Hook baru |
| `src/features/storefront/hooks/useFAQs.ts` | Hook baru |
| `src/features/storefront/hooks/useFeaturedTemplates.ts` | Hook baru |
| `src/features/storefront/types/index.ts` | Tambah interface Testimonial, FAQ |

---

## Catatan Teknis

- Semua section menggunakan semantic HTML (`section`, `h2`)
- Responsive: mobile-first dengan Tailwind breakpoints (sm, md, lg)
- FAQ menggunakan komponen `Accordion` yang sudah ada
- Category shortcut menggunakan query params untuk navigasi ke templates page
- Data statis (add-ons, how it works, categories) di-hardcode di komponen karena jarang berubah
- Section dengan data DB (testimonials, FAQ, showcase) otomatis hidden jika data kosong
