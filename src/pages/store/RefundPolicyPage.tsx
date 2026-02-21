import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";

export default function RefundPolicyPage() {
  return (
    <StorefrontLayout>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Refund Policy</h1>
          <p className="text-sm text-muted-foreground">Terakhir diperbarui: 1 Januari 2025</p>
        </div>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">1. Kebijakan Umum</h2>
            <p>Kawasan Digital berkomitmen untuk memberikan layanan terbaik. Kebijakan pengembalian dana ini berlaku untuk semua layanan pembuatan website yang kami tawarkan.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. Pembatalan Sebelum Pengerjaan</h2>
            <p>Jika Anda membatalkan pesanan sebelum pengerjaan dimulai (sebelum konsultasi awal), Anda berhak mendapatkan pengembalian dana penuh (100%).</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. Pembatalan Selama Pengerjaan</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-foreground font-medium">Fase desain (sebelum development):</span> Pengembalian 50% dari total pembayaran</li>
              <li><span className="text-foreground font-medium">Fase development (setelah desain disetujui):</span> Pengembalian 25% dari total pembayaran</li>
              <li><span className="text-foreground font-medium">Setelah website selesai dan di-review:</span> Tidak ada pengembalian dana</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">4. Ketidakpuasan Hasil</h2>
            <p>Jika Anda tidak puas dengan hasil akhir, kami akan melakukan revisi sesuai kuota yang termasuk dalam paket Anda. Jika setelah revisi maksimal Anda masih tidak puas, kami akan mengevaluasi kasus per kasus untuk solusi terbaik.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">5. Layanan Domain & Hosting</h2>
            <p>Biaya domain dan hosting yang sudah diproses tidak dapat dikembalikan karena merupakan layanan pihak ketiga yang langsung aktif setelah pembelian.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">6. Proses Pengembalian Dana</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ajukan permintaan refund melalui email ke <span className="text-foreground font-medium">hello@kawasandigital.com</span></li>
              <li>Sertakan nomor pesanan dan alasan pembatalan</li>
              <li>Tim kami akan memproses permintaan dalam 3-5 hari kerja</li>
              <li>Pengembalian dana akan dilakukan melalui metode pembayaran yang sama</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">7. Pengecualian</h2>
            <p>Pengembalian dana tidak berlaku jika klien melanggar syarat dan ketentuan layanan, atau jika keterlambatan proyek disebabkan oleh klien yang tidak menyediakan materi/feedback tepat waktu.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">8. Hubungi Kami</h2>
            <p>Untuk pertanyaan mengenai kebijakan refund, hubungi kami di <span className="text-foreground font-medium">hello@kawasandigital.com</span>.</p>
          </section>
        </div>
      </div>
    </StorefrontLayout>
  );
}
