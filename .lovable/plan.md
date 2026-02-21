
# Maksimalkan Halaman Support Client

## Ringkasan
Upgrade halaman Support (`/dashboard/support`) dari layout sederhana menjadi halaman yang profesional dan polished, konsisten dengan style halaman Profile yang sudah di-upgrade -- hero banner, summary cards, filter/search, detail panel yang lebih kaya, dan animasi scroll-reveal.

---

## Perubahan yang Akan Dilakukan

### 1. Hero Banner + Header
- Gradient banner konsisten dengan halaman Profile (`bg-gradient-to-br from-primary/10 via-primary/5 to-transparent`)
- Breadcrumb: Dashboard > Support
- Icon HeadphonesIcon besar di banner
- Judul "Pusat Bantuan" + subtitle ringkas
- Tombol "Tiket Baru" di kanan atas

### 2. Summary Stat Cards (4 kartu)
- **Tiket Aktif** (Open + In Progress) -- warna info
- **Menunggu** (Pending Client) -- warna warning
- **Eskalasi** (Escalated) -- warna error/destructive
- **Terselesaikan** (Resolved + Closed) -- warna success
- Masing-masing card dengan icon kecil, angka besar, dan label

### 3. Filter & Search Bar
- Search input untuk filter tiket berdasarkan subject/ticket_number
- Filter tabs/buttons: Semua, Aktif, Eskalasi, Selesai
- Tampilan jumlah tiket terfilter

### 4. Ticket List -- Upgrade Visual
- Card tiket dengan visual yang lebih polished:
  - Border-left warna sesuai priority (Critical = merah, High = orange)
  - Badge priority dengan animasi pulse untuk Critical
  - SLA indicator yang lebih prominent
  - Deskripsi truncated (line-clamp-2)
  - Info project, tanggal dibuat
  - Hover shadow yang lebih halus
- Tiket yang dipilih diberi highlight border + background

### 5. Detail Panel -- Lebih Kaya
- Sticky panel di kanan (desktop)
- Header: ticket number, subject, badges (status + priority + SLA)
- Section "Deskripsi" dengan card terpisah
- Grid info: Created, Resolved, Project, Assigned To
- Timeline visual sederhana menunjukkan status saat ini dalam flow (Open -> In Progress -> Resolved -> Closed)
- Tombol aksi: "Tutup Tiket" jika statusnya sudah Resolved

### 6. Empty State -- Upgrade
- Ilustrasi icon yang lebih besar
- Teks dalam Bahasa Indonesia
- CTA button "Buat Tiket Baru"

### 7. Animasi Scroll-Reveal
- RevealCard wrapper pada setiap section (hero, stats, list, detail)
- Staggered delay untuk efek cascade

### 8. Teks UI
- Semua teks dalam Bahasa Indonesia: "Pusat Bantuan", "Tiket Aktif", "Eskalasi", "Terselesaikan", "Pilih tiket untuk melihat detail", dll.

---

## Detail Teknis

### File yang Dimodifikasi
- `src/pages/client/ClientSupport.tsx` -- refactor komprehensif

### Pendekatan
- Tidak ada perubahan database
- Tidak ada dependency baru
- Menggunakan `RevealCard` pattern yang sama dari `ClientAccount.tsx`
- Menggunakan `useScrollReveal` hook yang sudah ada
- Data yang sudah tersedia dari `useClientTickets`: ticket_number, subject, description, status, priority, sla_deadline, created_at, resolved_at, projects.name
- Icon dari lucide-react: HeadphonesIcon, Clock, AlertTriangle, CheckCircle, Filter, Search, ChevronRight, Inbox, dll
- Menggunakan Card/CardHeader/CardContent dari shadcn/ui
- Responsive: 3 kolom di desktop (2 list + 1 detail), 1 kolom di mobile
- Filter state lokal menggunakan useState
