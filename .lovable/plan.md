

# Audit Komprehensif & Maksimalisasi Client Portal

Berdasarkan analisis mendalam terhadap seluruh halaman client portal dan referensi dari `.trae/skills` (clean-architecture, responsive-design, accessibility-compliance, react-patterns, performance-optimization, security-auditor, design-system-patterns), berikut temuan dan rencana perbaikan:

---

## Temuan Audit

### 1. DRY Violation: RevealCard Diduplikasi 10x
Komponen `RevealCard` yang identik didefinisikan ulang di **setiap halaman client** (10 file). Ini melanggar prinsip DRY yang ditekankan di skill `clean-architecture` dan `react-patterns`.

### 2. Accessibility (WCAG 2.2)
Berdasarkan skill `accessibility-compliance`:
- **Stat cards** tidak punya `aria-label` -- screen reader tidak bisa membaca konteks angka
- **Tombol filter** di Support dan Messages tidak menggunakan `role="tablist"` / `role="tab"`
- **DataTable** pagination buttons tidak punya `aria-label` ("Halaman sebelumnya", "Halaman 1", dll.)
- **Overdue alerts** tidak menggunakan `role="alert"` untuk announce otomatis ke screen reader
- **Mobile nav toggle** tidak punya `aria-expanded` state
- **Search inputs** tidak punya `aria-label` yang deskriptif
- **PieChart** di Dashboard tidak punya teks alternatif untuk screen reader
- **Heading hierarchy**: beberapa halaman langsung skip ke `<h2>` tanpa section landmark

### 3. Responsive Design
Berdasarkan skill `responsive-design`:
- **DataTable** tidak memiliki responsive mobile view -- tabel horizontal scroll pada mobile kurang ideal
- **Stat cards** menggunakan `grid-cols-2` yang sudah baik, tapi text `Rp XXM` bisa terpotong pada layar kecil
- **Infrastructure** domain/hosting cards sudah responsive, tapi info grid `grid-cols-3` bisa terlalu sempit di mobile
- **Support page** split layout `xl:grid-cols-3` tidak optimal, detail panel sticky terlalu panjang di tablet

### 4. Performance
Berdasarkan skill `performance-optimization` dan `web-performance-optimization`:
- **PieChart** dari recharts di-import tanpa lazy loading -- menambah bundle size meski hanya 1 halaman
- **useScrollReveal** di setiap card membuat banyak `IntersectionObserver` instances -- bisa di-batch
- **ClientDashboard** memanggil 6 hooks query secara paralel -- overhead tapi acceptable karena data ringan

### 5. Security (RLS)
Berdasarkan skill `security-auditor` dan `api-security-best-practices`:
- **RLS policies menggunakan `RESTRICTIVE` (Permissive: No)** -- ini berarti semua policy harus pass. Jika client punya 2 restrictive SELECT policies, keduanya harus true. Ini sudah benar untuk tabel yang punya policy "Internal" + "Client".
- **Inquiries table** hanya punya policy untuk internal users -- klien tidak bisa lihat inquiry mereka sendiri (mungkin intentional)
- **Activity logs INSERT** policy membutuhkan `user_id = auth.uid()` DAN `client_id = get_user_client_id()` -- ini sudah aman

### 6. Konsistensi UI/UX
Berdasarkan skill `design-system-patterns` dan `ui-ux-designer`:
- **Pagination text** di DataTable menggunakan bahasa Inggris ("Showing 1-25 of 50", "rows") -- harus di-lokalisasi ke Indonesia
- **Nav labels** di ClientLayout campur bahasa: "Dashboard", "Projects", "Support" (English) + "Pesan" (Indonesia)
- **Hero banner** di setiap halaman sangat mirip -- bisa dijadikan shared component
- **Loading state** hanya teks "Memuat..." -- bisa ditingkatkan dengan skeleton
- **Empty state** tidak konsisten: beberapa halaman pakai `EmptyState` component, yang lain inline

### 7. Console Errors
- `FinalCTA` dan `Badge` component mendapat ref warning -- perlu `React.forwardRef`

---

## Rencana Implementasi

### Fase 1: Extract Shared Components (DRY)

**1a. Extract `RevealCard` ke shared component**
- Buat `src/shared/components/common/RevealCard.tsx`
- Hapus 10 duplikasi dari semua halaman client
- Import dari shared location

**1b. Extract `HeroBanner` ke shared component**
- Buat `src/shared/components/common/HeroBanner.tsx` dengan props: `icon`, `title`, `subtitle`, `breadcrumb`, `actions`
- Refactor semua 10 halaman untuk menggunakan komponen ini

**1c. Extract `StatCards` ke shared component**
- Buat `src/shared/components/common/StatCards.tsx`
- Menerima array `{ label, value, icon, color }` -- pattern yang sudah identik di semua halaman

### Fase 2: Accessibility (A11y)

**2a. Alert banners**: Tambah `role="alert"` dan `aria-live="polite"` pada `AlertBanner` component
**2b. Stat cards**: Tambah `aria-label` yang menggabungkan label + value (e.g. `"Proyek Aktif: 3"`)
**2c. Filter buttons**: Gunakan `role="tablist"` dan `role="tab"` + `aria-selected` di Support & Messages
**2d. Mobile nav**: Tambah `aria-expanded={mobileOpen}` dan `aria-label="Menu navigasi"`
**2e. DataTable pagination**: Tambah `aria-label` pada semua button navigasi
**2f. PieChart**: Tambah hidden `<p>` summary untuk screen reader
**2g. Search inputs**: Tambah `aria-label` deskriptif

### Fase 3: Lokalisasi & Konsistensi

**3a. DataTable pagination**: Ganti "Showing X-Y of Z" menjadi "Menampilkan X-Y dari Z", "rows" menjadi "baris"
**3b. Nav labels**: Seragamkan ke Bahasa Indonesia -- "Dasbor", "Proyek", "Pesanan", "Kontrak", "Invoice", "Pembayaran", "Infrastruktur", "Bantuan", "Pesan"
**3c. Empty states**: Standardisasi penggunaan `EmptyState` component di semua halaman yang belum menggunakannya

### Fase 4: Responsive Optimization

**4a. DataTable mobile**: Tambah responsive card view untuk layar < 768px sebagai alternatif tabel
**4b. Infrastructure info grid**: Ubah `grid-cols-3` menjadi `grid-cols-2 sm:grid-cols-3` pada mobile
**4c. Support detail panel**: Perbaiki sticky behavior dan ukuran pada tablet viewport

### Fase 5: Bug Fixes

**5a. Fix `forwardRef` warning**: Update `FinalCTA` dan `Badge` component agar menggunakan `React.forwardRef`
**5b. Fix `useEffect` missing dependency**: Di `ClientMessages.tsx` ConversationPanel, `markAsRead` dalam dependency array bisa menyebabkan infinite loop -- gunakan ref

---

## Detail Teknis

### File yang Dibuat Baru
| File | Deskripsi |
|------|-----------|
| `src/shared/components/common/RevealCard.tsx` | Komponen animasi scroll-reveal reusable |
| `src/shared/components/common/HeroBanner.tsx` | Banner header halaman reusable |
| `src/shared/components/common/StatCards.tsx` | Grid kartu statistik reusable |

### File yang Dimodifikasi
| File | Perubahan |
|------|-----------|
| 10x `src/pages/client/*.tsx` | Hapus duplikasi RevealCard, gunakan shared components |
| `src/shared/components/common/DataTable.tsx` | Lokalisasi pagination, tambah a11y, responsive card view |
| `src/shared/components/layouts/ClientLayout.tsx` | Lokalisasi nav labels, a11y pada mobile toggle |
| `src/features/client/components/AlertBanner.tsx` | Tambah `role="alert"` |
| `src/shared/components/ui/badge.tsx` | Fix forwardRef warning |
| `src/features/storefront/components/home/FinalCTA.tsx` | Fix forwardRef warning |

### Tidak Ada Perubahan Schema/Database
Semua perubahan hanya di frontend -- tidak ada migrasi database yang diperlukan.

