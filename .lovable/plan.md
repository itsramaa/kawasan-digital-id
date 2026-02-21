

# Buat & Maksimalkan Contact Page (`/store/contact`)

## Ringkasan
Membuat halaman Contact baru yang dedicated di `/store/contact` -- saat ini hanya ada hash link `#contact` yang tidak mengarah ke section apapun. Halaman ini akan menjadi pusat komunikasi utama dengan calon klien, dengan desain profesional yang konsisten dengan halaman store lainnya.

---

## Struktur Halaman

### 1. Hero Section -- Gradient Banner
- Gradient background konsisten (`bg-gradient-to-br from-primary/5 via-transparent to-primary/3`)
- Badge "Contact Us"
- Heading: "Hubungi Kami"
- Subtitle deskriptif
- Trust indicators: "Respon < 2 Jam", "Konsultasi Gratis", "Tim Profesional"

### 2. Contact Info Cards (3 kolom)
- **Email**: hello@kawasandigital.com, icon Mail
- **WhatsApp**: nomor/link, icon MessageCircle
- **Jam Operasional**: Senin-Jumat 09:00-18:00, icon Clock
- Hover effect: lift + border glow
- Scroll-reveal animation

### 3. Contact Form (kolom utama)
- Layout 2 kolom pada desktop: form di kiri, info sidebar di kanan
- Form fields:
  - Nama (required)
  - Email (required, validasi format)
  - Subjek (dropdown: General, Technical Support, Custom Project, Partnership, Other)
  - Pesan (required, min 10 karakter, max 1000)
- Validasi menggunakan Zod schema
- Submit menyimpan ke tabel `contact_messages` di database
- Toast notification saat berhasil/gagal
- Success state dengan animasi

### 4. Info Sidebar (di samping form)
- Mengapa memilih kami? (3-4 value props dengan icon)
- FAQ ringkas (3 pertanyaan populer dengan link ke `/store/help`)
- Social proof: "100+ Proyek Selesai"

### 5. Map / Lokasi Section (opsional visual)
- Kartu info lokasi dengan icon MapPin
- Alamat bisnis (teks saja, tanpa embed map)

### 6. Quick Links Section
- Grid cards menuju halaman terkait (Templates, Custom Website, How It Works)
- Konsisten dengan QuickLinks di halaman Help/FAQ

---

## Perubahan Database

### Tabel Baru: `contact_messages`
```sql
CREATE TABLE public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Siapa saja bisa submit (public form)
CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Hanya authenticated internal users yang bisa membaca
CREATE POLICY "Authenticated users can read contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (true);
```

### File Baru
- `src/pages/store/ContactPage.tsx` -- halaman utama

### File yang Dimodifikasi
- `src/App.tsx` -- tambah route `/store/contact`
- `src/shared/components/layouts/StorefrontLayout.tsx` -- update nav link Contact dari `#contact` hash menjadi `/store/contact`
- `src/features/storefront/components/home/FinalCTA.tsx` -- update link CTA ke `/store/contact`
- `src/pages/store/HelpFAQPage.tsx` -- update ContactCTA link ke `/store/contact`
- `src/shared/lib/validations.ts` -- tambah `contactSchema` Zod validation

### Pendekatan
- Menggunakan `useScrollReveal` hook yang sudah ada
- Validasi form menggunakan Zod (sudah terinstall)
- Submit form langsung ke Supabase via client SDK
- Toast notifications via `sonner` (sudah terinstall)
- Semua styling menggunakan Tailwind classes
- Tidak ada dependency baru

