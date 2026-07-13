import { LegalPageLayout } from '@/src/features/storefront/components/legal/LegalPageLayout';
import { LegalSection } from '@/src/features/storefront/components/legal/LegalSection';
import { FileText, Globe, CreditCard, Sparkles, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Terms of Service — Kawasan Digital' };

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      description="Syarat dan ketentuan layanan Kawasan Digital yang mengatur penggunaan platform dan layanan kami."
      lastUpdated="1 Januari 2025"
      tocItems={[
        { id: 'acceptance', label: 'Penerimaan Syarat' },
        { id: 'services', label: 'Layanan' },
        { id: 'payment', label: 'Pembayaran' },
        { id: 'ip', label: 'Hak Kekayaan Intelektual' },
        { id: 'liability', label: 'Batasan Tanggung Jawab' },
      ]}
      crossNavItems={[
        { to: '/privacy', title: 'Privacy Policy', description: 'Kebijakan privasi kami', icon: <FileText className="h-5 w-5" /> },
        { to: '/refund', title: 'Refund Policy', description: 'Kebijakan pengembalian dana', icon: <FileText className="h-5 w-5" /> },
      ]}
    >
      <LegalSection id="acceptance" number={1} title="Penerimaan Syarat" icon={<FileText className="h-5 w-5" />}>
        <p>Dengan menggunakan layanan kami, Anda setuju untuk terikat oleh syarat dan ketentuan ini.</p>
      </LegalSection>
      <LegalSection id="services" number={2} title="Layanan" icon={<Globe className="h-5 w-5" />}>
        <p>Kawasan Digital menyediakan layanan pembuatan website, baik berupa template maupun custom development.</p>
      </LegalSection>
      <LegalSection id="payment" number={3} title="Pembayaran" icon={<CreditCard className="h-5 w-5" />}>
        <p>Pembayaran dilakukan di muka sebelum pengerjaan dimulai. Kami menerima transfer bank dan pembayaran digital.</p>
      </LegalSection>
      <LegalSection id="ip" number={4} title="Hak Kekayaan Intelektual" icon={<Sparkles className="h-5 w-5" />}>
        <p>Setelah pembayaran lunas, hak kepemilikan website sepenuhnya berpindah ke klien.</p>
      </LegalSection>
      <LegalSection id="liability" number={5} title="Batasan Tanggung Jawab" icon={<AlertTriangle className="h-5 w-5" />}>
        <p>Kawasan Digital tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan layanan kami.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
