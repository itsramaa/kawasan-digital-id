

# Redesain Store: Dari Landing Page ke E-Commerce App

## Masalah Saat Ini

Halaman `/store` saat ini terlihat seperti **landing page marketing** dengan:
- Hero section besar dengan tagline
- Stats bar (50+ Projects, 30+ Clients, dll)
- Showcase projects section
- CTA "Ready to Get Started?"

Padahal ini adalah **bagian dari aplikasi**, bukan website terpisah. Perlu diubah menjadi tampilan e-commerce yang langsung menampilkan produk/layanan.

---

## Perubahan yang Dilakukan

### 1. Redesain `StorefrontHome.tsx` - Gaya E-Commerce

Hapus semua elemen landing page (hero besar, stats, CTA section) dan ganti dengan layout e-commerce:

**Layout baru:**
- **Search bar** di bagian atas untuk mencari template
- **Category sidebar/filter** (atau horizontal filter pills di mobile)
- **Grid produk (templates)** sebagai konten utama -- langsung tampil semua template dengan harga
- **Section "Portfolio"** tetap ada tapi lebih compact, sebagai referensi saja (bukan hero)
- Banner kecil di atas (opsional) -- bukan hero full-width, tapi slim promotional banner

**Struktur halaman baru:**
```text
[Slim Banner / Promo Strip]                    -- 1-2 baris, bisa di-dismiss
[Search Bar + Sort Dropdown]                   -- pencarian template
[Category Filter Pills]                        -- All | Website | E-Commerce | Landing Page | ...
[Template Grid - 3 kolom]                      -- produk utama, langsung tampil
  - Card: thumbnail, nama, harga, kategori badge, tombol "View Details"
[Divider]
[Portfolio Showcase - compact row]             -- 3-4 card horizontal, link "View All"
```

### 2. Perubahan pada `StorefrontLayout.tsx`

- Ubah navigasi: "Home" ganti menjadi label yang lebih sesuai e-commerce (misal tetap "Home" tapi konteksnya berubah)
- Navbar sudah sesuai (ada cart, dashboard link)
- Tidak ada perubahan besar di layout

### 3. Tidak ada perubahan di halaman lain

`TemplatesPage.tsx`, `PortfolioPage.tsx`, `TemplateDetailPage.tsx`, dll tetap sama. Hanya `StorefrontHome.tsx` yang di-redesain total.

---

## Detail Teknis

### File yang diubah: `src/pages/store/StorefrontHome.tsx`

Rewrite halaman dengan struktur:

1. **Slim promo banner** (optional) -- satu baris dengan background primary/10, bisa berisi teks promo singkat
2. **Search + Sort bar** -- input search untuk filter template by nama, dropdown sort (harga rendah-tinggi, terbaru)
3. **Category filter pills** -- menggunakan kategori dari data templates, sama seperti di `TemplatesPage.tsx`
4. **Template product grid** -- grid 2-3 kolom, semua template langsung tampil dengan:
   - Thumbnail
   - Nama template
   - Kategori badge
   - Harga (Rp format)
   - Estimasi hari
   - Tombol "Lihat Detail" atau card clickable ke `/store/templates/:id`
5. **Portfolio section (compact)** -- di bawah grid template, section kecil "Lihat Hasil Kerja Kami" dengan 3 card project dan link "View All Portfolio"

### State management di halaman:
- `searchQuery` -- string untuk filter template by name
- `categoryFilter` -- string untuk filter by category
- `sortBy` -- "price-asc" | "price-desc" | "newest"
- Data dari `useServiceTemplates()` dan `useShowcaseProjects()` (existing hooks)

### Yang dihapus:
- Hero section besar (text 6xl, blur background)
- Stats section (50+ Projects, 30+ Clients, dll)
- CTA section "Ready to Get Started?"
- Embla carousel (langsung grid saja)
