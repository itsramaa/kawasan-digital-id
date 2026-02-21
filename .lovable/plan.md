
# Perapian & Sortir Navbar Dashboard Klien

## Masalah Saat Ini
Navbar memiliki **9 item** yang terlalu banyak untuk navigasi horizontal, menyebabkan tampilan "acak-acakan" terutama di layar yang tidak terlalu lebar:

```
Dasbor | Proyek | Pesanan | Kontrak | Invoice | Pembayaran | Infrastruktur | Bantuan | Pesan
```

## Rencana Perubahan

### 1. Hapus "Pesan"
Sesuai permintaan, tab "Pesan" akan dihapus dari navbar karena akan diganti dengan floating live chat button di masa depan. Import `useUnreadCount` dan badge unread juga akan dibersihkan.

### 2. Gabungkan "Invoice" dan "Pembayaran" menjadi "Keuangan"
Kedua halaman ini saling terkait (invoice = tagihan, pembayaran = bukti bayar). Digabungkan menjadi satu tab "Keuangan" yang mengarah ke `/dashboard/invoices` sebagai default. Halaman pembayaran tetap bisa diakses melalui sub-navigasi di dalam halaman tersebut atau via link internal.

### 3. Urutan Navbar Baru (6 item)
Disusun berdasarkan prioritas dan frekuensi penggunaan klien:

```
Dasbor | Proyek | Pesanan | Keuangan | Infrastruktur | Bantuan
```

| No | Label | Path | Alasan Urutan |
|----|-------|------|---------------|
| 1 | Dasbor | `/dashboard` | Halaman utama, selalu pertama |
| 2 | Proyek | `/dashboard/projects` | Aktivitas inti klien |
| 3 | Pesanan | `/dashboard/orders` | Terkait pembelian dari storefront |
| 4 | Keuangan | `/dashboard/invoices` | Gabungan Invoice + Pembayaran |
| 5 | Infrastruktur | `/dashboard/infrastructure` | Domain & hosting |
| 6 | Bantuan | `/dashboard/support` | Support/tiket |

### 4. Tab "Kontrak" Dihapus dari Navbar
Kontrak terkait erat dengan proyek dan jarang diakses secara mandiri. Akses kontrak tetap tersedia melalui:
- Quick action di Dashboard
- Link dari halaman Proyek
- Route `/dashboard/contracts` tetap ada, hanya tidak di navbar utama

### 5. "Keuangan" Aktif untuk Kedua Path
Tab "Keuangan" akan menampilkan state aktif (highlighted) ketika user berada di `/dashboard/invoices` ATAU `/dashboard/payments`.

## Detail Teknis

### File yang Dimodifikasi

| File | Perubahan |
|------|-----------|
| `src/shared/components/layouts/ClientLayout.tsx` | Update `navItems` array: hapus Pesan, hapus Kontrak, gabung Invoice+Pembayaran jadi "Keuangan", bersihkan import `useUnreadCount` dan `MessageSquare` |

### Tidak Ada Perubahan Routing
Semua route (`/dashboard/contracts`, `/dashboard/payments`, `/dashboard/messages`) tetap ada di `App.tsx` dan tetap bisa diakses via URL langsung. Hanya navbar yang disederhanakan.
