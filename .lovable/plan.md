
# Refactor Client Dashboard Header

## Ringkasan
Mengubah header dashboard client: hapus "Account" dari tab navbar, tambahkan search bar di tengah, dan user avatar dropdown di pojok kanan.

## Perubahan

### Layout Header Baru (3 bagian)
```text
[Logo + Brand]     [--- Search Bar ---]     [Avatar + Dropdown]
[Dashboard | Projects | Orders | Contracts | Invoices | Payments | Infrastructure | Support]
```

### 1. Hapus "Account" dari `navItems`
- Hapus entry `{ label: "Account", path: "/dashboard/account" }` dari array navItems di `ClientLayout.tsx`
- Route `/dashboard/account` tetap ada di `App.tsx` (masih bisa diakses via dropdown)

### 2. Tambah Search Bar (center)
- Input search dengan icon `Search` di tengah header
- Placeholder: "Search projects, invoices..."
- Styling: `bg-muted rounded-lg` dengan width responsif
- Saat ini hanya visual (no backend search), bisa dikembangkan nanti

### 3. User Avatar Dropdown (kanan)
- Avatar circle dengan inisial user (seperti yang sudah ada di admin sidebar)
- Nama user di samping avatar (hidden di mobile)
- Klik avatar buka dropdown menu dengan:
  - **Profile** -- navigasi ke `/dashboard/account`
  - **Logout** -- panggil `signOut()`
- Dropdown menggunakan Radix Popover atau custom dropdown (konsisten dengan LogoDropdown pattern di AppSidebar)
- Dropdown memiliki background solid, z-index tinggi, dan border

### File yang Dimodifikasi
- `src/shared/components/layouts/ClientLayout.tsx` -- refactor header section

### Detail Teknis
- Tidak ada dependency baru
- Menggunakan pattern dropdown yang sama dengan `LogoDropdown` di AppSidebar (useRef + click-outside)
- Import tambahan: `Search`, `ChevronDown` dari lucide-react
- Navigasi ke profile menggunakan `useNavigate`
- Mobile: search bar hidden, avatar tetap visible
