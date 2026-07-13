import { Search, LayoutGrid, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TemplatesHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalTemplates: number;
  totalCategories: number;
}

export function TemplatesHero({ searchQuery, onSearchChange, totalTemplates, totalCategories }: TemplatesHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-border p-8 lg:p-12">
      {/* Animated gradient orbs */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-2xl space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Katalog Template
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          Temukan Template Website Sempurna
        </h1>
        <p className="text-muted-foreground text-base lg:text-lg">
          Pilih dari koleksi template profesional kami dan sesuaikan sesuai kebutuhan bisnis Anda.
        </p>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari template..."
            className="pl-10 bg-background/80 backdrop-blur-sm"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <LayoutGrid className="w-4 h-4 text-primary" />
            <span><span className="font-semibold text-foreground">{totalTemplates}</span> Templates</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span><span className="font-semibold text-foreground">{totalCategories}</span> Kategori</span>
          </div>
        </div>
      </div>
    </div>
  );
}
