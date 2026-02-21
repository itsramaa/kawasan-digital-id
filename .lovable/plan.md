

# Maksimalisasi Lanjutan: Lokalisasi, Accessibility, Responsive, dan Bug Fixes

Berdasarkan audit menyeluruh terhadap seluruh codebase client portal dan referensi `.trae/skills`, berikut temuan yang belum diperbaiki dan rencana implementasinya.

---

## Temuan yang Masih Tersisa

### 1. Lokalisasi Belum Tuntas (Bahasa Inggris Masih Tersebar)
Beberapa komponen dan halaman masih menggunakan Bahasa Inggris:

| File | Teks Inggris | Harus |
|------|-------------|-------|
| `ClientLayout.tsx` | "Profile", "Logout" (dropdown) | "Profil", "Keluar" |
| `ActivityTimeline.tsx` | "No recent activity.", "Project", "Invoice", "Ticket" | "Belum ada aktivitas terbaru.", "Proyek", "Tagihan", "Tiket" |
| `ActivityLogList.tsx` | "Loading...", "No activity recorded yet." | "Memuat...", "Belum ada aktivitas tercatat." |
| `DocumentUpload.tsx` | "Documents", "Uploading...", "Click to upload a file", "Description (optional)", "No documents uploaded yet.", "Loading...", "Download" | Semua ke Bahasa Indonesia |
| `FeedbackSurvey.tsx` | "Feedback Submitted", "Overall", "Communication", "Quality", "Timeliness", "Would you recommend us?", "Yes", "No", "Any additional comments...", "Submit Feedback", "Submitting...", "How was your experience?" | Semua ke Bahasa Indonesia |
| `ClientSupport.tsx` | Breadcrumb "Dashboard > Support" (baris 148-151), hero banner masih inline (tidak pakai shared `HeroBanner`) | Gunakan `HeroBanner` + lokalisasi |
| `ClientMessages.tsx` | Hero banner masih inline (tidak pakai shared `HeroBanner`) | Gunakan `HeroBanner` |
| `ClientAccount.tsx` | Breadcrumb "Dasbor > Profil" manual, hero masih inline, "Read Only" label | Gunakan `HeroBanner` + "Hanya Baca" |

### 2. Konsistensi Komponen Shared (DRY)
- `ClientSupport.tsx`: Masih menggunakan stat cards inline (baris 177-198) alih-alih shared `StatCards`
- `ClientSupport.tsx`: Hero banner inline, bukan shared `HeroBanner`
- `ClientMessages.tsx`: Hero banner inline, bukan shared `HeroBanner`
- `ClientMessages.tsx`: Stat cards inline, bukan shared `StatCards`
- `ClientAccount.tsx`: Hero banner inline, bukan shared `HeroBanner`

### 3. Accessibility Tambahan
- `DocumentUpload.tsx`: Upload button tidak punya `aria-label`
- `DocumentUpload.tsx`: Download button hanya punya `title`, perlu `aria-label`
- `FeedbackSurvey.tsx`: Star rating tidak punya `aria-label` per bintang
- `FeedbackSurvey.tsx`: Recommend buttons tidak punya `aria-pressed`
- `ClientSupport.tsx`: Filter buttons masih tanpa `role="tablist"` / `role="tab"` / `aria-selected`
- `ClientSupport.tsx`: Search input tidak punya `aria-label`
- `EmptyState.tsx`: Tidak punya `role="status"` untuk screen reader

### 4. Loading State Bisa Ditingkatkan
- Semua halaman client menampilkan teks "Memuat..." -- bisa diganti skeleton loading
- `ActivityLogList.tsx`: "Loading..." tanpa skeleton
- `DocumentUpload.tsx`: "Loading..." tanpa skeleton

### 5. Bug Fix: FinalCTA ref Warning
- `FinalCTA.tsx` menggunakan `useScrollReveal` yang mengembalikan `ref` langsung ke `<section>` -- ini sudah benar (bukan forwardRef issue)
- Badge component sudah tidak pakai forwardRef -- ini sudah OK

---

## Rencana Implementasi

### Fase 1: Lokalisasi Tuntas

**1a. `ActivityTimeline.tsx`**: Ganti semua teks Inggris ke Indonesia
**1b. `ActivityLogList.tsx`**: Ganti "Loading..." dan empty state
**1c. `DocumentUpload.tsx`**: Lokalisasi semua teks (judul, placeholder, status upload, empty state)
**1d. `FeedbackSurvey.tsx`**: Lokalisasi semua teks (judul, label rating, tombol, placeholder)
**1e. `ClientLayout.tsx`**: Ganti "Profile" dan "Logout" di dropdown

### Fase 2: Konsistensi Shared Components

**2a. `ClientSupport.tsx`**: Refactor untuk menggunakan `HeroBanner` dan `StatCards` shared components, hapus inline hero/stat, tambah `role="tablist"` pada filter, `aria-label` pada search
**2b. `ClientMessages.tsx`**: Refactor untuk menggunakan `HeroBanner`, hapus inline hero
**2c. `ClientAccount.tsx`**: Ganti "Read Only" ke "Hanya Baca"

### Fase 3: Accessibility

**3a. `DocumentUpload.tsx`**: Tambah `aria-label` pada upload dan download buttons
**3b. `FeedbackSurvey.tsx`**: Tambah `aria-label` per star, `aria-pressed` pada recommend buttons
**3c. `EmptyState.tsx`**: Tambah `role="status"`
**3d. `ClientSupport.tsx`**: Tambah `role="tablist"` dan `aria-selected` pada filter tabs

### Fase 4: Skeleton Loading

**4a. Buat `LoadingSkeleton` component** di `src/shared/components/common/LoadingSkeleton.tsx` -- reusable skeleton untuk halaman client (stat cards skeleton, list skeleton, table skeleton)
**4b. Ganti semua "Memuat..." text** dengan skeleton di semua halaman client yang masih menggunakan teks loading

---

## Detail Teknis

### File Baru
| File | Deskripsi |
|------|-----------|
| `src/shared/components/common/LoadingSkeleton.tsx` | Komponen skeleton loading reusable (page, stat, list, table varian) |

### File yang Dimodifikasi
| File | Perubahan |
|------|-----------|
| `src/features/client/components/ActivityTimeline.tsx` | Lokalisasi teks |
| `src/features/client/components/ActivityLogList.tsx` | Lokalisasi teks |
| `src/features/client/components/DocumentUpload.tsx` | Lokalisasi + a11y (aria-label) |
| `src/features/client/components/FeedbackSurvey.tsx` | Lokalisasi + a11y (aria-label, aria-pressed) |
| `src/features/client/components/EmptyState.tsx` | Tambah `role="status"` |
| `src/shared/components/layouts/ClientLayout.tsx` | "Profile" -> "Profil", "Logout" -> "Keluar" |
| `src/pages/client/ClientSupport.tsx` | Gunakan `HeroBanner` + `StatCards`, tambah a11y pada filter/search |
| `src/pages/client/ClientMessages.tsx` | Gunakan `HeroBanner` |
| `src/pages/client/ClientAccount.tsx` | "Read Only" -> "Hanya Baca" |
| Semua halaman dengan "Memuat..." | Ganti dengan skeleton loading |

### Tidak Ada Perubahan Schema/Database
Semua perubahan hanya di frontend.

