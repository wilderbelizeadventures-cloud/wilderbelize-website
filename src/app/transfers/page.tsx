import type { Metadata } from "next";
import { ArrowRight, Check, Car } from "lucide-react";
import { VideoHero } from "@/components/VideoHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { InquiryForm } from "@/components/InquiryForm";
import { site } from "@/data/site";
import { TransferSlideshow } from "@/components/TransferSlideshow";

export const metadata: Metadata = {
  title: "Private Ground Transfers",
  description: site.transfer.description,
};

export default function TransfersPage() {
  const t = site.transfer;
  return (
    <>
      <VideoHero
        videoSrc="/videos/transfers-hero.mp4"
        poster="/images/heroes/hero-coast.jpg"
        kicker="Door to door"
        title={t.title}
        subtitle={t.description}
        crumbs={[{ label: "Home", href: "/" }, { label: "Transfers" }]}
      />

      <section className="section">
        <div className="container-page">
          <Reveal>
            <SectionHeading align="center" kicker="Popular routes" title="Where can we take you?" subtitle="Fixed, transparent pricing for private air-conditioned transfers. Rates are per vehicle, not per person." />
          </Reveal>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { from: "Belize Airport", to: "Placencia", price: "$300", duration: "One-way" },
              { from: "Placencia", to: "Belize Airport", price: "$300", duration: "One-way" },
              { from: "Belize Airport ↔ Placencia", to: "Round Trip", price: "$550", duration: "Round Trip" },
            ].map((r) => (
              <StaggerItem key={`${r.from}-${r.to}`}>
                <div className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-soft ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-lift">
                  <Car className="h-7 w-7 text-jungle-600" />
                  <div className="mt-4 flex items-center gap-2 font-display text-lg font-bold text-ink">
                    <span>{r.from}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-coral-600">
                    <ArrowRight className="h-4 w-4" /> {r.to}
                  </div>
                  <div className="mt-4 flex items-end justify-between border-t border-ink/5 pt-4">
                    <div>
                      <span className="text-xs font-semibold uppercase text-ink-faint">From</span>
                      <div className="font-display text-2xl font-extrabold text-ink">

                            {/* <span className="mr-2 text-lg text-ink-soft line-through">{r.price}</span> */}
                            <span>{r.price}</span>

                      </div>
                    </div>
                    <span className="rounded-full bg-jungle-50 px-3 py-1 text-xs font-bold text-jungle-700">{r.duration}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Included + request */}
      <section className="section pt-0">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl bg-jungle-950 p-8 text-white">
              <TransferSlideshow />

              <h2 className="mt-6 font-display text-2xl font-bold text-white">
                Travel in Comfort
              </h2>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="space-y-2 text-sm text-white/90">
                  <p><span className="font-semibold text-white">$300 USD:</span> One-way (1–4 Persons)</p>
                  <p><span className="font-semibold text-white">$30 USD:</span> Each additional Person</p>
                  <p><span className="font-semibold text-white">Free:</span> Children under 10 years of age</p>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-xs leading-6 text-white/70">
                    <span className="font-semibold text-white">Note:</span> All shuttle services must be booked in advance with a specific pick-up location, destination, and scheduled time. A non-refundable deposit of 50% is required to confirm your booking. We recommend reserving your shuttle as early as possible, especially for round-trip transfers, as availability is limited.
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-3.5">
                {t.included.map((i) => (
                  <li key={i} className="flex gap-3 text-white/85">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jungle-500">
                      <Check className="h-4 w-4" />
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal>
            <div className="rounded-3xl bg-white p-7 shadow-lift ring-1 ring-ink/5">
              <h2 className="font-display text-2xl font-bold text-ink">Request a transfer</h2>
              <p className="mt-1.5 text-sm text-ink-soft">
                Tell us your route, dates, flight times and group size — we&apos;ll reply with a quote and confirm your ride.
              </p>
              <div className="mt-6">
                <InquiryForm mode="contact" submitLabel="Request my transfer" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
