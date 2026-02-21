
# Perluas Section "How It Works" di Home dengan 10 Langkah

## Apa yang Berubah
Section "Cara Kerja" di homepage saat ini hanya menampilkan 5 langkah sederhana. Akan diperluas menjadi **10 langkah** yang dikelompokkan dalam **4 fase**, sesuai konten yang sebelumnya ada di halaman How It Works yang sudah dihapus.

## Struktur 10 Langkah dalam 4 Fase

| Fase | Langkah | Judul | Deskripsi |
|------|---------|-------|-----------|
| **Fase 1: Pemesanan** | 01 | Pilih Template / Custom | Temukan template yang sesuai atau request custom sesuai kebutuhan |
| | 02 | Sesuaikan Paket | Pilih fitur dan add-on yang Anda butuhkan |
| | 03 | Checkout & Pembayaran | Lakukan pembayaran dengan mudah dan aman |
| **Fase 2: Persiapan** | 04 | Input Data Proyek | Kirimkan detail kebutuhan, konten, dan aset website |
| | 05 | Sesi Diskusi | Diskusi brief dan konfirmasi scope bersama tim kami |
| **Fase 3: Pengerjaan** | 06 | Desain & Development | Tim kami mulai mengerjakan website Anda |
| | 07 | Review & Revisi | Anda review hasil, berikan feedback untuk penyempurnaan |
| | 08 | Testing & QA | Pengujian menyeluruh sebelum launch |
| **Fase 4: Launch** | 09 | Serah Terima & Launch | Website siap live dan diserahkan ke Anda |
| | 10 | Pemeliharaan & Support | Dukungan teknis dan maintenance berkelanjutan |

## Desain UI

- Header tetap: "Cara Kerja" dengan subtitle diupdate menjadi "Dari brief hingga launch dalam 10 langkah"
- Setiap fase ditampilkan sebagai grup dengan label fase (badge)
- Langkah-langkah ditampilkan dalam grid 2 kolom (desktop) dengan nomor, ikon, judul, dan deskripsi
- Connector line antar fase untuk menunjukkan alur
- Scroll reveal animation tetap dipertahankan

## Detail Teknis

### File yang Dimodifikasi

**`src/features/storefront/components/home/HowItWorks.tsx`**
- Ganti array `STEPS` (5 item) menjadi struktur `PHASES` (4 fase, 10 langkah total)
- Tambah ikon baru: `FileText`, `MessageCircle`, `Code`, `RefreshCw`, `CheckCircle`, `Wrench`
- Ubah layout dari grid 5 kolom menjadi grouped layout per fase
- Setiap fase memiliki badge label (contoh: "Fase 1: Pemesanan")
- Langkah di dalam fase ditampilkan dalam grid 2-3 kolom
- Subtitle diupdate: "Dari brief hingga launch dalam 10 langkah"
