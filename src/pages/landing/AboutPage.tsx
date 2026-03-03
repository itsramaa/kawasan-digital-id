import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { Target, Eye, Heart, Lightbulb, Users, Award } from "lucide-react";

const values = [
  { icon: Heart, title: "Dedikasi", desc: "Kami berkomitmen penuh pada setiap proyek klien." },
  { icon: Lightbulb, title: "Inovasi", desc: "Selalu mengadopsi teknologi dan pendekatan terbaru." },
  { icon: Users, title: "Kolaborasi", desc: "Bekerja bersama klien sebagai satu tim." },
  { icon: Award, title: "Kualitas", desc: "Standar tinggi di setiap baris kode dan piksel." },
];

const milestones = [
  { year: "2020", event: "Kawasan Digital didirikan di Jakarta" },
  { year: "2021", event: "Melayani 20+ klien pertama dari berbagai industri" },
  { year: "2022", event: "Meluncurkan layanan template website siap pakai" },
  { year: "2023", event: "Ekspansi tim dan layanan maintenance 24/7" },
  { year: "2024", event: "50+ klien aktif & 100+ website terdelivery" },
];

export default function AboutPage() {
  return (
    <LandingLayout>
      {/* Hero */}
      <section className="py-20 sm:py-28 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <RevealCard>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">Tentang Kawasan Digital</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Kami adalah tim profesional yang berdedikasi membantu bisnis Indonesia membangun kehadiran digital yang kuat dan berdampak.
            </p>
          </RevealCard>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <RevealCard className="p-8 rounded-xl bg-card border border-border">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Visi</h2>
            <p className="text-muted-foreground leading-relaxed">
              Menjadi mitra digital terdepan yang memberdayakan bisnis Indonesia untuk tumbuh melalui teknologi web modern dan solusi digital inovatif.
            </p>
          </RevealCard>
          <RevealCard delay={150} className="p-8 rounded-xl bg-card border border-border">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Misi</h2>
            <ul className="text-muted-foreground space-y-2 leading-relaxed">
              <li>• Menyediakan solusi website berkualitas tinggi dengan harga terjangkau</li>
              <li>• Memberikan layanan dan dukungan yang responsif dan profesional</li>
              <li>• Terus berinovasi mengikuti perkembangan teknologi terkini</li>
              <li>• Membangun hubungan jangka panjang dengan setiap klien</li>
            </ul>
          </RevealCard>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Nilai-Nilai Kami</h2>
            <p className="text-muted-foreground">Prinsip yang menjadi fondasi dalam setiap pekerjaan kami.</p>
          </RevealCard>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <RevealCard key={i} delay={i * 100} className="text-center p-6 rounded-xl border border-border bg-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-3xl mx-auto px-4">
          <RevealCard className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Perjalanan Kami</h2>
          </RevealCard>
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <RevealCard key={i} delay={i * 80} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{m.year}</span>
                </div>
                <div className="pt-4">
                  <p className="text-foreground font-medium">{m.event}</p>
                </div>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
