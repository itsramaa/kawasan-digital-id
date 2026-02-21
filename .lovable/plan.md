

# Maksimalkan Halaman Infrastructure Client

## Ringkasan
Upgrade halaman Infrastructure (`/dashboard/infrastructure`) agar konsisten dengan style halaman Profile dan Support yang sudah di-upgrade -- hero banner, summary stat cards, tab navigation, detail cards yang lebih polished, animasi scroll-reveal, dan teks UI dalam Bahasa Indonesia.

---

## Perubahan yang Akan Dilakukan

### 1. Hero Banner + Breadcrumb
- Breadcrumb: Dashboard > Infrastruktur
- Gradient banner konsisten (`bg-gradient-to-br from-primary/10 via-primary/5 to-transparent`)
- Icon Globe besar di banner
- Judul "Infrastruktur" + subtitle "Domain, hosting, dan status layanan Anda"

### 2. Summary Stat Cards (4 kartu)
- **Total Domain** -- icon Globe, jumlah domain
- **Domain Kadaluarsa** -- icon AlertTriangle, jumlah expiring/expired, warna warning/error
- **Total Hosting** -- icon Server, jumlah hosting aktif
- **SSL Aktif** -- icon Shield, placeholder atau jumlah domain dengan auto_renew aktif
- Masing-masing dengan `RevealCard` animasi

### 3. Tab Navigation (Domain & Hosting)
- Menggunakan `Tabs` dari shadcn/ui untuk switch antara Domain dan Hosting
- Tab icons: Globe untuk Domain, Server untuk Hosting
- Jumlah item di setiap tab label (contoh: "Domain (5)")

### 4. Domain Cards -- Upgrade Visual
- Card yang lebih polished dengan layout terstruktur:
  - Header: domain name (font-mono) + status badge
  - Progress bar visual untuk sisa hari sebelum expired (hijau > 90 hari, kuning 30-90, merah < 30)
  - Grid info: Registrar, Tanggal Kadaluarsa (formatted), Auto-Renew (icon check/cross)
  - Border-left accent warna sesuai status (hijau = aktif, kuning = expiring, merah = expired)
  - Hover shadow effect
- Teks: "Registrar", "Kadaluarsa", "Perpanjangan Otomatis"

### 5. Hosting Cards -- Upgrade Visual
- Card yang lebih polished:
  - Header: server name + status badge
  - Badge server_type (VPS, Shared, Dedicated, dll)
  - Grid info: Provider, Tipe, Kadaluarsa
  - Border-left accent warna sesuai status
  - Hover shadow effect
- Teks: "Penyedia", "Tipe Server", "Kadaluarsa"

### 6. Alert Banners -- Upgrade
- Tetap tampilkan alert untuk domain/hosting yang expiring
- Teks dalam Bahasa Indonesia: "X domain akan kadaluarsa dalam 30 hari"
- Style konsisten dengan halaman lain

### 7. Empty State -- Upgrade
- Icon lebih besar dengan background circle
- Teks dalam Bahasa Indonesia
- Tampilan yang lebih polished

### 8. Animasi Scroll-Reveal
- `RevealCard` wrapper pada hero, stats, tabs, setiap card
- Staggered delay untuk efek cascade

---

## Detail Teknis

### File yang Dimodifikasi
- `src/pages/client/ClientInfrastructure.tsx` -- refactor komprehensif

### Pendekatan
- Tidak ada perubahan database
- Tidak ada dependency baru
- Menggunakan `RevealCard` pattern dari `ClientAccount.tsx`
- Menggunakan `useScrollReveal` hook yang sudah ada
- Menggunakan `Card`, `CardContent`, `CardHeader` dari shadcn/ui
- Menggunakan `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` dari shadcn/ui
- Data yang sudah tersedia: domain_name, status, registrar, expiry_date, auto_renew, name, provider, server_type
- Icon dari lucide-react: Globe, Server, Shield, AlertTriangle, CheckCircle, ChevronRight, Calendar, Clock
- Responsive: grid 2 kolom di desktop, 1 kolom di mobile
- Semua teks UI dalam Bahasa Indonesia

