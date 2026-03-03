import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
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
    { icon: Mail, label: "Email", value: "info@kawasandigital.com", color: "from-primary to-primary/60" },
    { icon: Phone, label: "Telepon", value: "+62 812 3456 7890", color: "from-secondary to-secondary/60" },
    { icon: MapPin, label: "Alamat", value: "Jakarta, Indonesia", color: "from-accent to-accent/60" },
  ];

  return (
    <LandingLayout>
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
          <div className="absolute bottom-10 left-1/4 w-60 h-60 bg-secondary/8 rounded-full blur-3xl" style={{ animation: "float-medium 6s ease-in-out infinite 1s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              <span className="gradient-text">Hubungi</span> Kami
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Punya pertanyaan atau ingin memulai proyek? Kami siap membantu Anda.
            </p>
          </RevealCard>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <RevealCard className="lg:col-span-3">
              {sent ? (
                <div className="text-center py-16 rounded-xl glass-card">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-5 shadow-lg colored-shadow-primary">
                    <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Pesan Terkirim!</h3>
                  <p className="text-muted-foreground mb-6">Terima kasih, tim kami akan segera menghubungi Anda.</p>
                  <Button onClick={() => setSent(false)} variant="outline" className="hover:bg-primary/5">
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-xl glass-card">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Kirim Pesan</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama</Label>
                      <Input
                        id="name"
                        placeholder="Nama lengkap"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@contoh.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek</Label>
                    <Input
                      id="subject"
                      placeholder="Subjek pesan"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea
                      id="message"
                      placeholder="Tulis pesan Anda..."
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity border-0 shadow-lg colored-shadow-primary"
                  >
                    <Send className="h-4 w-4" /> {loading ? "Mengirim..." : "Kirim Pesan"}
                  </Button>
                </form>
              )}
            </RevealCard>

            {/* Sidebar Info */}
            <RevealCard delay={200} className="lg:col-span-2 space-y-8">
              <div className="space-y-5">
                {contactInfo.map((c, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-xl glass-card hover-lift">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <c.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{c.label}</div>
                      <div className="text-sm text-muted-foreground">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map embed */}
              <div className="rounded-xl overflow-hidden border border-border aspect-[4/3] shadow-lg">
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
