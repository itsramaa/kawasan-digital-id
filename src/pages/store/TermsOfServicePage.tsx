import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { LegalPageLayout } from "@/features/storefront/components/legal/LegalPageLayout";
import { LegalSection } from "@/features/storefront/components/legal/LegalSection";
import { BookOpen, ShoppingCart, CreditCard, Pencil, Scale, Users, AlertTriangle, Mail, Shield, RotateCcw } from "lucide-react";

const tocItems = [
  { id: "ketentuan", label: "Ketentuan Umum" },
  { id: "layanan", label: "Layanan" },
  { id: "pemesanan", label: "Proses Pemesanan" },
  { id: "pembayaran", label: "Pembayaran" },
  { id: "revisi", label: "Revisi & Perubahan" },
  { id: "hki", label: "Hak Kekayaan Intelektual" },
  { id: "tanggung-jawab", label: "Tanggung Jawab Klien" },
  { id: "batasan", label: "Batasan Tanggung Jawab" },
  { id: "hubungi", label: "Hubungi Kami" },
];

const crossNavItems = [
  { to: "/privacy", title: "Privacy Policy", description: "Kebijakan privasi dan perlindungan data", icon: <Shield className="h-5 w-5" /> },
  { to: "/refund", title: "Refund Policy", description: "Kebijakan pengembalian dana", icon: <RotateCcw className="h-5 w-5" /> },
];

export default function TermsOfServicePage() {
  return (
    <StorefrontLayout>
      <LegalPageLayout
        title="Terms of Service"
        description="Syarat dan ketentuan yang mengatur penggunaan layanan pembuatan website oleh Kawasan Digital."
        lastUpdated="1 Januari 2025"
        tocItems={tocItems}
        crossNavItems={crossNavItems}
      >
        <LegalSection id="ketentuan" number={1} title="Ketentuan Umum" icon={<BookOpen className="h-5 w-5" />}>
          <p>Dengan menggunakan layanan Kawasan Digital, Anda menyetujui syarat dan ketentuan yang tercantum di bawah ini. Layanan kami mencakup pembuatan website menggunakan template maupun custom development.</p>
        </LegalSection>

        <LegalSection id="layanan" number={2} title="Layanan yang Disediakan" icon={<ShoppingCart className="h-5 w-5" />}>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pembuatan website berbasis template dengan kustomisasi konten</li>
            <li>Pengembangan website custom sesuai kebutuhan klien</li>
            <li>Registrasi dan manajemen domain</li>
            <li>Layanan hosting dan pemeliharaan website</li>
            <li>Dukungan teknis pasca-peluncuran</li>
          </ul>
        </LegalSection>

        <LegalSection id="pemesanan" number={3} title="Proses Pemesanan" icon={<ShoppingCart className="h-5 w-5" />}>
          <p>Setelah melakukan pemesanan, Anda akan menerima konfirmasi dan tim kami akan menghubungi Anda untuk konsultasi awal. Pengerjaan dimulai setelah pembayaran diterima dan brief disetujui kedua belah pihak.</p>
        </LegalSection>

        <LegalSection id="pembayaran" number={4} title="Pembayaran" icon={<CreditCard className="h-5 w-5" />}>
          <ul className="list-disc pl-5 space-y-1">
            <li>Harga yang tertera sudah termasuk pajak yang berlaku</li>
            <li>Pembayaran dapat dilakukan melalui transfer bank atau metode pembayaran yang tersedia</li>
            <li>Untuk proyek custom, pembayaran dilakukan secara bertahap sesuai milestone yang disepakati</li>
          </ul>
        </LegalSection>

        <LegalSection id="revisi" number={5} title="Revisi & Perubahan" icon={<Pencil className="h-5 w-5" />}>
          <p>Setiap paket template menyertakan jumlah revisi yang tercantum pada deskripsi produk. Revisi tambahan di luar kuota akan dikenakan biaya tambahan yang akan dikomunikasikan sebelumnya.</p>
        </LegalSection>

        <LegalSection id="hki" number={6} title="Hak Kekayaan Intelektual" icon={<Scale className="h-5 w-5" />}>
          <p>Setelah pembayaran penuh diterima, hak atas website yang dibuat akan dialihkan kepada klien. Kawasan Digital berhak menampilkan hasil kerja di portfolio kecuali diminta sebaliknya secara tertulis.</p>
        </LegalSection>

        <LegalSection id="tanggung-jawab" number={7} title="Tanggung Jawab Klien" icon={<Users className="h-5 w-5" />}>
          <ul className="list-disc pl-5 space-y-1">
            <li>Menyediakan konten (teks, gambar, logo) yang diperlukan tepat waktu</li>
            <li>Memberikan feedback dan persetujuan sesuai timeline yang disepakati</li>
            <li>Memastikan konten yang diberikan tidak melanggar hak cipta pihak ketiga</li>
          </ul>
        </LegalSection>

        <LegalSection id="batasan" number={8} title="Batasan Tanggung Jawab" icon={<AlertTriangle className="h-5 w-5" />}>
          <p>Kawasan Digital tidak bertanggung jawab atas kerugian yang timbul dari penggunaan layanan pihak ketiga (hosting, domain registrar), force majeure, atau kelalaian klien dalam menyediakan informasi yang diperlukan.</p>
        </LegalSection>

        <LegalSection id="hubungi" number={9} title="Hubungi Kami" icon={<Mail className="h-5 w-5" />}>
          <p>Untuk pertanyaan mengenai syarat dan ketentuan ini, hubungi kami di <span className="text-foreground font-medium">hello@kawasandigital.com</span>.</p>
        </LegalSection>
      </LegalPageLayout>
    </StorefrontLayout>
  );
}
