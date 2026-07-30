import Link from "next/link";
import { Clock, Gauge, ArrowUpRight, Star } from "lucide-react";
import type { Tour } from "@/data/tours";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/utils";

export function TourCard({ tour, priority = false, className }: { tour: Tour; priority?: boolean; className?: string }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          src={tour.image}
          alt={tour.name}
          theme={tour.theme}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="absolute inset-0"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-jungle-800 backdrop-blur">
            {tour.category}
          </span>
          {tour.featured && (
            <span className="rounded-full bg-coral-500 px-3 py-1 text-xs font-bold text-white shadow-glow">
              ★ Bestseller
            </span>
          )}
        </div>

        {/* Bottom overlay: rating + price */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> {tour.rating.toFixed(1)}
            <span className="text-white/70">({tour.reviews})</span>
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 text-sm font-extrabold text-ink shadow">
            <span className="text-[0.65rem] font-semibold uppercase text-ink-faint">from </span>${tour.price}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-ink-faint">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-jungle-500" /> {tour.duration}</span>
          <span className="inline-flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-coral-500" /> {tour.difficulty}</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-jungle-700">
          {tour.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{tour.shortDescription}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {tour.bestFor.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-jungle-50 px-2.5 py-1 text-[0.7rem] font-bold text-jungle-700">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-1 border-t border-ink/5 pt-4 text-sm font-bold text-jungle-700">
          View adventure
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
