import { LegalPageLayout } from '@/src/features/storefront/components/legal/LegalPageLayout';
import { LegalSection } from '@/src/features/storefront/components/legal/LegalSection';
import { RotateCcw, CheckCircle, Clock, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Refund Policy — Kawasan Digital' };

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      description="Kebijakan pengembalian dana kami menjelaskan kondisi dan prosedur refund untuk semua layanan."
      lastUpdated="1 Januari 2025"
      tocItems={[
        { id: 'eligibility', label: 'Kelayakan Refund' },
        { id: 'process', label: 'Proses Refund' },
        { id: 'timeline', label: 'Waktu Proses' },
        { id: 'exceptions', label: 'Pengecualian' },
      ]}
      crossNavItems={[
        { to: '/privacy', title: 'Privacy Policy', description: 'Kebijakan privasi kami', icon: <RotateCcw className="h-5 w-5" /> },
        { to: '/terms', title: 'Terms of Service', description: 'Syarat & ketentuan layanan', icon: <RotateCcw className="h-5 w-5" /> },
      ]}
    >
      <LegalSection id="eligibility" number={1} title="Kelayakan Refund" icon={<CheckCircle className="h-5 w-5" />}>
        <p>Refund dapat diajukan dalam 7 hari setelah pembayaran jika pengerjaan belum dimulai.</p>
      </LegalSection>
      <LegalSection id="process" number={2} title="Proses Refund" icon={<RotateCcw className="h-5 w-5" />}>
        <p>Hubungi tim kami di hello@kawasandigital.com dengan menyertakan nomor order Anda.</p>
      </LegalSection>
      <LegalSection id="timeline" number={3} title="Waktu Proses" icon={<Clock className="h-5 w-5" />}>
        <p>Refund diproses dalam 5–7 hari kerja setelah permohonan disetujui.</p>
      </LegalSection>
      <LegalSection id="exceptions" number={4} title="Pengecualian" icon={<XCircle className="h-5 w-5" />}>
        <p>Refund tidak berlaku jika pekerjaan sudah lebih dari 50% selesai atau klien telah menyetujui desain akhir.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
