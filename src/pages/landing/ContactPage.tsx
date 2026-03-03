import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast({ title: "Lengkapi semua field", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Gagal mengirim pesan", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "info@kawasandigital.com" },
    { icon: Phone, label: "Telepon", value: "+62 812 3456 7890" },
    { icon: MapPin, label: "Alamat", value: "Jakarta, Indonesia" },
  ];

  return (
    <LandingLayout>
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">Hubungi Kami</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Punya pertanyaan atau ingin memulai proyek? Kami siap membantu Anda.
            </p>
          </RevealCard>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <RevealCard className="lg:col-span-3">
              {sent ? (
                <div className="text-center py-16 rounded-xl border border-border bg-card">
                  <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Pesan Terkirim!</h3>
                  <p className="text-muted-foreground mb-6">Terima kasih, tim kami akan segera menghubungi Anda.</p>
                  <Button onClick={() => setSent(false)} variant="outline">Kirim Pesan Lain</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-xl border border-border bg-card">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama</Label>
                      <Input id="name" placeholder="Nama lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@contoh.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek</Label>
                    <Input id="subject" placeholder="Subjek pesan" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea id="message" placeholder="Tulis pesan Anda..." rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <Button type="submit" disabled={loading} className="gap-2">
                    <Send className="h-4 w-4" /> {loading ? "Mengirim..." : "Kirim Pesan"}
                  </Button>
                </form>
              )}
            </RevealCard>

            {/* Sidebar Info */}
            <RevealCard delay={200} className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                {contactInfo.map((c, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <c.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{c.label}</div>
                      <div className="text-sm text-muted-foreground">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map embed */}
              <div className="rounded-xl overflow-hidden border border-border aspect-[4/3]">
                <iframe
                  title="Lokasi Kawasan Digital"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.65295954!2d106.68943075!3d-6.229728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sid!2sid!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </RevealCard>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
