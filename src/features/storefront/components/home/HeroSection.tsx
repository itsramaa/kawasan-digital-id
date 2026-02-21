import { Link } from "react-router-dom";
import { Search, Sparkles, Star, Users, Globe } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";

export function HeroSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/8" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div
        ref={ref}
        className={`relative max-w-6xl mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center space-y-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* Announcement badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-2 border border-primary/20 bg-primary/5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Trusted by 50+ Businesses
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
          Order Website{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Siap Pakai
          </span>{" "}
          atau Custom
        </h1>

        <p className="max-w-2xl mx-auto text-muted-foreground text-base lg:text-lg leading-relaxed">
          Dapatkan website profesional untuk bisnis Anda. Pilih dari template siap pakai atau buat dari nol sesuai kebutuhan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild size="lg" className="text-base px-8">
            <Link to="/templates">
              <Search className="w-4 h-4" /> Browse Templates
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base px-8">
            <Link to="/custom">
              <Sparkles className="w-4 h-4" /> Custom Website
            </Link>
          </Button>
        </div>

        {/* Social proof stats */}
        <div className="flex flex-wrap justify-center gap-8 pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">50+</span> Klien
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">100+</span> Website
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-foreground">4.9</span> Rating
          </div>
        </div>
      </div>
    </section>
  );
}
