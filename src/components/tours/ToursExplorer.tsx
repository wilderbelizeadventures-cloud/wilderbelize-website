"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import { tours, allDifficulties, allInterests, priceRange } from "@/data/tours";
import { TourCard } from "@/components/TourCard";
import { cn } from "@/lib/utils";

type Sort = "recommended" | "price-asc" | "price-desc" | "rating" | "duration";

const SORTS: { value: Sort; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "duration", label: "Shortest first" },
];

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function ToursExplorer({
  initialCategory,
  initialInterest,
}: {
  initialCategory?: string;
  initialInterest?: string;
}) {
  const startCategory =
    initialCategory === "full-day"
      ? "Full Day"
      : initialCategory === "half-day"
      ? "Half Day"
      : initialCategory === "multi-day"
      ? "Multi-day"
      : "all";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(startCategory);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>(initialInterest ? [initialInterest] : []);
  const [maxPrice, setMaxPrice] = useState<number>(priceRange.max);
  const [sort, setSort] = useState<Sort>("recommended");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = tours.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (difficulties.length && !difficulties.includes(t.difficulty)) return false;
      if (interests.length && !interests.some((i) => t.bestFor.includes(i))) return false;
      if (t.price > maxPrice) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!`${t.name} ${t.shortDescription} ${t.bestFor.join(" ")}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        case "duration": return a.durationHours - b.durationHours;
        default: return Number(b.featured) - Number(a.featured) || b.rating - a.rating;
      }
    });
    console.log(
      "Multi-day tours:",
      tours
        .filter((t) => t.category === "Multi-day")
        .map((t) => ({
          name: t.name,
          slug: t.slug,
          rating: t.rating,
          reviews: t.reviews,
        }))
    );
    return list;
  }, [category, difficulties, interests, maxPrice, query, sort]);

  const activeCount =
    (category !== "all" ? 1 : 0) + difficulties.length + interests.length + (maxPrice < priceRange.max ? 1 : 0);

  function reset() {
    setCategory("all");
    setDifficulties([]);
    setInterests([]);
    setMaxPrice(priceRange.max);
    setQuery("");
  }

  const FilterControls = () => (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-ink">Category</h3>
        <div className="space-y-1.5">
          {["all", "Full Day", "Half Day", "Multi-day"].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                category === c ? "bg-jungle-600 text-white" : "bg-sand-100 text-ink-soft hover:bg-jungle-50",
              )}
            >
              {c === "all" ? "All adventures" : c}
              <span className={cn("text-xs", category === c ? "text-white/70" : "text-ink-faint")}>
                {c === "all" ? tours.length : tours.filter((t) => t.category === c).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-ink">Difficulty</h3>
        <div className="space-y-2">
          {allDifficulties.map((d) => (
            <Checkbox key={d} label={d} checked={difficulties.includes(d)} onChange={() => setDifficulties((s) => toggle(s, d))} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-ink">Interest</h3>
        <div className="space-y-2">
          {allInterests.map((i) => (
            <Checkbox key={i} label={i} checked={interests.includes(i)} onChange={() => setInterests((s) => toggle(s, i))} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-ink">Max price</h3>
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-coral-500"
        />
        <div className="mt-1 flex justify-between text-xs font-semibold text-ink-faint">
          <span>${priceRange.min}</span>
          <span className="text-ink">Up to ${maxPrice}</span>
        </div>
      </div>

      {activeCount > 0 && (
        <button onClick={reset} className="btn btn-ghost w-full">
          <X className="h-4 w-4" /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <section className="section">
      <div className="container-page">
        <div className="mb-8 rounded-2xl border-l-4 border-jungle-600 bg-jungle-50 px-6 py-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Eco-Friendly Tours & Packages
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Explore Belize responsibly. Every tour is planned to support nature conservation, respect local communities, and minimize environmental impact.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-jungle-200 bg-white px-4 py-2 text-xs font-semibold text-jungle-700">
              <span className="h-2 w-2 rounded-full bg-jungle-600" />
              Sustainable Tourism
            </div>
          </div>
        </div>
        {/* Search + sort bar */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-md">
            <Search aria-hidden className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search adventures…"
              aria-label="Search adventures"
              className="w-full rounded-full border border-ink/10 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-jungle-500 focus:ring-2 focus:ring-jungle-500/20"
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDrawerOpen(true)} className="btn btn-ghost relative lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {activeCount > 0 && <span className="ml-1 rounded-full bg-coral-500 px-1.5 text-xs text-white">{activeCount}</span>}
            </button>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
              <span className="hidden sm:inline">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-full border border-ink/10 bg-white py-2.5 pl-3 pr-8 text-sm font-semibold outline-none transition focus:border-jungle-500 focus-visible:ring-2 focus-visible:ring-jungle-500/30"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-ink/5">
              <FilterControls />
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-ink-soft">
                {filtered.length} {filtered.length === 1 ? "adventure" : "adventures"}
              </p>
              {category !== "all" && <Chip label={category} onRemove={() => setCategory("all")} />}
              {difficulties.map((d) => <Chip key={d} label={d} onRemove={() => setDifficulties((s) => toggle(s, d))} />)}
              {interests.map((i) => <Chip key={i} label={i} onRemove={() => setInterests((s) => toggle(s, i))} />)}
              {maxPrice < priceRange.max && <Chip label={`≤ $${maxPrice}`} onRemove={() => setMaxPrice(priceRange.max)} />}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center shadow-soft ring-1 ring-ink/5">
                <p className="font-display text-xl font-bold text-ink">No adventures match those filters</p>
                <p className="mt-2 text-ink-soft">Try widening your search — or let us build a custom trip.</p>
                <button onClick={reset} className="btn btn-jungle mt-6">Clear filters</button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((tour, i) => (
                  <TourCard key={tour.slug} tour={tour} priority={i < 3} className="h-full" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto bg-sand-50 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg font-extrabold text-ink">Filters</span>
              <button type="button" aria-label="Close filters" onClick={() => setDrawerOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-jungle-50 text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterControls />
            <button onClick={() => setDrawerOpen(false)} className="btn btn-primary mt-8 w-full">
              Show {filtered.length} adventures
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex w-full items-center gap-3 text-left text-sm font-medium text-ink-soft transition hover:text-ink">
      <span className={cn("flex h-5 w-5 items-center justify-center rounded-md border-2 transition", checked ? "border-jungle-600 bg-jungle-600 text-white" : "border-ink/20 bg-white")}>
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      {label}
    </button>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button onClick={onRemove} className="inline-flex items-center gap-1.5 rounded-full bg-jungle-100 px-3 py-1 text-xs font-bold text-jungle-800 transition hover:bg-jungle-200">
      {label}
      <X className="h-3 w-3" />
    </button>
  );
}
