
# Hapus "Contact" dari Navigasi Storefront

## Perubahan

Menghapus link "Contact" dari dropdown **Help Center** di navbar storefront. Setelah perubahan, dropdown Help Center hanya berisi:

1. How It Works
2. Help / FAQ

## Detail Teknis

### File: `src/shared/components/layouts/StorefrontLayout.tsx`

**1. Update `helpCenterLinks` array (baris 15-19)**
Hapus entry `{ label: "Contact", path: "/contact" }` sehingga hanya tersisa 2 item.

**2. Update Footer section "Help" (baris 260-268)**
Hapus link Contact dari kolom Help di footer, menyisakan "How It Works" dan "FAQ".

### Tidak Dihapus
- Route `/contact` di `App.tsx` tetap ada (halaman masih bisa diakses via URL langsung)
- File `ContactPage.tsx` tidak dihapus
- Nanti akan digantikan oleh floating live chat button
