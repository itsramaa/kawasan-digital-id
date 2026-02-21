import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { LegalPageLayout } from "@/features/storefront/components/legal/LegalPageLayout";
import { LegalSection } from "@/features/storefront/components/legal/LegalSection";
import { ClipboardList, Target, ShieldCheck, Share2, Globe, UserCheck, RefreshCw, Mail, FileText, RotateCcw } from "lucide-react";

const tocItems = [
  { id: "informasi", label: "Informasi yang Dikumpulkan" },
  { id: "penggunaan", label: "Penggunaan Informasi" },
  { id: "perlindungan", label: "Perlindungan Data" },
  { id: "berbagi", label: "Berbagi Informasi" },
  { id: "cookie", label: "Cookie & Pelacakan" },
  { id: "hak", label: "Hak Anda" },
  { id: "perubahan", label: "Perubahan Kebijakan" },
  { id: "hubungi", label: "Hubungi Kami" },
];

const crossNavItems = [
  { to: "/terms", title: "Terms of Service", description: "Syarat & ketentuan penggunaan layanan kami", icon: <FileText className="h-5 w-5" /> },
  { to: "/refund", title: "Refund Policy", description: "Kebijakan pengembalian dana", icon: <RotateCcw className="h-5 w-5" /> },
];

export default function PrivacyPolicyPage() {
  return (
    <StorefrontLayout>
      <LegalPageLayout
        title="Privacy Policy"
        description="Kami menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda."
        lastUpdated="1 Januari 2025"
        tocItems={tocItems}
        crossNavItems={crossNavItems}
      >
        <LegalSection id="informasi" number={1} title="Informasi yang Kami Kumpulkan" icon={<ClipboardList className="h-5 w-5" />}>
          <p>Kawasan Digital mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Nama lengkap dan informasi kontak (email, nomor telepon)</li>
            <li>Informasi perusahaan atau bisnis</li>
            <li>Data yang diperlukan untuk pembuatan website (konten, gambar, preferensi desain)</li>
            <li>Informasi pembayaran dan transaksi</li>
            <li>Komunikasi yang Anda kirimkan kepada kami</li>
          </ul>
        </LegalSection>

        <LegalSection id="penggunaan" number={2} title="Penggunaan Informasi" icon={<Target className="h-5 w-5" />}>
          <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Menyediakan, memelihara, dan meningkatkan layanan kami</li>
            <li>Memproses transaksi dan mengirimkan informasi terkait</li>
            <li>Mengirimkan update proyek dan komunikasi teknis</li>
            <li>Menanggapi permintaan, pertanyaan, dan umpan balik Anda</li>
            <li>Memantau dan menganalisis tren penggunaan layanan</li>
          </ul>
        </LegalSection>

        <LegalSection id="perlindungan" number={3} title="Perlindungan Data" icon={<ShieldCheck className="h-5 w-5" />}>
          <p>Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi informasi pribadi Anda dari akses tidak sah, perubahan, pengungkapan, atau penghancuran.</p>
        </LegalSection>

        <LegalSection id="berbagi" number={4} title="Berbagi Informasi" icon={<Share2 className="h-5 w-5" />}>
          <p>Kami tidak menjual informasi pribadi Anda. Kami hanya membagikan informasi dalam situasi berikut:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Dengan penyedia layanan pihak ketiga yang membantu operasional kami (hosting, domain, payment gateway)</li>
            <li>Jika diwajibkan oleh hukum atau proses hukum yang berlaku</li>
            <li>Dengan persetujuan eksplisit dari Anda</li>
          </ul>
        </LegalSection>

        <LegalSection id="cookie" number={5} title="Cookie & Teknologi Pelacakan" icon={<Globe className="h-5 w-5" />}>
          <p>Website kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman pengguna, menganalisis lalu lintas, dan memahami bagaimana layanan kami digunakan.</p>
        </LegalSection>

        <LegalSection id="hak" number={6} title="Hak Anda" icon={<UserCheck className="h-5 w-5" />}>
          <p>Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda. Hubungi kami di <span className="text-foreground font-medium">hello@kawasandigital.com</span> untuk permintaan terkait data pribadi Anda.</p>
        </LegalSection>

        <LegalSection id="perubahan" number={7} title="Perubahan Kebijakan" icon={<RefreshCw className="h-5 w-5" />}>
          <p>Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan dipublikasikan di halaman ini dengan tanggal pembaruan yang diperbarui.</p>
        </LegalSection>

        <LegalSection id="hubungi" number={8} title="Hubungi Kami" icon={<Mail className="h-5 w-5" />}>
          <p>Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di <span className="text-foreground font-medium">hello@kawasandigital.com</span>.</p>
        </LegalSection>
      </LegalPageLayout>
    </StorefrontLayout>
  );
}
