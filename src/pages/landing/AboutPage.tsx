import LandingLayout from "@/shared/components/layouts/LandingLayout";
import { RevealCard } from "@/shared/components/common/RevealCard";
import { Target, Eye, Heart, Lightbulb, Users, Award } from "lucide-react";

const values = [
  { icon: Heart, title: "Dedikasi", desc: "Kami berkomitmen penuh pada setiap proyek klien.", color: "primary" as const },
  { icon: Lightbulb, title: "Inovasi", desc: "Selalu mengadopsi teknologi dan pendekatan terbaru.", color: "secondary" as const },
  { icon: Users, title: "Kolaborasi", desc: "Bekerja bersama klien sebagai satu tim.", color: "accent" as const },
  { icon: Award, title: "Kualitas", desc: "Standar tinggi di setiap baris kode dan piksel.", color: "destructive" as const },
];

const colorMap = {
  primary: { bg: "bg-primary/10", text: "text-primary", border: "border-t-primary", gradient: "from-primary to-primary/60" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary", border: "border-t-secondary", gradient: "from-secondary to-secondary/60" },
  accent: { bg: "bg-accent/10", text: "text-accent", border: "border-t-accent", gradient: "from-accent to-accent/60" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive", border: "border-t-destructive", gradient: "from-destructive to-destructive/60" },
};

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
      <section className="relative py-20 sm:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
          <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-secondary/8 rounded-full blur-3xl" style={{ animation: "float-medium 6s ease-in-out infinite 1s" }} />
        </div>
        <div className="max-w-3xl mx-auto px-4">
          <RevealCard>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Tentang <span className="gradient-text">Kawasan Digital</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Kami adalah tim profesional yang berdedikasi membantu bisnis Indonesia membangun kehadiran digital yang kuat dan berdampak.
            </p>
          </RevealCard>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-primary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <RevealCard className="p-8 rounded-xl glass-card hover-lift">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-5 shadow-lg">
              <Eye className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Visi</h2>
            <p className="text-muted-foreground leading-relaxed">
              Menjadi mitra digital terdepan yang memberdayakan bisnis Indonesia untuk tumbuh melalui teknologi web modern dan solusi digital inovatif.
            </p>
          </RevealCard>
          <RevealCard delay={150} className="p-8 rounded-xl glass-card hover-lift">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-5 shadow-lg">
              <Target className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Misi</h2>
            <ul className="text-muted-foreground space-y-2.5 leading-relaxed">
              {[
                "Menyediakan solusi website berkualitas tinggi dengan harga terjangkau",
                "Memberikan layanan dan dukungan yang responsif dan profesional",
                "Terus berinovasi mengikuti perkembangan teknologi terkini",
                "Membangun hubungan jangka panjang dengan setiap klien",
              ].map((m, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-secondary to-accent flex-shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </RevealCard>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealCard className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">
              Nilai-Nilai <span className="gradient-text">Kami</span>
            </h2>
            <p className="text-muted-foreground">Prinsip yang menjadi fondasi dalam setiap pekerjaan kami.</p>
          </RevealCard>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => {
              const c = colorMap[v.color];
              return (
                <RevealCard
                  key={i}
                  delay={i * 100}
                  className={`text-center p-6 rounded-xl border-t-4 ${c.border} border border-border bg-card hover-lift glass-card`}
                >
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <v.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </RevealCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-secondary/5 border-y border-border">
        <div className="max-w-3xl mx-auto px-4">
          <RevealCard className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">
              Perjalanan <span className="gradient-text">Kami</span>
            </h2>
          </RevealCard>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <RevealCard key={i} delay={i * 100} className="flex gap-6 items-start relative">
                  {/* Dot */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg colored-shadow-primary">
                    <span className="text-sm font-bold text-primary-foreground">{m.year}</span>
                  </div>
                  <div className="pt-3 pb-2 px-5 rounded-xl glass-card flex-1 hover-lift">
                    <p className="text-foreground font-medium">{m.event}</p>
                  </div>
                </RevealCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
