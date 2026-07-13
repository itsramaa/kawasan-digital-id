// TODO: fetch FAQs from Prisma
import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Help & FAQ — Kawasan Digital' };

const staticFaqs = [
  { id: '1', q: 'Berapa lama proses pengerjaan website?', a: 'Tergantung jenis layanan. Template standar 3–7 hari, custom website 2–8 minggu tergantung kompleksitas.' },
  { id: '2', q: 'Apakah saya bisa minta revisi?', a: 'Ya, setiap paket memiliki jumlah revisi yang ditentukan. Revisi tambahan dapat dikenakan biaya.' },
  { id: '3', q: 'Metode pembayaran apa yang diterima?', a: 'Kami menerima transfer bank (BCA, BNI, BRI, Mandiri), GoPay, OVO, dan QRIS.' },
  { id: '4', q: 'Apakah website yang saya pesan bisa diubah sendiri?', a: 'Ya, semua website kami dilengkapi dengan CMS yang mudah digunakan.' },
  { id: '5', q: 'Apakah ada garansi setelah website selesai?', a: 'Ya, kami memberikan garansi bug-free selama 30 hari setelah launch.' },
];

export default function HelpFAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-3">
        <HelpCircle className="w-12 h-12 mx-auto text-primary" />
        <h1 className="text-3xl font-bold">Help & FAQ</h1>
        <p className="text-muted-foreground">Jawaban atas pertanyaan yang paling sering ditanyakan.</p>
      </div>
      <Accordion type="single" collapsible className="space-y-2">
        {staticFaqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-xl px-4">
            <AccordionTrigger className="text-sm font-medium text-left">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="text-center text-sm text-muted-foreground">
        Tidak menemukan jawaban?{' '}
        <a href="mailto:hello@kawasandigital.com" className="text-primary hover:underline">Hubungi kami</a>
      </div>
    </div>
  );
}
