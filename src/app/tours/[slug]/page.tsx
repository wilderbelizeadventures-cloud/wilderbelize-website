import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock, Gauge, Users, Check, Star, ShieldCheck, Car, Leaf, ArrowRight,
  ChevronRight, MapPin, Backpack, Sparkles, CalendarCheck,
} from "lucide-react";
import { getTour, tours } from "@/data/tours";
import { TourGallery } from "@/components/tours/TourGallery";
import { MobileBookingBar } from "@/components/tours/MobileBookingBar";
import { InquiryForm } from "@/components/InquiryForm";
import { TourCard } from "@/components/TourCard";
import { StarRating } from "@/components/StarRating";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) return {};
  return {
    title: tour.name,
    description: tour.shortDescription,
    openGraph: { title: tour.name, description: tour.shortDescription, images: [tour.image] },
  };
}

const TRUST = [
  { icon: Car, label: "Free hotel pickup" },
  { icon: ShieldCheck, label: "Licensed guides" },
  { icon: Users, label: "Small groups" },
  { icon: Leaf, label: "Eco-friendly" },
];

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();

  const related = tours.filter((t) => t.slug !== tour.slug && t.category === tour.category).slice(0, 3);
  const paragraphs = tour.description.split("\n\n");

  const base = "https://wilderbelizeadventures.com";
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: tour.name,
      description: tour.shortDescription,
      image: `${base}${tour.image}`,
      touristType: tour.bestFor,
      provider: { "@type": "TravelAgency", name: "Wilder Belize Adventures", areaServed: "Belize" },
      offers: { "@type": "Offer", price: tour.price, priceCurrency: "USD", availability: "https://schema.org/InStock" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: tour.rating, reviewCount: tour.reviews },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Tours", item: `${base}/tours` },
        { "@type": "ListItem", position: 3, name: tour.name, item: `${base}/tours/${tour.slug}` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero band */}
      <section className="relative overflow-hidden bg-jungle-950 pb-28 pt-28 text-white md:pt-36">
        <div className="noise absolute inset-0 opacity-50" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-jungle-700/40 blur-3xl" />
        <div className="container-page relative">
          <nav className="flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/tours" className="transition hover:text-white">Tours</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">{tour.name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/15">{tour.category}</span>
            {tour.featured && <span className="rounded-full bg-coral-500 px-3 py-1 text-xs font-bold text-white">★ Bestseller</span>}
            {tour.bestFor.slice(0, 3).map((b) => (
              <span key={b} className="rounded-full bg-jungle-700/60 px-3 py-1 text-xs font-bold text-jungle-50">{b}</span>
            ))}
          </div>

          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">{tour.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">{tour.tagline}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-coral-300" /> {tour.duration}</span>
            <span className="inline-flex items-center gap-2"><Gauge className="h-4 w-4 text-coral-300" /> {tour.difficulty}</span>
            <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-coral-300" /> {tour.groupSize}</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-coral-300" /> Departs Placencia</span>
            <span className="inline-flex items-center gap-2">
              <StarRating rating={tour.rating} size={15} /> <span className="font-semibold">{tour.rating.toFixed(1)}</span>
              <span className="text-white/60">({tour.reviews} reviews)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Gallery (overlapping hero) */}
      <div className="container-page relative z-10 -mt-20">
        <TourGallery images={tour.gallery} alt={tour.name} theme={tour.theme} />
      </div>

      {/* Content + booking */}
      <section className="section pt-12 md:pt-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div className="min-w-0 space-y-12">
            {/* Highlights */}
            <Reveal>
              <div className="rounded-3xl bg-gradient-to-br from-jungle-50 to-lagoon-50 p-7 ring-1 ring-jungle-100">
                <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
                  <Sparkles className="h-6 w-6 text-coral-500" /> Trip highlights
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {tour.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-sm text-ink-soft">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-jungle-600" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Overview */}
            <Reveal>
              <div>
                <h2 className="font-display text-2xl font-bold text-ink">About this adventure</h2>
                <div className="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-ink-soft">
                  {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
            </Reveal>

            {/* Included / Bring */}
            <Reveal>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-7 shadow-soft ring-1 ring-ink/5">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                    <Check className="h-5 w-5 text-jungle-600" /> What&apos;s included
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                    {tour.included.map((i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-jungle-500" /> {i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl bg-white p-7 shadow-soft ring-1 ring-ink/5">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                    <Backpack className="h-5 w-5 text-coral-500" /> What to bring
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                    {tour.bring.map((i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-400" /> {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Itinerary */}
            <Reveal>
              <div>
                <h2 className="font-display text-2xl font-bold text-ink">Your day, step by step</h2>
                <ol className="mt-6 space-y-0">
                  {tour.itinerary.map((step, i) => (
                    <li key={i} className="relative flex gap-5 pb-8 last:pb-0">
                      {i < tour.itinerary.length - 1 && (
                        <span className="absolute left-[19px] top-10 h-full w-0.5 bg-jungle-100" />
                      )}
                      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-jungle-600 font-display text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <div className="pt-1.5">
                        <h3 className="font-display text-lg font-bold text-ink">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            {/* Meeting point */}
            <Reveal>
              <div>
                <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
                  <MapPin className="h-6 w-6 text-coral-500" /> Pickup &amp; meeting point
                </h2>
                <p className="mt-3 text-ink-soft">
                  Complimentary pickup and drop-off from hotels and resorts on the Placencia peninsula. We&apos;ll confirm
                  your exact pickup time when we lock in your booking.
                </p>
                <div className="mt-5 overflow-hidden rounded-3xl shadow-soft ring-1 ring-ink/5">
                  <iframe
                    title="Placencia Village map"
                    src="https://www.google.com/maps?q=Placencia%20Village%2C%20Belize&output=embed"
                    className="h-72 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — booking */}
          <aside id="book" className="lg:relative">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-3xl bg-white p-6 shadow-lift ring-1 ring-ink/5">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">From</span>
                    <div className="font-display text-4xl font-extrabold text-ink">
                      ${tour.price}
                      <span className="text-base font-semibold text-ink-faint"> / person</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-bold text-ink">
                      <Star className="h-4 w-4 fill-gold-400 text-gold-400" /> {tour.rating.toFixed(1)}
                    </div>
                    <div className="text-xs text-ink-faint">{tour.reviews} reviews</div>
                  </div>
                </div>

                <div className="my-5 grid grid-cols-2 gap-2">
                  {TRUST.map((t) => (
                    <div key={t.label} className="flex items-center gap-2 rounded-xl bg-sand-100 px-3 py-2 text-xs font-semibold text-ink-soft">
                      <t.icon className="h-4 w-4 text-jungle-600" /> {t.label}
                    </div>
                  ))}
                </div>

                <div className="border-t border-ink/10 pt-5">
                  <h2 className="font-display text-xl font-bold text-ink">Book your tour</h2>
                  <p className="mt-1 text-sm text-ink-soft">Enter your details before continuing to secure payment.</p>
                  <InquiryForm lockedTourName={tour.name} compact className="mt-5" submitLabel="Pay Now" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-jungle-50 p-4 text-center text-sm text-jungle-800">
                <CalendarCheck className="h-5 w-5 shrink-0 text-jungle-600" />
                <span>Free cancellation up to 48 hours before your tour.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section bg-sand-100">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-bold text-ink">More {tour.category.toLowerCase()} adventures</h2>
              <Link href="/tours" className="btn btn-jungle">All tours <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => <TourCard key={t.slug} tour={t} className="h-full" />)}
            </div>
          </div>
        </section>
      )}

      {/* Mobile booking bar (reserves body padding so it never covers the footer) */}
      <MobileBookingBar price={tour.price} />
    </>
  );
}
