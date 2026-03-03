

## Plan: Landing Page / Company Profile untuk Kawasan Digital

### Halaman yang akan dibuat

Semua di bawah prefix `/landing`:

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/landing` | Home | Hero, highlights, stats, CTA |
| `/landing/about` | About Us | Visi misi, tim, sejarah perusahaan |
| `/landing/services` | Services | Layanan yang ditawarkan (template, custom, maintenance) |
| `/landing/portfolio` | Portfolio | Showcase proyek-proyek yang sudah dikerjakan |
| `/landing/contact` | Contact | Form kontak, alamat, peta, sosial media |

### Implementasi

1. **Layout baru** - `LandingLayout.tsx` dengan navbar dan footer khusus company profile (beda dari StorefrontLayout yang fokus e-commerce). Navbar: Logo, Home, About, Services, Portfolio, Contact. Footer: info perusahaan, sosial media, copyright.

2. **5 halaman baru** di `src/pages/landing/`:
   - `LandingHome.tsx` - Hero besar dengan tagline company, statistik (50+ klien, 100+ website), partner logos, highlight layanan, testimonial ringkas, CTA
   - `AboutPage.tsx` - Visi & Misi, cerita perusahaan, nilai-nilai, tim/founder section
   - `ServicesPage.tsx` - Grid layanan (Template Website, Custom Development, Maintenance & Support, SEO & Marketing), detail tiap layanan dengan icon dan deskripsi
   - `PortfolioPage.tsx` - Grid/gallery proyek dengan kategori filter, screenshot dan deskripsi singkat
   - `ContactPage.tsx` - Form kontak (nama, email, subjek, pesan), info kontak (email, telepon, alamat), embed peta lokasi

3. **Routing** - Tambah 5 route baru di `App.tsx` sebagai public routes

4. **Reuse** komponen yang sudah ada: `useScrollReveal`, `Button`, `Badge`, `Card`, dll. Data testimonial bisa reuse dari hook `useTestimonials`.

### Struktur File Baru

```
src/pages/landing/
  LandingHome.tsx
  AboutPage.tsx
  ServicesPage.tsx
  PortfolioPage.tsx
  ContactPage.tsx

src/shared/components/layouts/
  LandingLayout.tsx
```

