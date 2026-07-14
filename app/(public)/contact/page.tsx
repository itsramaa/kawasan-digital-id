import ContactForm from '@/components/contact-form'
import { Mail, Phone, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Hubungi Kami</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Ada pertanyaan atau ingin berdiskusi tentang proyek Anda? Kami siap membantu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Email</p>
              <p className="text-sm text-muted-foreground">hello@kawasandigital.id</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">WhatsApp</p>
              <p className="text-sm text-muted-foreground">+62 812 3456 7890</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Lokasi</p>
              <p className="text-sm text-muted-foreground">Indonesia</p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
