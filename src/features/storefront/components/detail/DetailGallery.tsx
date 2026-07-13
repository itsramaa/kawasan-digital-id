"use client";
import { useState } from "react";
import { Monitor, Smartphone, ExternalLink, Sparkles, Star } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { ServiceTemplate } from "../../types";

interface DetailGalleryProps {
  template: ServiceTemplate;
  galleryImages: string[];
}

export function DetailGallery({ template, galleryImages }: DetailGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");

  const isNew = (new Date().getTime() - new Date(template.created_at).getTime()) < 30 * 24 * 60 * 60 * 1000;

  return (
    <div className="lg:col-span-3 space-y-3">
      {/* Main image */}
      <div className={cn(
        "relative rounded-xl bg-muted overflow-hidden flex items-center justify-center border border-border group",
        devicePreview === "mobile" ? "max-w-xs mx-auto aspect-[9/16]" : "aspect-video"
      )}>
        {galleryImages.length > 0 ? (
          <img
            key={selectedImage}
            src={galleryImages[selectedImage]}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 animate-fade-in"
          />
        ) : (
          <Sparkles className="w-16 h-16 text-muted-foreground/30" />
        )}

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {template.is_featured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-xs font-semibold backdrop-blur-sm shadow-lg">
              <Star className="w-3 h-3 fill-current" /> Best Seller
            </span>
          )}
          {isNew && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold backdrop-blur-sm shadow-lg">
              New
            </span>
          )}
        </div>

        {/* Counter */}
        {galleryImages.length > 1 && (
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
            {selectedImage + 1} / {galleryImages.length}
          </span>
        )}
      </div>

      {/* Thumbnails + controls */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2 flex-1 overflow-x-auto">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={cn(
                "w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all",
                selectedImage === i
                  ? "border-primary ring-2 ring-primary/20 scale-105"
                  : "border-border hover:border-primary/40 opacity-70 hover:opacity-100"
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
          <button
            onClick={() => setDevicePreview("desktop")}
            className={cn("p-1.5 rounded-md transition-colors", devicePreview === "desktop" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevicePreview("mobile")}
            className={cn("p-1.5 rounded-md transition-colors", devicePreview === "mobile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {template.demo_url && (
        <a
          href={template.demo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="w-4 h-4" /> View Live Demo
        </a>
      )}
    </div>
  );
}
