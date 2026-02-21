
# Buat Halaman Legal & Update Footer

## Halaman Baru yang Dibuat

Tiga halaman legal yang saat ini hanya teks biasa di footer akan dijadikan halaman nyata:

1. **Privacy Policy** (`/privacy`) -- Kebijakan privasi standar untuk layanan web development
2. **Terms of Service** (`/terms`) -- Syarat dan ketentuan layanan
3. **Refund Policy** (`/refund`) -- Kebijakan pengembalian dana

Setiap halaman akan menggunakan `StorefrontLayout` dan menampilkan konten legal yang relevan untuk bisnis web development agency (Kawasan Digital).

## Perubahan pada Footer

Update kolom "Legal" di footer -- ubah dari `<span>` menjadi `<Link>` yang mengarah ke halaman masing-masing. Juga update link "How It Works" di kolom Help menjadi anchor link `/#how-it-works` karena kontennya sudah ada di homepage.

## Detail Teknis

### File Baru
- `src/pages/store/PrivacyPolicyPage.tsx` -- Halaman Privacy Policy dengan StorefrontLayout
- `src/pages/store/TermsOfServicePage.tsx` -- Halaman Terms of Service dengan StorefrontLayout
- `src/pages/store/RefundPolicyPage.tsx` -- Halaman Refund Policy dengan StorefrontLayout

### File Diubah
- **`src/App.tsx`** -- Tambah 3 route baru: `/privacy`, `/terms`, `/refund`
- **`src/shared/components/layouts/StorefrontLayout.tsx`** -- Update footer:
  - Ubah 3 `<span>` di Legal menjadi `<Link>` ke `/privacy`, `/terms`, `/refund`
  - Ubah link "How It Works" dari `/how-it-works` ke `/#how-it-works`
