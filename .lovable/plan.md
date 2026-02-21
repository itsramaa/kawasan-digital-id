
# Maksimalkan Templates Page

## Ringkasan
Upgrade halaman katalog template (`/store/templates`) agar lebih profesional, informatif, dan engaging -- sejajar dengan homepage yang sudah di-upgrade.

## Perubahan yang Akan Dilakukan

### 1. Page Header -- Lebih Impactful
- Tambahkan hero banner kecil dengan gradient background (konsisten dengan homepage)
- Tambahkan search bar untuk pencarian template berdasarkan nama/deskripsi
- Tambahkan stats ringkas: jumlah template, kategori tersedia

### 2. Filter Sidebar -- Lebih Polished
- Tambahkan icon pada setiap section header (harga, kategori, waktu)
- Tambahkan count badge pada setiap kategori (jumlah template per kategori)
- Tambahkan rating/review filter placeholder
- Sticky sidebar saat scroll (desktop)

### 3. Template Cards -- Visual Upgrade
- Tambahkan badge "Best Seller" kondisional (hanya untuk `is_featured === true`)
- Tambahkan badge "New" untuk template yang dibuat dalam 30 hari terakhir
- Hover effect lebih dramatis: lift + shadow + border glow
- Tambahkan rating stars placeholder pada card
- Tambahkan "Add to Cart" quick-action button pada hover overlay
- Animasi stagger pada grid saat pertama kali muncul (fade-in berurutan)

### 4. Quick View Dialog -- Lebih Informatif
- Tambahkan daftar fitur included (dari `template_features` table)
- Tambahkan badge kategori dan estimasi waktu yang lebih prominent
- Tambahkan tombol "Add to Cart" langsung dari quick view
- Tambahkan link ke demo jika `demo_url` tersedia

### 5. Sort & View Options -- Lebih Fleksibel
- Tambahkan toggle view: Grid vs List view
- List view menampilkan lebih banyak detail (deskripsi lengkap, fitur preview)
- Active filter chips di top bar yang bisa di-remove satu per satu

### 6. Empty State & Loading -- Lebih Engaging
- Skeleton loading yang lebih realistis (shimmer effect)
- Empty state dengan ilustrasi yang lebih menarik dan suggestion links

### 7. Scroll Animation
- Gunakan `useScrollReveal` hook yang sudah ada untuk animasi section
- Staggered card entrance animation

## Detail Teknis

### File yang Dimodifikasi
- `src/pages/store/TemplatesPage.tsx` -- refactor komprehensif dengan semua upgrade di atas

### Data Tambahan
- Quick View akan fetch `template_features` menggunakan hook `useTemplateDetail` yang sudah ada untuk menampilkan fitur included

### Pendekatan
- Tidak ada perubahan database
- Tidak ada dependency baru
- Menggunakan `useScrollReveal` hook yang sudah ada
- Menambahkan state `viewMode` (grid/list) dan `searchQuery` untuk fitur baru
- Quick View menggunakan `useTemplateDetail` untuk fetch fitur secara lazy (hanya saat dialog dibuka)
- Semua styling menggunakan Tailwind classes
