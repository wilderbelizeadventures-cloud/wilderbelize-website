import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

export function PageHero({
  kicker,
  title,
  subtitle,
  image,
  theme = "jungle-hike",
  crumbs,
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image: string;
  theme?: string;
  crumbs?: Crumb[];
  className?: string;
}) {
  return (
    <section className={cn("relative flex min-h-[58vh] items-end overflow-hidden", className)}>
      <SmartImage src={image} alt="" theme={theme} priority className="absolute inset-0" sizes="100vw" imgClassName="scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/30" />
      <div className="container-page relative z-10 pb-14 pt-28 text-center">
        <div className="mx-auto max-w-3xl">
          {crumbs && (
            <nav className="mb-5 flex items-center justify-center gap-1.5 text-sm text-white/70">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                  {c.href ? (
                    <Link href={c.href} className="transition hover:text-white">{c.label}</Link>
                  ) : (
                    <span className="text-white">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {kicker && <p className="kicker justify-center text-coral-300">{kicker}</p>}
          <h1 className="mt-3 font-display text-4xl font-extrabold text-white drop-shadow-sm md:text-6xl">{title}</h1>
          {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
