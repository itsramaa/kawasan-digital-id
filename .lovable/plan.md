
# Ganti Section "How It Works" di Home dengan Konten Full Page

## Apa yang Berubah

Section "Cara Kerja" di halaman Home saat ini hanya menampilkan 5 langkah ringkas dengan link "Pelajari Lebih Lanjut". Rencana ini **mengganti seluruh isi** komponen `HowItWorks.tsx` dengan konten lengkap dari `HowItWorksPage.tsx` -- 4 fase, 10 langkah detail, zigzag layout, dan CTA section. Link "Pelajari Lebih Lanjut" dihapus karena semua konten sudah ditampilkan langsung di Home.

## Detail Teknis

### File: `src/features/storefront/components/home/HowItWorks.tsx`

Isi file diganti total. Komponen baru akan:
- Menggunakan data `PHASES` (4 fase, 10 langkah) dari `HowItWorksPage.tsx`
- Menampilkan `PhaseSection` dengan `StepCard` zigzag layout
- Menampilkan `CTASection` dengan trust signals di bagian bawah
- Menampilkan header section dengan badge "10 Langkah Mudah"
- Menghapus link "Pelajari Lebih Lanjut" (tidak perlu lagi)
- Tetap export sebagai named export `HowItWorks` agar `StorefrontHome.tsx` tidak perlu diubah

### File: `src/pages/store/HowItWorksPage.tsx`

Tidak diubah. Halaman `/how-it-works` tetap ada sebagai halaman mandiri yang bisa diakses dari navbar.

### File yang Tidak Diubah
- `StorefrontHome.tsx` -- tetap import `HowItWorks` seperti sekarang
- `App.tsx` -- route `/how-it-works` tetap ada
