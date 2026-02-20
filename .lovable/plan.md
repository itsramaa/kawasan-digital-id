

# Upgrade Templates Page (PLP) dan Template Detail Page (PDP)

## Ringkasan

Dua halaman utama storefront akan di-upgrade secara signifikan:
- **Templates Page** (PLP): dari grid sederhana menjadi marketplace browsing page dengan sidebar filter, sorting, dan result count
- **Template Detail Page** (PDP): dari layout minimal menjadi full product detail page dengan image gallery, package includes, scope/infra add-ons terpisah, price breakdown, FAQ, dan related templates

---

## Perubahan Database

### 1. Tambah kolom di `service_templates`

| Kolom | Tipe | Default | Keterangan |
|-------|------|---------|------------|
| demo_url | text | null | Link live demo |
| revision_limit | integer | null | Batas revisi (e.g. 2) |
| gallery_images | jsonb | '[]' | Array URL gambar gallery |

### 2. Tambah kolom `category` di `template_features`

| Kolom | Tipe | Default | Keterangan |
|-------|------|---------|------------|
| category | text | 'scope' | Nilai: 'scope' (add-on biasa) atau 'infra' (domain, hosting, maintenance) |

Ini memungkinkan pemisahan visual antara **Scope Customization** (extra page, SEO, copywriting) dan **Infrastructure Add-Ons** (domain, hosting, maintenance plan) di PDP.

---

## Templates Page (PLP) - Detail Implementasi

### Layout

```text
[Top Bar: Result count + Sort dropdown (Popular/Newest/Price)]
[Left Sidebar (desktop)]     [Main Grid 2-3 kolom]
  - Price Range (slider)       - Template cards
  - Category filter             
  - Delivery Time               
  - Feature Tags                
```

- Mobile: sidebar menjadi collapsible filter drawer (tombol "Filter" di top bar)
- Desktop: sidebar fixed di kiri, grid di kanan

### Filter Sidebar

| Filter | Tipe UI | Sumber Data |
|--------|---------|-------------|
| Price Range | Dual slider / min-max input | Computed dari template data |
| Category | Checkbox list | Dari template categories |
| Delivery Time | Radio/checkbox (< 7 hari, 7-14 hari, 14-30 hari, 30+ hari) | Computed dari estimated_days |
| Feature Tags | Checkbox | Dari template_features yang is_included=true, deduplicated |

### Template Card (upgrade)

Setiap card menampilkan:
- Thumbnail image
- Template name
- Category badge
- Starting price (Rp format)
- Delivery time (X hari)
- Tombol "Quick View" (modal preview singkat) dan "View Details" (navigasi ke PDP)

### Top Bar

- Result count: "Showing X templates"
- Sort dropdown: Popular (display_order), Newest (created_at desc), Price Low-High, Price High-Low

### State Management

```text
- searchQuery (string) -- dari query params jika ada
- categoryFilter (string[]) -- multi-select
- priceRange ([min, max])
- deliveryTimeFilter (string[])
- featureTagFilter (string[])
- sortBy ('popular' | 'newest' | 'price-asc' | 'price-desc')
```

Filtering dilakukan client-side karena jumlah template biasanya tidak banyak (< 100).

---

## Template Detail Page (PDP) - Detail Implementasi

### A. Preview Section (Top)

```text
[Image Gallery (left)]           [Info Panel (right)]
  - Main image besar               - Template name
  - Thumbnail strip di bawah       - Starting price
  - Placeholder jika kosong         - Delivery time
                                    - Revision limit
  [Live Demo Link]                  - CTA: Add to Cart / Buy Now
  [Device Toggle: Desktop/Mobile]
```

- Gallery menggunakan `gallery_images` dari DB (jsonb array)
- Jika kosong, fallback ke `thumbnail_url` atau placeholder
- Live demo link dari `demo_url` (buka di tab baru)
- Device preview toggle: icon desktop/mobile, mengubah aspect ratio preview (simulasi saja, bukan iframe)

### B. Package Includes

Menampilkan semua features dengan `is_included = true` dalam format checklist yang rapi:
- Icon check hijau + nama fitur + deskripsi
- Contoh: "5 Pages", "Basic SEO", "CMS Setup", "Contact Form", "2 Revisions"

### C. Scope Customization (Add-Ons)

Features dengan `is_included = false` DAN `category = 'scope'`:
- Checkbox + nama + harga
- Contoh: "+1 Page", "Extra Revision", "Copywriting", "SEO Advanced"
- Harga update realtime di price breakdown

### D. Infrastructure Add-Ons

Features dengan `is_included = false` DAN `category = 'infra'`:
- Section terpisah secara visual (background berbeda)
- Checkbox + nama + harga
- Contoh: "Domain (.com)", "Hosting 1 Year", "Maintenance Plan"

### E. Price Breakdown (Sticky Sidebar)

```text
Order Summary
-----------------------
Template Base        Rp X
Scope Add-Ons
  - Item 1           Rp X
  - Item 2           Rp X
Infrastructure
  - Domain            Rp X
-----------------------
Total               Rp X

[Add to Cart]
[Buy Now]
```

### F. FAQ Khusus Template

- Query `store_faqs` (tabel existing) -- tampilkan 3-5 FAQ umum
- Menggunakan komponen Accordion yang sudah ada
- Section hanya tampil jika ada data FAQ

### G. Related Templates

- Query `service_templates` WHERE `category = current_template.category` AND `id != current_id`, limit 4
- Grid horizontal 4 card kecil
- Card: thumbnail, nama, harga
- Link ke PDP masing-masing

---

## File yang Diubah/Dibuat

| File | Aksi |
|------|------|
| Migration SQL | Tambah kolom demo_url, revision_limit, gallery_images di service_templates; tambah category di template_features |
| `src/pages/store/TemplatesPage.tsx` | Rewrite total: sidebar filter + grid + sorting + result count |
| `src/pages/store/TemplateDetailPage.tsx` | Rewrite total: gallery, package includes, scope/infra add-ons, price breakdown, FAQ, related |
| `src/features/storefront/types/index.ts` | Update ServiceTemplate (tambah demo_url, revision_limit, gallery_images) dan TemplateFeature (tambah category) |
| `src/features/storefront/hooks/useRelatedTemplates.ts` | Hook baru: query related templates by category |

---

## Catatan Teknis

- Semua filter di PLP dilakukan client-side (useMemo) karena volume data kecil
- Quick View di PLP menggunakan Dialog/Sheet dari Radix (sudah tersedia)
- Gallery di PDP menggunakan state `selectedImageIndex` sederhana, tidak perlu library carousel
- Device toggle di PDP hanya mengubah container width/aspect ratio sebagai simulasi visual
- Price breakdown menggunakan kalkulasi yang sudah ada (base_price + selected features), hanya dipecah per kategori
- Mobile responsive: sidebar filter menjadi Sheet/Drawer, gallery menjadi swipeable thumbnails
- URL query params digunakan di PLP untuk deep-linking filter (e.g. `/store/templates?category=Ecommerce`)

