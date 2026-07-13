import { LegalPageLayout } from '@/src/features/storefront/components/legal/LegalPageLayout';
import { LegalSection } from '@/src/features/storefront/components/legal/LegalSection';
import { Shield, Eye, Share2, Lock, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Privacy Policy — Kawasan Digital' };

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="Kebijakan privasi kami menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda."
      lastUpdated="1 Januari 2025"
      tocItems={[
        { id: 'data-collection', label: 'Data yang Dikumpulkan' },
        { id: 'data-use', label: 'Penggunaan Data' },
        { id: 'data-sharing', label: 'Berbagi Data' },
        { id: 'security', label: 'Keamanan Data' },
        { id: 'contact', label: 'Kontak' },
      ]}
      crossNavItems={[
        { to: '/terms', title: 'Terms of Service', description: 'Syarat & ketentuan layanan', icon: <Shield className="h-5 w-5" /> },
        { to: '/refund', title: 'Refund Policy', description: 'Kebijakan pengembalian dana', icon: <Shield className="h-5 w-5" /> },
      ]}
    >
      <LegalSection id="data-collection" number={1} title="Data yang Dikumpulkan" icon={<Eye className="h-5 w-5" />}>
        <p>Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, alamat email, dan nomor telepon saat Anda mendaftar atau melakukan pemesanan.</p>
      </LegalSection>
      <LegalSection id="data-use" number={2} title="Penggunaan Data" icon={<Shield className="h-5 w-5" />}>
        <p>Data Anda digunakan untuk memproses pesanan, mengirim notifikasi, dan meningkatkan layanan kami.</p>
      </LegalSection>
      <LegalSection id="data-sharing" number={3} title="Berbagi Data" icon={<Share2 className="h-5 w-5" />}>
        <p>Kami tidak menjual data pribadi Anda kepada pihak ketiga manapun.</p>
      </LegalSection>
      <LegalSection id="security" number={4} title="Keamanan Data" icon={<Lock className="h-5 w-5" />}>
        <p>Kami menggunakan enkripsi standar industri untuk melindungi data Anda.</p>
      </LegalSection>
      <LegalSection id="contact" number={5} title="Kontak" icon={<Mail className="h-5 w-5" />}>
        <p>Jika ada pertanyaan tentang kebijakan privasi, hubungi kami di hello@kawasandigital.com.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
