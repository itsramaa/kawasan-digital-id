import { cn } from "@/src/lib/utils";

interface PatternProps {
  className?: string;
}

const waveSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%233D6CB9' fill-opacity='0.03' d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`;

const topoSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cpath d='M0 300Q150 250 300 300T600 300' fill='none' stroke='%233D6CB9' stroke-opacity='0.04' stroke-width='1.5'/%3E%3Cpath d='M0 200Q150 150 300 200T600 200' fill='none' stroke='%2300D1FF' stroke-opacity='0.03' stroke-width='1'/%3E%3Cpath d='M0 400Q150 350 300 400T600 400' fill='none' stroke='%2300FFF0' stroke-opacity='0.03' stroke-width='1'/%3E%3Cpath d='M0 100Q200 60 400 100T600 80' fill='none' stroke='%233D6CB9' stroke-opacity='0.02' stroke-width='1'/%3E%3Cpath d='M0 500Q200 460 400 500T600 480' fill='none' stroke='%2300D1FF' stroke-opacity='0.02' stroke-width='1'/%3E%3C/svg%3E")`;

const gridSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M60 0L0 0 0 60' fill='none' stroke='%233D6CB9' stroke-opacity='0.04' stroke-width='0.5'/%3E%3Ccircle cx='0' cy='0' r='1' fill='%233D6CB9' fill-opacity='0.06'/%3E%3C/svg%3E")`;

const blobSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Cellipse cx='400' cy='300' rx='250' ry='180' fill='%233D6CB9' fill-opacity='0.02' transform='rotate(-15 400 300)'/%3E%3Cellipse cx='300' cy='500' rx='200' ry='150' fill='%2300D1FF' fill-opacity='0.02' transform='rotate(10 300 500)'/%3E%3Cellipse cx='550' cy='550' rx='180' ry='120' fill='%2300FFF0' fill-opacity='0.015' transform='rotate(-5 550 550)'/%3E%3C/svg%3E")`;

const diagonalSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 40L40 0' fill='none' stroke='%233D6CB9' stroke-opacity='0.03' stroke-width='0.5'/%3E%3C/svg%3E")`;

const circuitSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='2' fill='%233D6CB9' fill-opacity='0.06'/%3E%3Cpath d='M50 0V50H100' fill='none' stroke='%233D6CB9' stroke-opacity='0.03' stroke-width='0.5'/%3E%3Ccircle cx='0' cy='0' r='1.5' fill='%2300D1FF' fill-opacity='0.05'/%3E%3Cpath d='M0 50H25' fill='none' stroke='%2300D1FF' stroke-opacity='0.03' stroke-width='0.5'/%3E%3C/svg%3E")`;

export function WavePattern({ className }: PatternProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none -z-10", className)}
      style={{
        backgroundImage: waveSvg,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        backgroundSize: "100% 40%",
      }}
    />
  );
}

export function TopographyPattern({ className }: PatternProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none -z-10", className)}
      style={{
        backgroundImage: topoSvg,
        backgroundRepeat: "repeat",
        backgroundSize: "600px 600px",
      }}
    />
  );
}

export function GridLinesPattern({ className }: PatternProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none -z-10", className)}
      style={{
        backgroundImage: gridSvg,
        backgroundRepeat: "repeat",
        backgroundSize: "60px 60px",
      }}
    />
  );
}

export function AbstractBlobPattern({ className }: PatternProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none -z-10", className)}
      style={{
        backgroundImage: blobSvg,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    />
  );
}

export function DiagonalLinesPattern({ className }: PatternProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none -z-10", className)}
      style={{
        backgroundImage: diagonalSvg,
        backgroundRepeat: "repeat",
        backgroundSize: "40px 40px",
      }}
    />
  );
}

export function CircuitPattern({ className }: PatternProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none -z-10", className)}
      style={{
        backgroundImage: circuitSvg,
        backgroundRepeat: "repeat",
        backgroundSize: "100px 100px",
      }}
    />
  );
}

interface ImageOverlayProps {
  src: string;
  className?: string;
}

export function ImageOverlay({ src, className }: ImageOverlayProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none -z-10 overflow-hidden", className)}>
      <img
        src={src}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.04] blur-sm"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
    </div>
  );
}
