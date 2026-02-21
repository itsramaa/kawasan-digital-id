
# Navbar: Tambah Dropdown "Help Center"

## Perubahan

Mengubah navigasi storefront dari link flat menjadi struktur dengan dropdown. "How It Works", "Help / FAQ", dan "Contact" digabung ke dalam satu dropdown **Help Center**.

### Urutan Navbar Baru

```text
Home | Templates | Custom Website | Portfolio | Help Center (dropdown)
```

### Isi Dropdown Help Center

| Item | Target |
|------|--------|
| How It Works | `/store#how-it-works` (scroll) |
| Help / FAQ | `/store#faq-section` (scroll) |
| Contact | `/store#contact` atau halaman baru (scroll ke footer/contact section) |

---

## Detail Teknis

### File yang diubah: `src/shared/components/layouts/StorefrontLayout.tsx`

1. **Update `navLinks`** -- hapus "How It Works" dan "Help / FAQ" sebagai item terpisah, tambahkan "Portfolio" tetap sebagai link biasa.

2. **Buat komponen `HelpCenterDropdown`** di dalam file yang sama:
   - Tombol "Help Center" dengan chevron icon
   - Dropdown menu muncul on click (bukan hover, supaya mobile-friendly)
   - Menu berisi 3 link: How It Works, Help / FAQ, Contact
   - Click outside menutup dropdown
   - Background solid `bg-popover` dengan border dan shadow (tidak transparan)
   - z-index tinggi (`z-50`)

3. **Desktop nav**: render 4 link biasa + `HelpCenterDropdown` di akhir

4. **Mobile nav**: dropdown items ditampilkan sebagai sub-items (indented) di bawah label "Help Center" yang bisa di-expand/collapse (accordion style)

### Navigasi baru (data):

```text
navLinks = [
  { label: "Home", path: "/store" },
  { label: "Templates", path: "/store/templates" },
  { label: "Custom Website", path: "/store/templates", hash: "#custom-section" },
  { label: "Portfolio", path: "/store/showcase" },
]

helpCenterLinks = [
  { label: "How It Works", path: "/store", hash: "#how-it-works" },
  { label: "Help / FAQ", path: "/store", hash: "#faq-section" },
  { label: "Contact", path: "/store", hash: "#contact" },
]
```

### Import tambahan
- `ChevronDown` dari `lucide-react`
- `useRef`, `useEffect` untuk click-outside handler
