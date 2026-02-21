
# Fix & Maksimalisasi Checkout Page + Order Success Page

## Masalah Utama yang Ditemukan

### 1. Checkout Tidak Support Cart (Bug Kritis)
Halaman checkout saat ini **hanya mendukung single template** via query parameter (`?template_id=xxx&features=xxx`). Ketika user klik "Lanjut ke Checkout" dari halaman Cart, URL menjadi `/checkout` tanpa parameter -- menghasilkan tampilan **"No template selected"**. Ini adalah bug yang memblokir flow utama pembelian.

### 2. Semua Teks Masih Bahasa Inggris
- "Login Required", "Login to Continue"
- "Checkout", "Contact Information", "Name *", "Email *", "Phone", "Company", "Notes"
- "Payment Method", "Request Invoice", "Pay Online"
- "Place Order", "Processing...", "Failed to place order"
- "Order Summary", "Total"
- Order Success: "Order Placed Successfully!", "Back to Home", "Browse More Templates"

### 3. UI/UX Kurang Maksimal
- Tidak ada hero banner/breadcrumb seperti halaman Cart
- Tidak ada trust signals (padahal Cart punya)
- Tidak ada stepper/progress indicator (Cart -> Checkout -> Success)
- Loading state hanya skeleton sederhana
- Order Summary tidak menampilkan estimasi waktu
- Tidak ada link kembali ke Cart
- Order Success page sangat basic -- tidak ada order number, tidak ada detail pesanan

### 4. Console Error
- `forwardRef` warning pada CheckoutPage -- kemungkinan dari komponen yang menerima ref

### 5. Accessibility
- Label form tidak menggunakan `htmlFor`
- Payment method radio tidak punya `aria-label` group
- Error messages tidak punya `role="alert"`

---

## Rencana Implementasi

### Fase 1: Support Cart-Based Checkout (Bug Fix Kritis)

Refactor `CheckoutPage.tsx` agar mendukung **dua mode**:
- **Mode Single**: Ketika ada `?template_id=xxx` (direct checkout dari detail page)
- **Mode Cart**: Ketika tidak ada `template_id` -- ambil items dari `useCart()` hook

Logika:
```text
if (searchParams has template_id) -> single template mode (existing)
else -> cart mode: use useCart() items as order items
```

Pada mode cart, order summary menampilkan semua item dari keranjang dengan subtotal masing-masing. Saat submit, buat **satu order per item** (karena struktur tabel `orders` menggunakan `template_id` singular) atau buat satu order dengan semua items.

### Fase 2: Lokalisasi Penuh (Bahasa Indonesia)

Semua teks di CheckoutPage dan OrderSuccessPage diterjemahkan:
- "Checkout" -> "Checkout" (tetap, sudah umum)
- "Contact Information" -> "Informasi Kontak"
- "Name *" -> "Nama *"
- "Email *" -> "Email *"
- "Phone" -> "Telepon"
- "Company" -> "Perusahaan"
- "Notes" -> "Catatan"
- "Payment Method" -> "Metode Pembayaran"
- "Request Invoice" -> "Minta Invoice"
- "Pay Online" -> "Bayar Online"
- "Place Order" -> "Buat Pesanan"
- "Order Summary" -> "Ringkasan Pesanan"
- Validation messages ke Indonesia
- Order Success page sepenuhnya ke Indonesia

### Fase 3: Maksimalisasi UI/UX

**3a. Hero Banner + Breadcrumb**
Tambah hero section dengan gradient seperti CartPage:
- Breadcrumb: Home > Keranjang > Checkout
- Badge "Checkout"
- Title + subtitle kontekstual

**3b. Progress Stepper**
Tambah visual stepper 3 langkah:
```text
[1. Keranjang] ──── [2. Checkout (aktif)] ──── [3. Konfirmasi]
```

**3c. Trust Signals**
Tambah trust signals di sidebar Order Summary (seperti CartPage):
- Pembayaran Aman & Terverifikasi
- Garansi Revisi
- Support 24/7
- Gratis konsultasi

**3d. Order Summary Enhancement**
- Tampilkan estimasi waktu pengerjaan
- Tampilkan kategori template
- Tambah link "Edit Keranjang" kembali ke cart
- Accent line gradient di atas card summary

**3e. Order Success Page Enhancement**
- Tampilkan nomor pesanan (dari response order creation)
- Tampilkan ringkasan singkat (nama template, total)
- Tambah timeline next steps (apa yang terjadi selanjutnya)
- Link ke Dashboard Klien untuk track pesanan
- Animasi success yang lebih menarik

**3f. Login Gate Enhancement**
- Lokalisasi ke Indonesia
- Tambah ilustrasi yang lebih menarik
- Tambah info bahwa keranjang akan tersimpan

### Fase 4: Accessibility

- Tambah `htmlFor` pada semua label form
- Tambah `role="group"` dan `aria-label` pada payment method
- Tambah `role="alert"` pada error messages
- Tambah `aria-label` pada tombol submit

---

## Detail Teknis

### File yang Dimodifikasi
| File | Perubahan |
|------|-----------|
| `src/pages/store/CheckoutPage.tsx` | Refactor total: support cart mode, lokalisasi, hero banner, stepper, trust signals, a11y |
| `src/pages/store/OrderSuccessPage.tsx` | Enhancement: order number, detail pesanan, next steps, lokalisasi |
| `src/features/storefront/hooks/useCreateOrder.ts` | Return order data (order_number) untuk ditampilkan di success page |

### Tidak Ada Perubahan Schema/Database
Semua perubahan hanya di frontend. Struktur tabel `orders` sudah mendukung flow ini.

### Pendekatan Cart Checkout
Karena tabel `orders` memiliki kolom `template_id` (singular), untuk multi-item cart, akan dibuat **satu order per cart item** secara berurutan. Ini memungkinkan tracking independen per layanan yang dipesan. Setelah semua order berhasil dibuat, cart di-clear dan redirect ke success page.
