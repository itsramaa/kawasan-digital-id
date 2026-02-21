
# Maksimalkan Halaman Profile

## Ringkasan
Upgrade halaman Profile (`/dashboard/account`) dari layout sederhana menjadi halaman profil yang profesional dan polished -- dengan hero/banner section, avatar lebih besar, layout 2 kolom, section terpisah untuk info perusahaan dan personal, serta animasi scroll-reveal.

---

## Perubahan yang Akan Dilakukan

### 1. Hero Banner Section
- Gradient background banner di bagian atas (konsisten dengan halaman lain: `bg-gradient-to-br from-primary/5 via-transparent to-primary/3`)
- Avatar besar (80px) dengan inisial yang overlap di atas banner
- Nama lengkap, email, dan badge role ditampilkan di samping avatar
- Breadcrumb: Dashboard > Profile

### 2. Layout 2 Kolom (Desktop)
- **Kolom Kiri (sidebar)**: Kartu profil ringkas -- avatar, nama, email, role, tanggal bergabung (`created_at`), status akun (active/inactive)
- **Kolom Kanan (main)**: Form edit profil dan info perusahaan

### 3. Info Perusahaan -- Desain Lebih Polished
- Card terpisah dengan icon-icon yang lebih jelas
- Grid 2 kolom untuk company name, industry, email, phone
- Badge "Read Only" untuk menandakan ini tidak bisa diedit
- Styling lebih konsisten dengan card lainnya

### 4. Form Edit Profil -- Upgrade Visual
- Card terpisah dengan heading "Informasi Personal"
- Field Full Name, Email (disabled dengan penjelasan), Phone
- Tombol Save dengan loading state yang lebih prominent
- Success feedback yang lebih jelas

### 5. Section Keamanan Akun
- Card baru di bawah form profil
- Info: "Email terverifikasi" dengan icon check hijau
- Info: tanggal terakhir login (dari `user.last_sign_in_at`)
- Tombol "Ubah Password" (navigasi atau placeholder untuk fitur mendatang)

### 6. Animasi
- `useScrollReveal` pada setiap card/section
- Fade-in staggered untuk tampilan yang lebih hidup

---

## Detail Teknis

### File yang Dimodifikasi
- `src/pages/client/ClientAccount.tsx` -- refactor komprehensif

### Data yang Digunakan
- `profile` dari `useAuth()`: full_name, email, avatar_url, phone, is_active, created_at
- `user` dari `useAuth()`: email, last_sign_in_at
- `roles` dari `useAuth()`: role badges
- `clientInfo` dari query `clients` table: company_name, industry, email, phone

### Pendekatan
- Tidak ada perubahan database
- Tidak ada dependency baru
- Menggunakan `useScrollReveal` hook yang sudah ada
- Semua data sudah tersedia dari AuthContext dan existing query
- Teks UI dalam Bahasa Indonesia
- Responsive: 2 kolom di desktop, 1 kolom di mobile
- Icon dari lucide-react: Calendar, CheckCircle, Lock, dll
