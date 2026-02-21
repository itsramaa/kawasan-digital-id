

# Maksimalkan Custom Website Page

## Ringkasan
Upgrade halaman Custom Website wizard (`/store/custom`) agar sejajar dengan halaman lain yang sudah di-upgrade -- dengan hero gradient, stepper visual yang lebih profesional, animasi, trust signals, dan summary yang lebih informatif.

---

## Perubahan yang Akan Dilakukan

### 1. Hero Section -- Gradient Banner
- Tambahkan hero banner dengan gradient background (konsisten: `bg-gradient-to-br from-primary/5 via-transparent to-primary/3`)
- Badge "Custom Website" sebagai trust signal
- Subtitle lebih deskriptif dan engaging
- Trust indicators: "Estimasi Instan", "Tanpa Komitmen", "Konsultasi Gratis"

### 2. Stepper / Progress -- Visual Upgrade
- Ganti progress bar sederhana menjadi stepper visual dengan icon per step
- Setiap step punya icon (ClipboardList, Settings, Calendar, FileCheck)
- Active step dengan highlight, completed steps dengan checkmark
- Connecting line antar steps
- Animasi transisi saat pindah step

### 3. Step 1: Basic Info -- Lebih Polished
- Industry selector: ganti `<select>` menjadi icon-based grid cards (setiap industry punya icon)
- Website Type cards: tambahkan deskripsi singkat dan estimasi harga mulai ("Mulai dari Rp X")
- Pages slider: tambahkan visual indicator (icon halaman) dan info "5 halaman sudah termasuk"
- Scroll-reveal animation

### 4. Step 2: Features -- Lebih Engaging
- Tambahkan badge "Popular" pada fitur tertentu (Ecommerce, Payment Gateway)
- Tambahkan estimasi hari per fitur di samping harga ("+7 hari kerja")
- Running total mini-bar di bawah feature list (total fitur terpilih + total biaya tambahan)
- Hover effect lebih dramatis: border glow + subtle scale
- Scroll-reveal animation

### 5. Step 3: Timeline & Budget -- Lebih Informatif
- Deadline cards: tambahkan icon dan subtle description per opsi
- Budget cards: tambahkan hint "Paling Populer" pada range tertentu
- Tambahkan info box: "Estimasi sementara berdasarkan pilihan Anda" dengan preview harga realtime
- Scroll-reveal animation

### 6. Step 4: Summary -- Lebih Profesional
- Layout 2 kolom pada desktop: detail di kiri, pricing card sticky di kanan
- Summary detail dengan icon per item (bukan hanya grid text)
- Pricing card dengan gradient background, breakdown harga (base + pages + features)
- Tambahkan trust signals: "Garansi Uang Kembali", "Revisi Gratis", "NDA Available"
- Tambahkan disclaimer: "Harga final akan dikonfirmasi setelah konsultasi"
- CTA buttons lebih prominent dengan icon

### 7. Tambah Section: "Mengapa Custom?"
- Tampilkan di bawah hero (sebelum wizard) atau sebagai collapsible section
- 3-4 value propositions: "100% Sesuai Kebutuhan", "Tim Berpengalaman", "Support Berkelanjutan", "Full Ownership"
- Icon grid layout dengan scroll-reveal

### 8. Animasi Global
- Fade-in transition saat pindah step (opacity + translateY)
- Scroll-reveal pada hero dan "Mengapa Custom" section
- Smooth transition pada running total dan estimasi harga

---

## Detail Teknis

### File yang Dimodifikasi
- `src/pages/store/CustomWebsitePage.tsx` -- refactor komprehensif

### Pendekatan
- Tidak ada perubahan database
- Tidak ada dependency baru
- Menggunakan `useScrollReveal` hook yang sudah ada
- Semua styling menggunakan Tailwind classes
- Logika estimasi (`estimate()`) tetap sama, hanya presentasi yang di-upgrade
- Menambahkan icon mapping untuk industries dan step icons dari lucide-react

