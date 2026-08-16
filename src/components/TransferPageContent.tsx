"use client";

import { useState } from "react";
import { ArrowRight, Check, Car, CreditCard } from "lucide-react";
import { VideoHero } from "@/components/VideoHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { TransferSlideshow } from "@/components/TransferSlideshow";
import { TransferBookingForm, TRANSFER_ROUTES } from "@/components/TransferBookingForm";

interface TransferPageContentProps {
  siteTransfer: {
    title: string;
    description: string;
    included: readonly string[];
  };
}

export function TransferPageContent({ siteTransfer }: TransferPageContentProps) {
  const [selectedRouteId, setSelectedRouteId] = useState("bze-to-placencia");

  const handleSelectRoute = (id: string) => {
    setSelectedRouteId(id);
    const element = document.getElementById("transfer-booking-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <VideoHero
        videoSrc="/images/belize-background-web.mp4"
        poster="/images/heroes/hero-coast.jpg"
        kicker="Door to door"
        title={siteTransfer.title}
        subtitle={siteTransfer.description}
        crumbs={[{ label: "Home", href: "/" }, { label: "Transfers" }]}
      />

      {/* Popular Routes Section */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              align="center"
              kicker="Popular routes"
              title="Where can we take you?"
              subtitle="Fixed, transparent pricing for private air-conditioned transfers. Rates are per vehicle (1–4 persons), not per person."
            />
          </Reveal>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "bze-to-placencia",
                from: "Belize Airport (BZE)",
                to: "Placencia",
                price: "$300 USD",
                duration: "One-way",
                tagline: "Direct airport transfer to resort",
              },
              {
                id: "placencia-to-bze",
                from: "Placencia",
                to: "Belize Airport (BZE)",
                price: "$300 USD",
                duration: "One-way",
                tagline: "Comfortable departure shuttle",
              },
              {
                id: "bze-placencia-roundtrip",
                from: "Belize Airport ↔ Placencia",
                to: "Round Trip",
                price: "$550 USD",
                duration: "Round Trip",
                tagline: "Complete arrival & departure coverage",
              },
            ].map((r) => (
              <StaggerItem key={r.id}>
                <div className="flex h-full flex-col justify-between rounded-3xl bg-white p-6 shadow-soft ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-lift">
                  <div>
                    <div className="flex items-center justify-between">
                      <Car className="h-7 w-7 text-jungle-600" />
                      <span className="rounded-full bg-jungle-50 px-3 py-1 text-xs font-bold text-jungle-700">
                        {r.duration}
                      </span>
                    </div>

                    <div className="mt-4 font-display text-lg font-bold text-ink">
                      <span>{r.from}</span>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-coral-600">
                      <ArrowRight className="h-4 w-4" /> {r.to}
                    </div>

                    <p className="mt-2 text-xs text-ink-soft">{r.tagline}</p>
                  </div>

                  <div className="mt-6 border-t border-ink/5 pt-4">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <span className="text-xs font-semibold uppercase text-ink-faint">Rate (1-4 Persons)</span>
                        <div className="font-display text-2xl font-extrabold text-ink">{r.price}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectRoute(r.id)}
                      className="btn btn-primary w-full justify-center gap-2 text-sm"
                    >
                      <CreditCard className="h-4 w-4" /> Book & Pay Now
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Included Details + Interactive Transfer Booking Form */}
      <section className="section pt-0" id="transfer-booking-section">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl bg-jungle-950 p-8 text-white h-full flex flex-col justify-between">
              <div>
                <TransferSlideshow />

                <h2 className="mt-6 font-display text-2xl font-bold text-white">Travel in Comfort</h2>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="space-y-2 text-sm text-white/90">
                    <p>
                      <span className="font-semibold text-white">$300 USD:</span> One-way (1–4 Persons)
                    </p>
                    <p>
                      <span className="font-semibold text-white">$550 USD:</span> Round Trip (1–4 Persons)
                    </p>
                    <p>
                      <span className="font-semibold text-white">$30 USD / $60 USD:</span> Per extra guest (5+ persons)
                    </p>
                    <p>
                      <span className="font-semibold text-white">Free:</span> Children under 10 years of age
                    </p>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="text-xs leading-6 text-white/70">
                      <span className="font-semibold text-white">Note:</span> All shuttle services must be booked in
                      advance with a specific pick-up location, destination, and scheduled time.
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3.5">
                  {siteTransfer.included.map((i) => (
                    <li key={i} className="flex gap-3 text-white/85 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-jungle-500 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-3xl bg-white p-7 shadow-lift ring-1 ring-ink/5">
              <div className="mb-6">
                <span className="rounded-full bg-coral-100 px-3 py-1 text-xs font-bold text-coral-700">
                  Instant Booking
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold text-ink">Book Private Van Transfer</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Select your route, date, and group size below to calculate exact pricing and pay securely with Belize Bank.
                </p>
              </div>

              <TransferBookingForm initialRouteId={selectedRouteId} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
