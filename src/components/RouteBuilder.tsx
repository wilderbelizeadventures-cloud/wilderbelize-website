"use client";

import { useState, useMemo } from "react";
import {
  ArrowRight,
  Check,
  Mail,
  Minus,
  Plus,
  Send,
  X,
  Landmark,
  Mountain,
  Waves,
  Bird,
  Palette,
  TreePine,
  Fish,
  Binoculars,
  Tent,
  Loader2,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { company } from "@/data/site";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/utils";

// Tour type definition
type Tour = {
  slug: string;
  name: string;
  category: "Full Day" | "Half Day" | "Multi-day";
  duration: string;
  shortDescription: string;
  image: string;
  theme: string;
};

// Individual tour definitions based on user's list
const INDIVIDUAL_TOURS: Tour[] = [
  // Full Day Tours
  {
    slug: "xunantunich-mayan-ruins",
    name: "Xunantunich Mayan Ruins",
    category: "Full Day",
    duration: "Full Day · 6-8 hrs",
    shortDescription: "Climb El Castillo, the iconic Maya pyramid, and explore the ancient city of Xunantunich with panoramic views across Belize and Guatemala.",
    image: "/images/themes/xunantunich-belize-maya-temple.jpg",
    theme: "mayan-ruins",
  },
  {
    slug: "inland-blue-hole",
    name: "Inland Blue Hole",
    category: "Full Day",
    duration: "Full Day · 6-8 hrs",
    shortDescription: "Swim in the crystal-clear turquoise waters of the Inland Blue Hole, a stunning cenote surrounded by lush tropical forest.",
    image: "/images/themes/Inland-Blue-Hole-Belize-3.jpg",
    theme: "waterfall",
  },
  {
    slug: "cave-tubing",
    name: "Cave Tubing",
    category: "Full Day",
    duration: "Full Day · 6-8 hrs",
    shortDescription: "Float on inner tubes through ancient limestone caves, drifting along underground rivers once sacred to the Maya.",
    image: "/images/themes/belize-cave-tubing.jpg",
    theme: "cave-tubing",
  },
  {
    slug: "cave-kayaking",
    name: "Cave Kayaking",
    category: "Full Day",
    duration: "Full Day · 6-8 hrs",
    shortDescription: "Paddle through mystical cave systems by kayak, navigating underground waterways and discovering hidden chambers.",
    image: "/images/themes/Kayaking 2.jpg",
    theme: "kayak",
  },
  {
    slug: "atm-cave-exploration",
    name: "ATM Cave Exploration",
    category: "Full Day",
    duration: "Full Day · 8-10 hrs",
    shortDescription: "Venture deep into Actun Tunichil Muknal, the sacred cave of the Crystal Maiden, with ancient Maya artifacts and skeletal remains.",
    image: "/images/themes/ATM Cave Adve.jpg",
    theme: "cave",
  },
  {
    slug: "jaguar-reserve",
    name: "Jaguar Reserve",
    category: "Full Day",
    duration: "Full Day · 6-8 hrs",
    shortDescription: "Explore the world's first jaguar preserve in Cockscomb Basin, hiking through pristine rainforest and spotting exotic wildlife.",
    image: "/images/themes/jaguar-cockscomb-TR_150426.jpg",
    theme: "jaguar",
  },
  {
    slug: "nim-li-punit",
    name: "Nim Li Punit",
    category: "Full Day",
    duration: "Full Day · 6-8 hrs",
    shortDescription: "Discover the ancient Maya ruins of Nim Li Punit, known for its impressive stelae and panoramic views of the Toledo District.",
    image: "/images/themes/Tikal-1.jpg",
    theme: "mayan-ruins",
  },
  {
    slug: "tikal-mayan-ruins",
    name: "Tikal Mayan Ruins (Guatemala)",
    category: "Full Day",
    duration: "Full Day · 12 hrs",
    shortDescription: "Cross into Guatemala to explore Tikal, one of the greatest Maya cities ever built, with towering temples rising above the jungle canopy.",
    image: "/images/themes/tikal-national-park-from-guatemala.jpg",
    theme: "mayan-ruins",
  },

  // Half Day Tours
  {
    slug: "mayan-sky-zipline",
    name: "Mayan Sky Zipline",
    category: "Half Day",
    duration: "Half Day · 3-4 hrs",
    shortDescription: "Soar through the rainforest canopy on Belize's longest zipline course, flying between treetop platforms with breathtaking jungle views.",
    image: "/images/themes/Zip.jpg",
    theme: "zipline",
  },
  {
    slug: "mayan-sky-river-tubing",
    name: "Mayan Sky River Tubing",
    category: "Half Day",
    duration: "Half Day · 3-4 hrs",
    shortDescription: "Float peacefully along jungle rivers on inner tubes, drifting through lush rainforest and spotting wildlife along the banks.",
    image: "/images/zip_rivertube/r1.JPG",
    theme: "cave-tubing",
  },
  {
    slug: "mayan-sky-waterfall",
    name: "Mayan Sky Waterfall",
    category: "Half Day",
    duration: "Half Day · 3-4 hrs",
    shortDescription: "Hike through rainforest to discover hidden waterfalls, swimming in natural pools beneath cascading jungle waters.",
    image: "/images/zip_waterfall/w1.JPG",
    theme: "waterfall",
  },
  {
    slug: "bocawina-zipline",
    name: "Bocawina Zipline",
    category: "Half Day",
    duration: "Half Day · 3-4 hrs",
    shortDescription: "Fly through the rainforest canopy on Belize's longest zipline course, with thrilling descents and panoramic jungle views.",
    image: "/images/themes/Bocawina Zip Line.jpg",
    theme: "zipline",
  },
  {
    slug: "atv-mayan-king-waterfall",
    name: "ATV to Mayan King Waterfall",
    category: "Half Day",
    duration: "Half Day · 4-5 hrs",
    shortDescription: "Ride ATVs through jungle trails to the spectacular Mayan King Waterfall, then swim in its pristine natural pool.",
    image: "/images/themes/Copy of june 24-2.JPG",
    theme: "atv",
  },
  {
    slug: "mayan-king-waterfall",
    name: "Mayan King Waterfall",
    category: "Half Day",
    duration: "Half Day · 3-4 hrs",
    shortDescription: "Hike through lush rainforest to discover the magnificent Mayan King Waterfall, swimming in its refreshing emerald pool.",
    image: "/images/themes/mayanking-waterfall.jpg",
    theme: "waterfall",
  },
  {
    slug: "monkey-river-tour",
    name: "Monkey River Marine & Terrestrial Wildlife Tour",
    category: "Half Day",
    duration: "Half Day · 4-5 hrs",
    shortDescription: "Cruise up Monkey River spotting howler monkeys, crocodiles, and manatees, then hike through rainforest teeming with wildlife.",
    image: "/images/monkey_river/mon1.jpg",
    theme: "monkey-river",
  },
  {
    slug: "cheil-chocolate-making",
    name: "Chei'l Mayan Chocolate Making",
    category: "Half Day",
    duration: "Half Day · 3-4 hrs",
    shortDescription: "Learn ancient Maya chocolate-making traditions, from roasting cacao beans to grinding your own chocolate on traditional stone metates.",
    image: "/images/choco_making/choco.jpeg",
    theme: "chocolate",
  },
  {
    slug: "cockscomb-birdwatching",
    name: "Cockscomb/Bocawina Birdwatching",
    category: "Half Day",
    duration: "Half Day · 4-5 hrs",
    shortDescription: "Spot exotic birds in the Cockscomb Basin and Bocawina rainforests, from colorful toucans to rare trogons and hummingbirds.",
    image: "/images/cockscomb/cock1.jpeg",
    theme: "birdwatching",
  },
  {
    slug: "scarlet-macaw-watching",
    name: "Scarlet Macaw Birdwatching",
    category: "Half Day",
    duration: "Half Day · 4-5 hrs",
    shortDescription: "Witness the breathtaking beauty of endangered scarlet macaws in their natural habitat, one of Belize's most spectacular birding experiences.",
    image: "/images/scarlet_macaw/m2.jpg",
    theme: "macaw",
  },
  {
    slug: "horseback-riding",
    name: "Horseback Riding",
    category: "Half Day",
    duration: "Half Day · 3-4 hrs",
    shortDescription: "Ride through lush jungle trails and countryside on well-trained horses, experiencing Belize's natural beauty from the saddle.",
    image: "/images/horse_riding/h2.png",
    theme: "horseback",
  },
  {
    slug: "horseback-mayan-king",
    name: "Horseback Riding to Mayan King Waterfall",
    category: "Half Day",
    duration: "Half Day · 4-5 hrs",
    shortDescription: "Journey on horseback through rainforest trails to the stunning Mayan King Waterfall, then swim in its pristine natural pool.",
    image: "/images/horse_riding/h4.JPG",
    theme: "horseback",
  },
];

// Southern Tour Packages
const SOUTHERN_PACKAGES: Tour[] = [
  {
    slug: "southern-package-1",
    name: "Southern Package 1: Nim Li Punit + Chocolate + Spice Farm",
    category: "Full Day",
    duration: "Full Day · 8-10 hrs",
    shortDescription: "Explore Nim Li Punit ruins, learn traditional Maya chocolate making, and discover exotic spices at a local farm.",
    image: "/images/choco_making/c2.jpg",
    theme: "package",
  },
  {
    slug: "southern-package-2",
    name: "Southern Package 2: Nim Li Punit + Chocolate + Waterfall",
    category: "Full Day",
    duration: "Full Day · 8-10 hrs",
    shortDescription: "Visit Nim Li Punit ruins, make traditional Maya chocolate, and cool off at a beautiful jungle waterfall.",
    image: "/images/themes/mayanking-waterfall.jpg",
    theme: "package",
  },
  {
    slug: "southern-package-3",
    name: "Southern Package 3: Spice Farm + Chocolate + Waterfall",
    category: "Full Day",
    duration: "Full Day · 8-10 hrs",
    shortDescription: "Tour a spice farm, learn Maya chocolate making, and swim at a stunning jungle waterfall.",
    image: "/images/choco_making/choco.jpeg",
    theme: "package",
  },
  {
    slug: "southern-package-4",
    name: "Southern Package 4: Spice Farm + Nim Li Punit + Waterfall",
    category: "Full Day",
    duration: "Full Day · 8-10 hrs",
    shortDescription: "Explore a spice farm, visit Nim Li Punit ruins, and refresh at a beautiful waterfall.",
    image: "/images/themes/Tikal-1.jpg",
    theme: "package",
  },
];

// Combine all tours
const ALL_TOURS: Tour[] = [...INDIVIDUAL_TOURS, ...SOUTHERN_PACKAGES];

function routeMessage(route: Tour[], travelers: number, details: Record<string, string>) {
  const stops = route.map((tour, index) => `${index + 1}. ${tour.name}`).join("\n");
  return [
    "Custom route request — Wilder Belize Adventures",
    "",
    `Name: ${details.name || "Not provided"}`,
    `Email: ${details.email || "Not provided"}`,
    `Phone / WhatsApp: ${details.phone || "Not provided"}`,
    `Travelers: ${travelers}`,
    `Preferred date(s): ${details.date || "Not provided"}`,
    `Pickup location: ${details.pickup || "Not provided"}`,
    "",
    "Route:",
    stops,
    "",
    `Notes: ${details.notes || "None"}`,
  ].join("\n");
}

const CATEGORY_CONFIG: Record<string, { kicker: string; title: string; description: string }> = {
  "Full Day": {
    kicker: "Chapter 01",
    title: "Big days in wild Belize",
    description: "Maya cities, jungle rivers, waterfalls, and the long, memorable days that connect them.",
  },
  "Half Day": {
    kicker: "Chapter 02",
    title: "Quick escapes, lasting stories",
    description: "Make room for a little wild between beach mornings and sunset dinners in Placencia.",
  },
  "Multi-day": {
    kicker: "Ready-made",
    title: "Multi-day adventure packages",
    description: "Curated multi-stop journeys when you would rather let our local team handle the logistics.",
  },
};

// EmailJS configuration - replace with your actual values from EmailJS dashboard
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "your_service_id";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "your_template_id";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "your_public_key";
const RECIPIENT_EMAIL = process.env.NEXT_PUBLIC_RECIPIENT_EMAIL || "bookings@wilderbelize.com";

export function RouteBuilder() {
  const [route, setRoute] = useState<Tour[]>([]);
  const [travelers, setTravelers] = useState(3);
  const [formOpen, setFormOpen] = useState(false);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", date: "", pickup: "", notes: "" });
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle");

  function toggle(tour: Tour) {
    setRoute((current) =>
      current.some((item) => item.slug === tour.slug)
        ? current.filter((item) => item.slug !== tour.slug)
        : [...current, tour]
    );
  }

  function openRequest() {
    if (!route.length) {
      document.getElementById("route-adventures")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setFormOpen(true);
  }

  async function sendEmail() {
    if (!details.name || !details.email) {
      alert("Please fill in your name and email address.");
      return;
    }

    setIsSending(true);
    setSendStatus("idle");

    try {
      const stops = route.map((tour, index) => `${index + 1}. ${tour.name}`).join("\n");
      
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: RECIPIENT_EMAIL,
          from_name: details.name,
          from_email: details.email,
          name: details.name,
          email: details.email,
          user_name: details.name,
          user_email: details.email,
          phone: details.phone || "Not provided",
          travelers: travelers.toString(),
          preferred_dates: details.date || "Not provided",
          pickup_location: details.pickup || "Not provided",
          route_stops: stops,
          notes: details.notes || "None",
          message: `Stops:\n${stops}\nNotes: ${details.notes || "None"}`,
          reply_to: details.email,
        },
        EMAILJS_PUBLIC_KEY
      );

      setSendStatus("success");
      // Reset form after successful send
      setTimeout(() => {
        setFormOpen(false);
        setSendStatus("idle");
        setDetails({ name: "", email: "", phone: "", date: "", pickup: "", notes: "" });
        setRoute([]);
      }, 2000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setSendStatus("error");
    } finally {
      setIsSending(false);
    }
  }

  // Group tours by category
  const categories = ["Full Day", "Half Day", "Multi-day"] as const;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-jungle-950 pb-20 pt-36 text-white md:pb-24 md:pt-44">
        <div className="noise absolute inset-0" />
        <div className="absolute -right-24 top-8 h-80 w-80 rounded-full border border-lagoon-300/20" />
        <div className="absolute -right-8 top-24 h-56 w-56 rounded-full border border-gold-300/20" />
        <div className="container-page relative">
          <p className="kicker text-gold-300">Custom trip builder</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-5xl font-extrabold text-white md:text-7xl">
                Plot your own <span className="font-medium italic text-lagoon-200">route</span> through Belize.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
                Jungle rivers, sunken caves, Maya ruins, and the reef beyond — pick the stops that call to you and we&apos;ll
                stitch them into one seamless day, or a week. Every route below is yours to build.
              </p>
              <div className="hero-cta mt-8 flex flex-wrap gap-4">
                <a href="#route-adventures" className="btn btn-primary">
                  Start building <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="hero-stats mt-10 flex flex-wrap gap-x-12 gap-y-4 border-t border-white/15 pt-6">
                <div className="hero-stat">
                  <b className="block font-display text-2xl text-gold-300">{ALL_TOURS.length}+</b>
                  <span className="text-xs uppercase tracking-wide text-white/60">adventures</span>
                </div>
                <div className="hero-stat">
                  <b className="block font-display text-2xl text-gold-300">100%</b>
                  <span className="text-xs uppercase tracking-wide text-white/60">locally guided</span>
                </div>
                <div className="hero-stat">
                  <b className="block font-display text-2xl text-gold-300">1</b>
                  <span className="text-xs uppercase tracking-wide text-white/60">route, yours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Builder Section */}
      <main id="route-adventures" className="bg-sand-50">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-24">
          {/* Left Column - Tour Categories */}
          <div className="min-w-0 space-y-16">
            {categories.map((category) => {
              const groupTours = ALL_TOURS.filter((tour) => tour.category === category);
              const config = CATEGORY_CONFIG[category];
              return (
                <section key={category}>
                  <div className="section-head mb-6 max-w-2xl">
                    <p className="kicker text-coral-600">{config.kicker}</p>
                    <h2 className="mt-2 text-3xl text-ink md:text-4xl">{config.title}</h2>
                    <p className="mt-3 text-ink-soft">{config.description}</p>
                  </div>
                  <div className="card-grid grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {groupTours.map((tour) => {
                      const selected = route.some((item) => item.slug === tour.slug);
                      return (
                        <article
                          key={tour.slug}
                          onClick={() => toggle(tour)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggle(tour);
                            }
                          }}
                          className={cn(
                            "tour-card group cursor-pointer rounded-2xl border bg-white p-5 shadow-soft transition outline-none focus:ring-2 focus:ring-coral-500",
                            selected
                              ? "border-coral-500 ring-2 ring-coral-100 bg-coral-50/20"
                              : "border-ink/8 hover:-translate-y-1 hover:border-jungle-300"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="rounded-full bg-jungle-100 px-3 py-1 text-xs font-bold text-jungle-800">
                              {tour.duration}
                            </span>
                            {selected ? (
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-500 text-white shadow">
                                <Check className="h-4 w-4" />
                              </span>
                            ) : (
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink/40 transition group-hover:border-coral-500 group-hover:text-coral-500">
                                <Plus className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </div>
                          <h3 className="mt-4 text-lg font-bold text-ink transition-colors group-hover:text-coral-600">{tour.name}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                            {tour.shortDescription}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Sidebar - Route Panel */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="route-panel overflow-hidden rounded-3xl bg-jungle-950 p-6 text-white shadow-lift">
              <h3>Your Route</h3>
              <div className="sub" id="subCount">
                {route.length === 0
                  ? "NO STOPS ADDED YET"
                  : `${route.length} STOP${route.length > 1 ? "S" : ""} · ${travelers} TRAVELER${travelers > 1 ? "S" : ""}`}
              </div>
              <div className="trail mt-5 max-h-[38vh] space-y-4 overflow-y-auto pr-1" id="trail">
                {route.length === 0 ? (
                  <div className="trail-empty border-t border-dashed border-white/20 pt-5 text-sm font-bold leading-relaxed text-white/60">
                  Tap any excursion to start plotting your route through Belize. Your itinerary builds here as you go.
                </div>
                ) : (
                  route.map((tour, index) => (
                    <div key={tour.slug} className="stop relative pb-4 pl-6">
                      <div className="stop-num absolute left-0 top-0 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-300 text-[10px] font-bold text-jungle-950">
                        {index + 1}
                      </div>
                      <div className="stop-row flex items-start justify-between gap-2">
                        <div className="stop-name text-sm font-bold leading-snug text-white">{tour.name}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggle(tour)}
                        className="stop-remove mt-1 text-xs font-semibold text-white/50 hover:text-coral-300"
                      >
                        remove
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="route-total mt-4 border-t border-white/15 pt-4">
                <div className="travelers-row flex items-center justify-between text-sm text-white/70">
                  <span>Travelers</span>
                  <div className="stepper flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTravelers((count) => Math.max(3, count - 1))}
                      aria-label="Fewer travelers"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/30 hover:bg-white/10"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center font-bold text-white">{travelers}</span>
                    <button
                      type="button"
                      onClick={() => setTravelers((count) => Math.min(20, count + 1))}
                      aria-label="More travelers"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/30 hover:bg-white/10"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openRequest}
                  disabled={route.length === 0}
                  className="checkout-btn btn btn-primary mt-5 w-full"
                >
                  Reserve this route <ArrowRight className="h-4 w-4" />
                </button>
                <p className="panel-note mt-3 text-center text-xs leading-relaxed text-white/45">
                  Build your own route by mixing and matching excursions. We&apos;ll confirm availability and details once
                  you submit your request.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="mobile-bar fixed bottom-0 left-0 right-0 z-50 hidden items-center justify-between border-t border-white/10 bg-jungle-950 px-5 py-3 text-white shadow-lg">
        <div>
          <div className="lbl mono text-xs text-white/60">
            {route.length} stop{route.length !== 1 ? "s" : ""} selected
          </div>
        </div>
        <button
          type="button"
          onClick={openRequest}
          className="mobile-open-btn rounded-full bg-coral-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-700"
        >
          Review route
        </button>
      </div>

      {/* Modal Form */}
      {formOpen && (
        <div
          className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="route-request-title"
        >
          <button
            type="button"
            aria-label="Close route request"
            onClick={() => setFormOpen(false)}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />
          <div className="modal relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-sand-50 p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              aria-label="Close"
              className="absolute right-5 top-5 rounded-xl p-2 text-ink-soft hover:bg-sand-100"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="kicker text-coral-600">One last step</p>
            <h2 id="route-request-title" className="mt-2 text-3xl text-ink">
              Reserve your route
            </h2>
            <p className="lead mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
              Send us your details — we&apos;ll confirm availability and dates, then follow up with a secure payment link.
            </p>

            <div className="modal-summary mt-6 rounded-2xl bg-jungle-50 p-4 text-sm">
              <div className="modal-summary-row flex justify-between font-bold text-jungle-900">
                <span>
                  {route.length} selected {route.length === 1 ? "adventure" : "adventures"}
                </span>
              </div>
              <p className="mt-1 text-jungle-800/70">
                for {travelers} {travelers === 1 ? "traveler" : "travelers"}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", "Full name", "Jane Traveler", "text"],
                  ["email", "Email", "you@email.com", "email"],
                  ["phone", "Phone / WhatsApp", "+1 555 123 4567", "tel"],
                  ["date", "Preferred date(s)", "", "date"],
                  ["pickup", "Hotel / pickup location", "Resort, Airbnb, etc.", "text"],
                ] as const
              ).map(([key, label, placeholder, type]) => (
                <label
                  key={key}
                  className={cn("field text-sm font-bold text-ink", key === "pickup" && "sm:col-span-2")}
                >
                  {label}
                  <input
                    type={type}
                    value={details[key]}
                    onChange={(event) =>
                      setDetails((current) => ({ ...current, [key]: event.target.value }))
                    }
                    placeholder={placeholder}
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 font-normal outline-none focus:border-jungle-500 focus:ring-2 focus:ring-jungle-500/20"
                  />
                </label>
              ))}
              <label className="field text-sm font-bold text-ink sm:col-span-2">
                Anything else we should know?
                <textarea
                  value={details.notes}
                  onChange={(event) => setDetails((current) => ({ ...current, notes: event.target.value }))}
                  placeholder="Pickup location, dietary needs, extra dates, or special requests"
                  className="mt-1.5 min-h-24 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 font-normal outline-none focus:border-jungle-500 focus:ring-2 focus:ring-jungle-500/20"
                />
              </label>
            </div>
            <div className="modal-actions mt-6 grid gap-3">
              {sendStatus === "success" ? (
                <div className="flex items-center justify-center gap-2 rounded-full bg-green-500 py-3 text-sm font-semibold text-white">
                  <Check className="h-4 w-4" /> Request sent successfully!
                </div>
              ) : sendStatus === "error" ? (
                <div className="grid gap-2">
                  <div className="flex items-center justify-center gap-2 rounded-full bg-red-500 py-3 text-sm font-semibold text-white">
                    <X className="h-4 w-4" /> Failed to send. Please try again.
                  </div>
                  <button
                    type="button"
                    onClick={sendEmail}
                    disabled={isSending}
                    className="btn-email flex items-center justify-center gap-2 rounded-full border-2 border-jungle-700 py-3 text-sm font-semibold text-jungle-800 hover:bg-jungle-50 disabled:opacity-50"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" /> Retry Send via Email
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={sendEmail}
                  disabled={isSending}
                  className="btn-email flex items-center justify-center gap-2 rounded-full border-2 border-jungle-700 py-3 text-sm font-semibold text-jungle-800 hover:bg-jungle-50 disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" /> Send via Email
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
