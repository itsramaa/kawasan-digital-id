
# Custom Website Wizard + Cart Page Upgrade

## Ringkasan

Dua fitur besar:
1. **Custom Website Page** -- wizard multi-step (4 langkah) untuk request website custom, dengan estimasi harga dan timeline otomatis, lalu CTA deposit ke checkout
2. **Cart Page Upgrade** -- tambah fitur edit add-ons (link kembali ke PDP), coupon input (UI only), dan tampilan yang lebih lengkap

---

## 1. Custom Website Wizard (`/store/custom`)

### Halaman baru: `src/pages/store/CustomWebsitePage.tsx`

Wizard 4 step dengan progress bar di atas. Data disimpan di local state (tidak ke DB sampai checkout).

### Step 1: Basic Info

| Field | Tipe UI | Opsi |
|-------|---------|------|
| Industry | Select dropdown | Technology, F&B, Fashion, Health, Education, Real Estate, Finance, Other |
| Website Type | Radio cards | Company Profile, Ecommerce, Landing Page, Portfolio, Blog, Web App |
| Estimated Pages | Slider atau number input | 1-20+ halaman |

### Step 2: Features

Checkbox grid:
- Ecommerce / Product Catalog
- Payment Gateway Integration
- Multi-language Support
- Membership / Login System
- Booking / Appointment System
- Blog / News Section
- Contact Form
- Live Chat Integration

### Step 3: Timeline dan Budget

| Field | Tipe UI |
|-------|---------|
| Deadline | Date picker atau pilihan radio (ASAP, 2 minggu, 1 bulan, 2 bulan, fleksibel) |
| Budget Range | Radio cards (Rp 3-5jt, 5-10jt, 10-20jt, 20jt+, Belum tahu) |

### Step 4: Summary dan Estimation

Tampilkan ringkasan semua pilihan user, lalu hitung estimasi:

```text
Scope Summary
-----------------------
Industry:      Technology
Type:          Ecommerce
Pages:         ~8
Features:      Payment Gateway, Membership, Blog

Estimated Price Range:  Rp 8.000.000 - Rp 12.000.000
Estimated Timeline:     21 - 30 hari

[Pay Deposit to Start] --> ke /store/checkout (custom mode)
[Save as Draft / Contact Us] --> alternatif CTA
```

**Logika estimasi (client-side, sederhana):**
- Base: tergantung website type (Company Profile: 3jt, Ecommerce: 7jt, dst)
- Per page tambahan: +500rb
- Per feature: +1-3jt tergantung kompleksitas
- Timeline: base 14 hari + 2 hari per page + 3-7 hari per feature kompleks
- Hasil ditampilkan sebagai range (min-max)

### Routing

Tambah route baru di `App.tsx`:
```text
/store/custom --> CustomWebsitePage
```

Update navbar link "Custom Website" dari `/store/templates#custom-section` ke `/store/custom`.

### Database

Tabel baru `custom_inquiries` untuk menyimpan data wizard saat checkout:

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | PK |
| user_id | uuid | nullable, diisi saat checkout |
| industry | text | |
| website_type | text | |
| estimated_pages | integer | |
| selected_features | jsonb | array string |
| deadline | text | |
| budget_range | text | |
| estimated_price_min | numeric | |
| estimated_price_max | numeric | |
| estimated_days_min | integer | |
| estimated_days_max | integer | |
| status | text | default 'draft' |
| created_at | timestamptz | default now() |

RLS: user bisa baca/tulis milik sendiri, internal users bisa manage semua.

---

## 2. Cart Page Upgrade

### File: `src/pages/store/CartPage.tsx`

Perubahan pada cart page yang sudah ada:

### A. Edit Add-Ons

Setiap item di cart menampilkan link "Edit Add-ons" yang mengarahkan kembali ke PDP (`/store/templates/:id`) agar user bisa mengubah pilihan add-on. Saat kembali dari PDP dan add to cart lagi, item di cart ter-update (sudah didukung oleh logic upsert di `useCart`).

### B. Remove Item

Sudah ada (tombol trash). Tidak perlu perubahan.

### C. Coupon Input

Tambah section coupon di sidebar summary:
- Input field + tombol "Apply"
- UI only untuk saat ini (tidak ada backend coupon system)
- State: `couponCode` string, `couponApplied` boolean
- Jika diklik Apply, tampilkan pesan "Coupon feature coming soon" via toast

### D. Layout Upgrade

- Tambah thumbnail kecil di setiap cart item (ambil dari template data)
- Tampilkan delivery time per item
- Tampilkan subtotal dan total lebih jelas
- Tampilkan jumlah item di header ("Shopping Cart (3 items)")

### Perubahan di `useCart` hook

Tambah `thumbnail_url` dan `estimated_days` ke `CartItem` interface agar bisa ditampilkan di cart:

```text
CartItem {
  ...existing fields
  thumbnail_url: string | null   // baru
  estimated_days: number | null  // baru
}
```

Update `loadCart` untuk mengambil `thumbnail_url` dan `estimated_days` dari `service_templates`.

---

## File yang Diubah/Dibuat

| File | Aksi |
|------|------|
| Migration SQL | Buat tabel `custom_inquiries` + RLS |
| `src/pages/store/CustomWebsitePage.tsx` | Baru -- wizard 4 step |
| `src/pages/store/CartPage.tsx` | Upgrade -- edit link, coupon UI, thumbnail, delivery time |
| `src/features/storefront/hooks/useCart.ts` | Update CartItem interface + loadCart query |
| `src/App.tsx` | Tambah route `/store/custom` |
| `src/shared/components/layouts/StorefrontLayout.tsx` | Update "Custom Website" nav link ke `/store/custom` |
| `src/pages/store/StorefrontHome.tsx` | Update "Custom Website" CTA link ke `/store/custom` |

---

## Catatan Teknis

- Wizard menggunakan local state (useState) dengan step counter, bukan routing per step
- Progress bar menggunakan komponen Progress yang sudah ada
- Estimasi harga dihitung murni client-side dengan formula sederhana (bisa disesuaikan nanti)
- Coupon system hanya UI placeholder -- backend bisa ditambahkan nanti
- Cart item edit dilakukan via redirect ke PDP (re-use existing flow), bukan inline editing
- Custom inquiry disimpan ke DB hanya saat user klik "Pay Deposit" dan sudah login
