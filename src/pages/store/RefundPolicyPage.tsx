import { StorefrontLayout } from "@/shared/components/layouts/StorefrontLayout";
import { LegalPageLayout } from "@/features/storefront/components/legal/LegalPageLayout";
import { LegalSection } from "@/features/storefront/components/legal/LegalSection";
import { Info, XCircle, Scissors, Frown, Server, Clock, AlertOctagon, Mail, Shield, FileText } from "lucide-react";

const tocItems = [
  { id: "umum", label: "Kebijakan Umum" },
  { id: "sebelum", label: "Sebelum Pengerjaan" },
  { id: "selama", label: "Selama Pengerjaan" },
  { id: "ketidakpuasan", label: "Ketidakpuasan Hasil" },
  { id: "domain-hosting", label: "Domain & Hosting" },
  { id: "proses", label: "Proses Pengembalian" },
  { id: "pengecualian", label: "Pengecualian" },
  { id: "hubungi", label: "Hubungi Kami" },
];

const crossNavItems = [
  { to: "/privacy", title: "Privacy Policy", description: "Kebijakan privasi dan perlindungan data", icon: <Shield className="h-5 w-5" /> },
  { to: "/terms", title: "Terms of Service", description: "Syarat & ketentuan penggunaan layanan", icon: <FileText className="h-5 w-5" /> },
];

export default function RefundPolicyPage() {
  return (
    <StorefrontLayout>
      <LegalPageLayout
        title="Refund Policy"
        description="Kebijakan pengembalian dana yang berlaku untuk semua layanan pembuatan website oleh Kawasan Digital."
        lastUpdated="1 Januari 2025"
        tocItems={tocItems}
        crossNavItems={crossNavItems}
      >
        <LegalSection id="umum" number={1} title="Kebijakan Umum" icon={<Info className="h-5 w-5" />}>
          <p>Kawasan Digital berkomitmen untuk memberikan layanan terbaik. Kebijakan pengembalian dana ini berlaku untuk semua layanan pembuatan website yang kami tawarkan.</p>
        </LegalSection>

        <LegalSection id="sebelum" number={2} title="Pembatalan Sebelum Pengerjaan" icon={<XCircle className="h-5 w-5" />}>
          <p>Jika Anda membatalkan pesanan sebelum pengerjaan dimulai (sebelum konsultasi awal), Anda berhak mendapatkan pengembalian dana penuh (100%).</p>
        </LegalSection>

        <LegalSection id="selama" number={3} title="Pembatalan Selama Pengerjaan" icon={<Scissors className="h-5 w-5" />}>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-foreground font-medium">Fase desain (sebelum development):</span> Pengembalian 50% dari total pembayaran</li>
            <li><span className="text-foreground font-medium">Fase development (setelah desain disetujui):</span> Pengembalian 25% dari total pembayaran</li>
            <li><span className="text-foreground font-medium">Setelah website selesai dan di-review:</span> Tidak ada pengembalian dana</li>
          </ul>
        </LegalSection>

        <LegalSection id="ketidakpuasan" number={4} title="Ketidakpuasan Hasil" icon={<Frown className="h-5 w-5" />}>
          <p>Jika Anda tidak puas dengan hasil akhir, kami akan melakukan revisi sesuai kuota yang termasuk dalam paket Anda. Jika setelah revisi maksimal Anda masih tidak puas, kami akan mengevaluasi kasus per kasus untuk solusi terbaik.</p>
        </LegalSection>

        <LegalSection id="domain-hosting" number={5} title="Layanan Domain & Hosting" icon={<Server className="h-5 w-5" />}>
          <p>Biaya domain dan hosting yang sudah diproses tidak dapat dikembalikan karena merupakan layanan pihak ketiga yang langsung aktif setelah pembelian.</p>
        </LegalSection>

        <LegalSection id="proses" number={6} title="Proses Pengembalian Dana" icon={<Clock className="h-5 w-5" />}>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ajukan permintaan refund melalui email ke <span className="text-foreground font-medium">hello@kawasandigital.com</span></li>
            <li>Sertakan nomor pesanan dan alasan pembatalan</li>
            <li>Tim kami akan memproses permintaan dalam 3-5 hari kerja</li>
            <li>Pengembalian dana akan dilakukan melalui metode pembayaran yang sama</li>
          </ul>
        </LegalSection>

        <LegalSection id="pengecualian" number={7} title="Pengecualian" icon={<AlertOctagon className="h-5 w-5" />}>
          <p>Pengembalian dana tidak berlaku jika klien melanggar syarat dan ketentuan layanan, atau jika keterlambatan proyek disebabkan oleh klien yang tidak menyediakan materi/feedback tepat waktu.</p>
        </LegalSection>

        <LegalSection id="hubungi" number={8} title="Hubungi Kami" icon={<Mail className="h-5 w-5" />}>
          <p>Untuk pertanyaan mengenai kebijakan refund, hubungi kami di <span className="text-foreground font-medium">hello@kawasandigital.com</span>.</p>
        </LegalSection>
      </LegalPageLayout>
    </StorefrontLayout>
  );
}
