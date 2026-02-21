import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";

export default function PrivacyPolicyPage() {
  return (
    <StorefrontLayout>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Terakhir diperbarui: 1 Januari 2025</p>
        </div>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">1. Informasi yang Kami Kumpulkan</h2>
            <p>Kawasan Digital mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nama lengkap dan informasi kontak (email, nomor telepon)</li>
              <li>Informasi perusahaan atau bisnis</li>
              <li>Data yang diperlukan untuk pembuatan website (konten, gambar, preferensi desain)</li>
              <li>Informasi pembayaran dan transaksi</li>
              <li>Komunikasi yang Anda kirimkan kepada kami</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. Penggunaan Informasi</h2>
            <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Menyediakan, memelihara, dan meningkatkan layanan kami</li>
              <li>Memproses transaksi dan mengirimkan informasi terkait</li>
              <li>Mengirimkan update proyek dan komunikasi teknis</li>
              <li>Menanggapi permintaan, pertanyaan, dan umpan balik Anda</li>
              <li>Memantau dan menganalisis tren penggunaan layanan</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. Perlindungan Data</h2>
            <p>Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi informasi pribadi Anda dari akses tidak sah, perubahan, pengungkapan, atau penghancuran.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">4. Berbagi Informasi</h2>
            <p>Kami tidak menjual informasi pribadi Anda. Kami hanya membagikan informasi dalam situasi berikut:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dengan penyedia layanan pihak ketiga yang membantu operasional kami (hosting, domain, payment gateway)</li>
              <li>Jika diwajibkan oleh hukum atau proses hukum yang berlaku</li>
              <li>Dengan persetujuan eksplisit dari Anda</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">5. Cookie & Teknologi Pelacakan</h2>
            <p>Website kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman pengguna, menganalisis lalu lintas, dan memahami bagaimana layanan kami digunakan.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">6. Hak Anda</h2>
            <p>Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda. Hubungi kami di <span className="text-foreground font-medium">hello@kawasandigital.com</span> untuk permintaan terkait data pribadi Anda.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">7. Perubahan Kebijakan</h2>
            <p>Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan dipublikasikan di halaman ini dengan tanggal pembaruan yang diperbarui.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">8. Hubungi Kami</h2>
            <p>Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di <span className="text-foreground font-medium">hello@kawasandigital.com</span>.</p>
          </section>
        </div>
      </div>
    </StorefrontLayout>
  );
}
