import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check, Compass, Sparkles } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Testimonials } from "@/components/home/Testimonials";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { TourCard } from "@/components/TourCard";
import { SmartImage } from "@/components/SmartImage";
import { site } from "@/data/site";
import { featuredTours, fullDayTours, halfDayTours, multiDayTours, allInterests } from "@/data/tours";
import { HERO_IMAGES, MISC_IMAGES } from "@/lib/images";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />


      {/* Featured tours */}
      <section className="bg-sand-100">
        <div className="container-page py-20 md:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              kicker="Most-loved trips"
              title="Featured adventures"
              subtitle="Hand-picked favorites that show off the wild range of Belize — from canopy to cave."
            />
            <Link href="/tours" className="btn btn-jungle hidden md:inline-flex">
              All {fullDayTours.length + halfDayTours.length} tours <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ...multiDayTours.filter((tour) => tour.slug === "wilder-belize-adventures-7-day-premium-experience"),
              ...featuredTours.filter(
                (tour) =>
                  tour.slug === "xunantunich-cave-tubing" ||
                  (
                    tour.slug !== "mayan-sky-zip-line-river-tubing-waterfall" &&
                    tour.slug !== "wilder-belize-adventures-7-day-premium-experience" &&
                    tour.slug !== "bocawina-jungle-zipline-adventure"
                  ),
              ),
            ]
              .slice(0, 6)
              .map((tour, i) => (
                <StaggerItem key={tour.slug} className="h-full">
                  <TourCard tour={tour} priority={i < 3} className="h-full" />
                </StaggerItem>
              ))}
          </Stagger>

          <div className="mt-10 text-center md:hidden">
            <Link href="/tours" className="btn btn-jungle w-full">
              View all tours <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories split */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              align="center"
              kicker="How much time do you have?"
              title="Full-day, half-day & multi-day adventures"
              subtitle="Choose from quick half-day escapes, immersive full-day expeditions, or unforgettable multi-day packages."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { href: "/tours?category=full-day", title: "Full-Day Adventures", count: fullDayTours.length, img: HERO_IMAGES.canopy, theme: "jungle-hike", blurb: "Big expeditions — Maya temples, jaguar trails, and triple-threat jungle days." },
              { href: "/tours?category=half-day", title: "Half-Day Adventures", count: halfDayTours.length, img: HERO_IMAGES.waterfall, theme: "waterfall", blurb: "Quick hits of adrenaline and wonder, perfect alongside your beach days." },
              {
                href: "/tours?category=multi-day",
                title: "Multi-Day Packages",
                count: multiDayTours.length,
                img: HERO_IMAGES.boating,
                theme: "jungle-hike",
                blurb: "Epic multi-day journeys that combine Belize's best adventures into one unforgettable experience.",
              },
            ].map((c) => (
              <Reveal key={c.href}>
                <Link href={c.href} className="group relative flex min-h-[340px] items-end overflow-hidden rounded-3xl p-8 text-white shadow-lift">
                  <SmartImage src={c.img} alt={c.title} theme={c.theme} className="absolute inset-0" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
                  <div className="relative">
                    <span className="kicker text-coral-300">{c.count} adventures</span>
                    <h3 className="mt-2 font-display text-3xl font-extrabold text-white">{c.title}</h3>
                    <p className="mt-2 max-w-sm text-sm text-white/80">{c.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-bold text-white">
                      Explore <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us + image */}
      <section className="section bg-jungle-950 text-white">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl shadow-lift">
              <video
                className="aspect-[4/3] w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
                poster="/images/heroes/hero-waterfall.jpg"
              >
                <source src="/videos/wilder-website-cinematic.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Reveal>
          <Reveal>
            <div>
              <SectionHeading
                light
                kicker="Why travelers choose Wilder"
                title="Real Belize, real Belizians"
              />
              <ul className="mt-8 space-y-5">
                {site.whyChooseUs.map((w) => (
                  <li key={w.title} className="flex gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-jungle-500 text-white">
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">{w.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/70">{w.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/about" className="btn btn-primary mt-9">
                Meet the team <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>


      {/* Interests */}
      <section className="section">
        <div className="container-page text-center">
          <Reveal>
            <SectionHeading align="center" kicker="Find your kind of wild" title="Adventures by interest" />
          </Reveal>
          <Reveal className="mt-8 flex flex-wrap justify-center gap-3">
            {allInterests.map((interest) => (
              <Link
                key={interest}
                href={`/tours?interest=${encodeURIComponent(interest)}`}
                className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-soft transition hover:border-jungle-500 hover:bg-jungle-600 hover:text-white"
              >
                <Sparkles className="h-4 w-4 text-coral-500 group-hover:text-white" />
                {interest}
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Transfers teaser */}
      <section className="section pt-0">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl">
              <SmartImage src="/images/Torch-1.JPG" alt="Belize torch ceremony" theme="jungle-hike" className="absolute inset-0" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-jungle-950/90 via-jungle-900/70 to-jungle-900/30" />
              <div className="relative grid items-center gap-6 p-8 md:grid-cols-[1.5fr_1fr] md:p-12">
                <div>
                  <span className="kicker text-coral-300">Door to door</span>
                  <h3 className="mt-2 font-display text-3xl font-extrabold text-white md:text-4xl">Private ground transfers across Belize</h3>
                  <p className="mt-3 max-w-lg text-white/80">
                    Skip the guesswork. Our air-conditioned vehicles and local drivers get you from the airport to your
                    resort and back — comfortably and on time.
                  </p>
                </div>
                <div className="flex md:justify-end">
                  <Link href="/transfers" className="btn btn-primary">
                    <Compass className="h-5 w-5" /> See transfer routes
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
