"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

interface VideoHeroProps {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  videoSrc?: string;
  poster?: string;
  crumbs?: Crumb[];
  className?: string;
  overlayOpacity?: "light" | "medium" | "dark";
}

export function VideoHero({
  kicker,
  title,
  subtitle,
  videoSrc,
  poster,
  crumbs,
  className,
  overlayOpacity = "medium",
}: VideoHeroProps) {
  const overlayClasses = {
    light: "from-ink/60 via-ink/30 to-ink/20",
    medium: "from-ink/90 via-ink/45 to-ink/30",
    dark: "from-ink/95 via-ink/60 to-ink/40",
  };

  const posterPath = poster || "/images/heroes/hero-coast.jpg";

  return (
    <section className={cn("relative flex min-h-[58vh] items-end overflow-hidden", className)}>
      {/* Background Image / Video */}
      <img
        src={posterPath}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {videoSrc && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster={posterPath}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Overlay Gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-t", overlayClasses[overlayOpacity])} />

      {/* Content */}
      <div className="container-page relative z-10 pb-14 pt-28 text-center">
        <div className="mx-auto max-w-3xl">
          {crumbs && (
            <nav className="mb-5 flex items-center justify-center gap-1.5 text-sm text-white/70">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                  {c.href ? (
                    <Link href={c.href} className="transition hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {kicker && <p className="kicker justify-center text-coral-300">{kicker}</p>}
          <h1 className="mt-3 font-display text-4xl font-extrabold text-white drop-shadow-sm md:text-6xl">
            {title}
          </h1>
          {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
