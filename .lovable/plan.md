
# Maksimalkan Portfolio / Showcase Page

## Ringkasan
Upgrade halaman Portfolio listing (`/store/showcase`) dan detail (`/store/showcase/:id`) agar sejajar dengan halaman lain yang sudah di-upgrade -- dengan hero gradient, search, animasi, dan visual yang lebih profesional.

---

## Halaman Listing (`/store/showcase`)

### 1. Hero Section -- Gradient Banner
- Tambahkan hero banner dengan gradient background (konsisten: `bg-gradient-to-br from-primary/5 via-transparent to-primary/3`)
- Badge "Portfolio" sebagai trust signal
- Subtitle lebih deskriptif dalam Bahasa Indonesia
- Stats ringkas: jumlah project, jumlah kategori

### 2. Search Bar
- Tambahkan search input di hero section
- Filter project berdasarkan title, description, dan tech_stack
- Highlight: tampilkan jumlah hasil ditemukan

### 3. Category Filter -- Lebih Polished
- Tambahkan count badge per kategori (jumlah project)
- Hover effect lebih prominent
- Scroll-reveal animation pada filter bar

### 4. Project Cards -- Visual Upgrade
- Hover effect lebih dramatis: lift + shadow + border glow (konsisten dengan template cards)
- Image zoom on hover (scale effect)
- Tambahkan jumlah case study sections sebagai indicator ("4 studi kasus")
- Staggered fade-in animation pada grid
- Scroll-reveal pada keseluruhan grid

### 5. Loading State -- Lebih Realistis
- Skeleton shimmer yang lebih detail (hero, filter bar, cards)
- Skeleton mengikuti layout asli

### 6. Empty State -- Lebih Engaging
- Ilustrasi lebih menarik dengan suggestion links (ke Templates, Custom)

---

## Halaman Detail (`/store/showcase/:id`)

### 1. Breadcrumb
- Ganti tombol "Back" menjadi breadcrumb trail: Home > Portfolio > [Category] > [Project Name]

### 2. Hero Image -- Lebih Interaktif
- Image zoom on hover
- Overlay badge kategori dan tech stack count
- Gradient overlay halus di bawah gambar

### 3. Project Info -- Lebih Kaya
- Tambahkan meta info bar: kategori, jumlah tech stack, tanggal dibuat
- Scroll-reveal animation per section

### 4. Case Study Sections -- Visual Upgrade
- Hover effect pada setiap card (lift + border glow)
- Staggered scroll-reveal animation per section
- Numbered indicator (01, 02, 03, 04) di samping icon

### 5. Tech Stack -- Lebih Prominent
- Grid layout dengan icon dekoratif
- Hover effect per tech badge
- Scroll-reveal animation

### 6. CTA Section -- Lebih Engaging
- Tambahkan CTA "Mulai Project Serupa" dengan gradient background
- Link ke `/store/templates` dan `/store/custom`
- Trust signals

### 7. Tambah Section: Related Projects
- Tampilkan 2-3 project lain dari kategori yang sama (jika ada)
- Card style konsisten dengan listing page

---

## Detail Teknis

### File yang Dimodifikasi
- `src/pages/store/ShowcasePage.tsx` -- refactor komprehensif (listing + detail)

### Pendekatan
- Tidak ada perubahan database
- Tidak ada dependency baru
- Menggunakan `useScrollReveal` hook yang sudah ada
- Data dari hook `useShowcaseProjects` yang sudah ada
- Related projects difilter dari data yang sudah ada (by category)
- Menambahkan state `searchQuery` untuk fitur pencarian
- Semua styling menggunakan Tailwind classes
