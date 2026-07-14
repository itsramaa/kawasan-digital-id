import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '@/components/contact-form';

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Kontak — Kawasan Digital' };

const contacts = [
  { icon: Mail,  label: 'Email',     value: 'info@kawasandigital.com', href: 'mailto:info@kawasandigital.com' },
  { icon: Phone, label: 'WhatsApp',  value: '+62 812 3456 7890',        href: 'https://wa.me/6281234567890' },
  { icon: MapPin,label: 'Lokasi',    value: 'Jakarta, Indonesia',        href: null },
];

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Hubungi Kami</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Ceritakan kebutuhan digital Anda dan dapatkan konsultasi gratis dari tim kami.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Informasi Kontak</h2>
          <div className="space-y-4">
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium hover:text-primary transition-colors">{value}</a>
                  ) : (
                    <p className="text-sm font-medium">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
