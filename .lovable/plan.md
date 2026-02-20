

# Rename "Portfolio" menjadi "Showcase"

## Perubahan

Mengganti semua referensi "Portfolio" menjadi "Showcase" di seluruh aplikasi storefront.

### 1. Route & Navigasi

- Route `/store/portfolio` diganti menjadi `/store/showcase`
- Label navigasi "Portfolio" diganti "Showcase" di `StorefrontLayout.tsx`

### 2. Halaman

- Rename file `PortfolioPage.tsx` menjadi `ShowcasePage.tsx`
- Judul halaman "Our Portfolio" diganti "Our Showcase"
- Deskripsi "Projects we've delivered..." tetap atau disesuaikan

### 3. Link di StorefrontHome

- Link "Lihat Semua" mengarah ke `/store/showcase` (bukan `/store/portfolio`)
- Komentar "Portfolio Compact" diganti "Showcase Compact"

### 4. App.tsx

- Import dari `ShowcasePage` (bukan `PortfolioPage`)
- Route path diganti `/store/showcase`

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/store/PortfolioPage.tsx` | Rename jadi `ShowcasePage.tsx`, ubah judul & export |
| `src/shared/components/layouts/StorefrontLayout.tsx` | Label "Portfolio" -> "Showcase", path -> `/store/showcase` |
| `src/pages/store/StorefrontHome.tsx` | Link ke `/store/showcase`, ubah komentar |
| `src/App.tsx` | Import & route path update |

