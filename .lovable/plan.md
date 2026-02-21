

# Maksimalkan Cart Page

## Ringkasan
Upgrade halaman Cart (`/store/cart`) dari tampilan fungsional sederhana menjadi pengalaman belanja profesional yang konsisten dengan halaman store lainnya -- dengan hero gradient, animasi scroll-reveal, empty state yang engaging, trust signals, dan visual yang lebih polished.

---

## Perubahan yang Akan Dilakukan

### 1. Hero Section -- Gradient Banner
- Tambahkan hero banner dengan gradient background (konsisten: `bg-gradient-to-br from-primary/5 via-transparent to-primary/3`)
- Badge "Shopping Cart" dengan icon ShoppingBag
- Heading dinamis berdasarkan jumlah item
- Breadcrumb trail: Home > Cart

### 2. Empty State -- Lebih Engaging
- Ilustrasi yang lebih besar dengan animasi pulse pada icon
- Heading dan subtitle lebih deskriptif dalam Bahasa Indonesia
- Suggestion cards (3 kolom): link ke Templates, Custom Website, dan Showcase
- Setiap card dengan icon, judul, dan deskripsi singkat
- Scroll-reveal animation

### 3. Cart Item Cards -- Visual Upgrade
- Thumbnail lebih besar (dari 80px ke 96px) dengan hover zoom effect
- Hover effect pada card: lift + subtle border glow
- Badge kategori lebih prominent
- Estimated days dengan icon dan styling lebih baik
- Feature list dengan icon checkmark per item
- Staggered fade-in animation pada daftar item
- Tombol remove dengan konfirmasi tooltip

### 4. Summary Sidebar -- Lebih Profesional
- Gradient border/accent pada summary card
- Breakdown harga lebih detail: Base prices vs Add-on prices
- Estimasi total hari pengerjaan (jika tersedia)
- Trust signals: "Pembayaran Aman", "Garansi Revisi", "Support 24/7"
- Coupon section dengan styling lebih polished
- CTA button lebih prominent dengan gradient atau animasi subtle
- Info "Gratis konsultasi sebelum mulai" di bawah CTA

### 5. Tambah Section: "Mungkin Anda Tertarik"
- Tampilkan di bawah cart items (hanya jika cart ada isinya)
- Teks ajakan cross-sell: "Tingkatkan project Anda dengan layanan tambahan"
- Quick links ke Templates dan Custom Website

### 6. Animasi Global
- `useScrollReveal` pada hero, empty state, cart items, dan summary
- Staggered animation pada cart item cards
- Smooth transition saat item dihapus (menggunakan CSS transition)

---

## Detail Teknis

### File yang Dimodifikasi
- `src/pages/store/CartPage.tsx` -- refactor komprehensif

### Pendekatan
- Tidak ada perubahan database
- Tidak ada dependency baru
- Menggunakan `useScrollReveal` hook yang sudah ada
- Data dari `useCart` hook yang sudah ada
- Semua styling menggunakan Tailwind classes
- Menambahkan icon dari lucide-react (Shield, Award, Sparkles, dll)
- Bahasa Indonesia untuk semua teks UI baru

