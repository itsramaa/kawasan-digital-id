import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";

export default function TermsOfServicePage() {
  return (
    <StorefrontLayout>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Terakhir diperbarui: 1 Januari 2025</p>
        </div>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">1. Ketentuan Umum</h2>
            <p>Dengan menggunakan layanan Kawasan Digital, Anda menyetujui syarat dan ketentuan yang tercantum di bawah ini. Layanan kami mencakup pembuatan website menggunakan template maupun custom development.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. Layanan yang Disediakan</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pembuatan website berbasis template dengan kustomisasi konten</li>
              <li>Pengembangan website custom sesuai kebutuhan klien</li>
              <li>Registrasi dan manajemen domain</li>
              <li>Layanan hosting dan pemeliharaan website</li>
              <li>Dukungan teknis pasca-peluncuran</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. Proses Pemesanan</h2>
            <p>Setelah melakukan pemesanan, Anda akan menerima konfirmasi dan tim kami akan menghubungi Anda untuk konsultasi awal. Pengerjaan dimulai setelah pembayaran diterima dan brief disetujui kedua belah pihak.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">4. Pembayaran</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Harga yang tertera sudah termasuk pajak yang berlaku</li>
              <li>Pembayaran dapat dilakukan melalui transfer bank atau metode pembayaran yang tersedia</li>
              <li>Untuk proyek custom, pembayaran dilakukan secara bertahap sesuai milestone yang disepakati</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">5. Revisi & Perubahan</h2>
            <p>Setiap paket template menyertakan jumlah revisi yang tercantum pada deskripsi produk. Revisi tambahan di luar kuota akan dikenakan biaya tambahan yang akan dikomunikasikan sebelumnya.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">6. Hak Kekayaan Intelektual</h2>
            <p>Setelah pembayaran penuh diterima, hak atas website yang dibuat akan dialihkan kepada klien. Kawasan Digital berhak menampilkan hasil kerja di portfolio kecuali diminta sebaliknya secara tertulis.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">7. Tanggung Jawab Klien</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Menyediakan konten (teks, gambar, logo) yang diperlukan tepat waktu</li>
              <li>Memberikan feedback dan persetujuan sesuai timeline yang disepakati</li>
              <li>Memastikan konten yang diberikan tidak melanggar hak cipta pihak ketiga</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">8. Batasan Tanggung Jawab</h2>
            <p>Kawasan Digital tidak bertanggung jawab atas kerugian yang timbul dari penggunaan layanan pihak ketiga (hosting, domain registrar), force majeure, atau kelalaian klien dalam menyediakan informasi yang diperlukan.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">9. Hubungi Kami</h2>
            <p>Untuk pertanyaan mengenai syarat dan ketentuan ini, hubungi kami di <span className="text-foreground font-medium">hello@kawasandigital.com</span>.</p>
          </section>
        </div>
      </div>
    </StorefrontLayout>
  );
}
