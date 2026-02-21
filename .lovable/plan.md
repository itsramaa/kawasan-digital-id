
# Maksimalkan Homepage Store

## Ringkasan
Upgrade visual dan konten homepage `/store` agar terlihat lebih profesional, modern, dan meyakinkan pengunjung. Semua 10 section sudah ada -- fokus pada peningkatan visual, animasi, dan konten yang lebih kaya.

## Perubahan yang Akan Dilakukan

### 1. Hero Section -- Lebih Impactful
- Tambahkan badge/announcement bar di atas heading (contoh: "Trusted by 50+ businesses")
- Tambahkan social proof stats di bawah CTA (contoh: "50+ Klien | 100+ Website | 4.9 Rating")
- Tambahkan subtle animated gradient background atau decorative shapes
- Perbesar spacing dan gunakan heading yang lebih dramatis

### 2. Category Section -- Lebih Interaktif
- Tambahkan hover animation scale-up pada kartu kategori
- Tambahkan subtle description/tagline di bawah heading section

### 3. Featured Templates -- Lebih Informatif
- Tambahkan badge kondisional (Best Seller hanya untuk featured, bukan semua)
- Tambahkan category label pada card
- Hover effect: slight lift + shadow yang lebih dramatis

### 4. Custom Highlight -- Lebih Menarik
- Tambahkan checklist fitur (contoh: "Desain Eksklusif", "Full Ownership", "SEO Ready")
- Ganti placeholder icon dengan visual yang lebih menarik (gradient icon grid)

### 5. Add-On Section -- Visual Upgrade
- Tambahkan harga indikasi atau label "Popular" pada item tertentu
- Hover animation yang lebih smooth

### 6. How It Works -- Lebih Jelas
- Tambahkan garis connector/timeline antar step
- Warna step numbers yang lebih kontras
- Tambahkan CTA link ke halaman detail "How It Works"

### 7. Showcase Section -- Clickable Cards
- Buat card bisa diklik ke detail page (`/store/showcase/:id`)
- Tambahkan category badge dan tech stack preview pada card

### 8. Testimonials -- Lebih Terpercaya
- Tambahkan avatar/foto placeholder yang lebih besar
- Tambahkan quote icon dekoratif
- Layout carousel/horizontal scroll untuk mobile

### 9. FAQ Section -- Lebih Lengkap
- Tambahkan link "Lihat Semua FAQ" ke `/store/help`
- Subtle styling improvement pada accordion

### 10. Final CTA -- Lebih Compelling
- Tambahkan secondary CTA (contoh: "Konsultasi Gratis" ke Contact)
- Tambahkan trust badges atau partner logos area

### 11. Animasi & Polish Global
- Tambahkan scroll-reveal animation (intersection observer) pada setiap section untuk efek muncul saat scroll
- Smooth transitions antar section
- Konsisten spacing antar semua section

## Detail Teknis

### File yang Dimodifikasi
- `src/pages/store/StorefrontHome.tsx` -- semua perubahan di sini, refactor setiap sub-component

### Pendekatan
- Tidak ada perubahan database
- Tidak ada dependency baru -- gunakan CSS animations dan Intersection Observer API native
- Custom hook `useScrollReveal` sederhana untuk animasi scroll-in
- Semua styling menggunakan Tailwind classes yang sudah ada
- Tetap mempertahankan struktur 10 section yang sudah ada, hanya memperkaya visual dan konten
