

# Maksimalkan Help Center Pages

## Ringkasan
Upgrade dua halaman Help Center (`/store/how-it-works` dan `/store/help`) agar lebih profesional, engaging, dan sejajar dengan halaman lain yang sudah di-upgrade (Homepage, Templates, Detail).

---

## Halaman 1: How It Works (`HowItWorksPage.tsx`)

### 1. Hero Section
- Tambahkan hero banner dengan gradient background (konsisten dengan halaman lain)
- Subtitle yang lebih deskriptif
- Badge "10 Langkah Mudah" sebagai trust signal

### 2. Timeline Visual Upgrade
- Card-based layout per step (bukan hanya text list)
- Hover effect: lift + shadow + border glow pada setiap card
- Alternating layout pada desktop (zigzag: kiri-kanan)
- Nomor step yang lebih prominent (badge besar)
- Scroll-reveal animation per step (staggered)

### 3. Phase Grouping
- Kelompokkan 10 step menjadi 3-4 fase visual:
  - Fase 1: Persiapan (Step 1-3)
  - Fase 2: Pengerjaan (Step 4-6)
  - Fase 3: Finalisasi (Step 7-9)
  - Fase 4: After-Launch (Step 10)
- Setiap fase punya heading + divider dekoratif

### 4. CTA Section Upgrade
- Gradient background pada CTA
- Tambahkan trust signals (jumlah project selesai, rating)
- Animasi scroll-reveal

---

## Halaman 2: Help / FAQ (`HelpFAQPage.tsx`)

### 1. Hero Section
- Tambahkan hero banner dengan gradient background
- Search bar untuk pencarian FAQ berdasarkan keyword
- Stats: jumlah FAQ tersedia

### 2. Category Filter Upgrade
- Icon per kategori
- Count badge per kategori (jumlah FAQ)
- Hover effect lebih prominent
- Scroll-reveal animation

### 3. FAQ Cards Upgrade
- Hover effect pada accordion items
- Animasi stagger saat muncul
- Highlight matched search text (jika search aktif)
- Empty state yang lebih engaging dengan suggestions

### 4. Contact CTA Upgrade
- Gradient background
- Tambahkan info tambahan (response time, channel support)
- Icon grid untuk berbagai channel kontak (email, WhatsApp hint)
- Scroll-reveal animation

### 5. Tambah Section: Quick Links
- Grid cards menuju halaman terkait (How It Works, Templates, Custom)
- Masing-masing dengan icon, judul, dan deskripsi singkat

---

## Detail Teknis

### File yang Dimodifikasi
- `src/pages/store/HowItWorksPage.tsx` -- refactor komprehensif
- `src/pages/store/HelpFAQPage.tsx` -- refactor komprehensif

### Pendekatan
- Tidak ada perubahan database
- Tidak ada dependency baru
- Menggunakan `useScrollReveal` hook yang sudah ada
- Data FAQ dari hook `useFAQs` yang sudah ada
- Semua styling menggunakan Tailwind classes
- Menambahkan `searchQuery` state pada FAQ page untuk fitur pencarian

