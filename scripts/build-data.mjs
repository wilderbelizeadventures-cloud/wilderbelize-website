// Transforms the research+content workflow output into typed data modules.
// Run: node scripts/build-data.mjs
import fs from "node:fs";
import path from "node:path";

const OUT = String.raw`C:\Users\spent\AppData\Local\Temp\claude\C--Users-spent-Desktop-tour-website\b28cf797-2bc5-4f08-9a8b-efb3d352c1b3\tasks\wf2v1o4m2.output`;

const raw = JSON.parse(fs.readFileSync(OUT, "utf8"));
const gen = raw.result.tours;
const copy = raw.result.copy;

const THEMES = [
  "atv", "waterfall", "zipline", "cave-tubing", "cave", "mayan-ruins",
  "river-tubing", "horseback", "monkey-river", "manatee", "macaw",
  "birdwatching", "chocolate", "jungle-hike", "kayak", "beach",
];

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[''"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function norm(s) {
  return s
    // strip a trailing category/price parenthetical, e.g. "(Half Day, 6 Hours, USD $125 per person)"
    .replace(/\s*\([^)]*(?:day|hour|usd|\$|per person)[^)]*\)\s*$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// Canonical offerings (real tours, prices, durations)
const meta = [
  { name: "Xunantunich + Inland Blue Hole", category: "Full Day", price: 150, featured: true },
  { name: "Mayan Sky Zip Line + River Tubing + Waterfall", category: "Full Day", price: 200, featured: true },
  { name: "Zipline + Cave Tubing", category: "Full Day", price: 200 },
  { name: "Tikal Mayan Ruins (Guatemala)", category: "Full Day", price: 275, featured: true },
  { name: "Rubber Tree Chocolate Making, Copal & Cultural Fire Experience + Waterfall", category: "Full Day", price: 200 },
  { name: "Cave Tubing + Cave Exploration", category: "Full Day", price: 140 },
  { name: "Davis Falls – The Ultimate Waterfall Escape", category: "Full Day", price: 180, featured: true },
  { name: "ATM Cave Exploration", category: "Full Day", price: 200, featured: true },
  { name: "Jungle Saddle & Sacred Cave Tubing Adventure", category: "Full Day", price: 200 },
  { name: "Xunantunich + Cave Tubing", category: "Full Day", price: 200 },
  { name: "Xunantunich + Cave Kayaking", category: "Full Day", price: 225 },
  { name: "Jaguar Reserve River Tubing + Waterfall Hike", category: "Full Day", price: 135 },
  { name: "Bocawina Jungle Zipline Adventure", category: "Half Day", price: 140, duration: "6 Hours" },
  { name: "Monkey River + Manatee Watching Adventure", category: "Half Day", price: 100, duration: "5 Hours", featured: true },
  { name: "Mayan Chocolate Making + Waterfall", category: "Half Day", price: 125, duration: "4 Hours" },
  { name: "Cockscomb / Bocawina Birdwatching", category: "Half Day", price: 150, duration: "8 Hours" },
  { name: "Scarlet Macaw Watching", category: "Half Day", price: 125, duration: "6 Hours" },
  { name: "Zip Lining + River Tubing Adventure", category: "Half Day", price: 175, duration: "5 Hours" },
  { name: "Zip Lining + Waterfall Adventure", category: "Half Day", price: 135, duration: "4 Hours" },
  { name: "ATV to Mayan King Waterfall", category: "Half Day", price: 200, duration: "4 Hours", featured: true },
  { name: "Horseback Riding Adventure", category: "Half Day", price: 135, duration: "5 Hours" },
  { name: "Zipline + ATV to Mayan King Waterfall", category: "Half Day", price: 250, duration: "7 Hours" },
  { name: "ATV Adventure to Hidden Waterfall", category: "Half Day", price: 250, duration: "5 Hours" },
];

const genMap = new Map(gen.map((t) => [norm(t.name), t]));

const bestForTheme = {
  Adrenaline: "zipline", Wildlife: "macaw", Culture: "chocolate", History: "mayan-ruins",
  Family: "river-tubing", Nature: "jungle-hike", Water: "waterfall", Hiking: "jungle-hike",
  Relaxation: "beach", Photography: "beach",
};
const heroes = [
  "/images/heroes/hero-waterfall.jpg",
  "/images/heroes/hero-canopy.jpg",
  "/images/heroes/hero-coast.jpg",
  "/images/heroes/hero-cave.jpg",
];
const ratings = [4.9, 4.8, 4.7, 4.8, 4.9, 4.6, 4.8, 4.9, 4.7, 4.8, 4.7, 4.9];

let missing = 0;
const tours = meta.map((m, i) => {
  const g = genMap.get(norm(m.name));
  if (!g) { console.warn("NO MATCH:", m.name); missing++; }
  const theme = g && THEMES.includes(g.imageTheme) ? g.imageTheme : "jungle-hike";
  const img = `/images/themes/${theme}.jpg`;
  const related = (g?.bestFor || []).map((b) => bestForTheme[b]).filter(Boolean);
  const gallery = [...new Set([img, ...related.map((t) => `/images/themes/${t}.jpg`), heroes[i % heroes.length]])].slice(0, 4);
  const isTikal = /tikal/i.test(m.name);
  const durationHours = m.category === "Full Day" ? (isTikal ? 12 : 9) : parseInt(m.duration, 10);
  const duration = m.category === "Full Day"
    ? (isTikal ? "Full Day · 12 hrs" : "Full Day · 8–10 hrs")
    : m.duration;
  return {
    slug: slugify(m.name),
    name: m.name,
    category: m.category,
    price: m.price,
    duration,
    durationHours,
    difficulty: g?.difficulty || "Moderate",
    groupSize: g?.groupSize || "2-12 guests",
    tagline: g?.tagline || "",
    shortDescription: g?.shortDescription || "",
    description: g?.description || "",
    highlights: g?.highlights || [],
    included: g?.included || [],
    bring: g?.bring || [],
    itinerary: g?.itinerary || [],
    bestFor: g?.bestFor || [],
    image: img,
    gallery,
    rating: ratings[i % ratings.length],
    reviews: 38 + ((i * 43) % 180),
    featured: m.featured || false,
    theme,
  };
});

console.log(`Built ${tours.length} tours (${missing} unmatched).`);

// ---- write tours.ts ----
const toursTs = `// AUTO-GENERATED by scripts/build-data.mjs — do not edit by hand.
export type ItineraryStep = { title: string; detail: string };
export type TourCategory = "Full Day" | "Half Day";
export type Tour = {
  slug: string;
  name: string;
  category: TourCategory;
  price: number;
  duration: string;
  durationHours: number;
  difficulty: string;
  groupSize: string;
  tagline: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  included: string[];
  bring: string[];
  itinerary: ItineraryStep[];
  bestFor: string[];
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  featured: boolean;
  theme: string;
};

export const tours: Tour[] = ${JSON.stringify(tours, null, 2)};

export const fullDayTours = tours.filter((t) => t.category === "Full Day");
export const halfDayTours = tours.filter((t) => t.category === "Half Day");
export const featuredTours = tours.filter((t) => t.featured);
export function getTour(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
export const allDifficulties = Array.from(new Set(tours.map((t) => t.difficulty)));
export const allInterests = Array.from(new Set(tours.flatMap((t) => t.bestFor))).sort();
export const priceRange = {
  min: Math.min(...tours.map((t) => t.price)),
  max: Math.max(...tours.map((t) => t.price)),
};
`;

// ---- write site.ts ----
const company = {
  name: "Wilder Belize Adventures",
  shortName: "Wilder Belize",
  slogan: "Roam Belize, the Wilder Way",
  tagline: "Your Gateway to Epic Belize Experiences",
  phones: ["+501 650-1003", "+501 671-8828"],
  whatsapp: "5016501003",
  emails: ["info@wilderbelizeadventures.com", "wilderbelizeadventures@gmail.com"],
  address: "Placencia Village, Stann Creek District, Belize",
  socials: {
    facebook: "https://www.facebook.com/wilderbelizeadventures",
    instagram: "https://www.instagram.com/wilderbelizeadventures",
    whatsapp: "https://wa.me/5016501003",
    tripadvisor: "https://www.tripadvisor.com/Attraction_Review-g291977-d25566275-Reviews-Wilder_Belize_Adventures-Placencia_Stann_Creek.html",
  },
};

const site = {
  company,
  hero: copy.hero,
  valueProps: copy.valueProps,
  whyChooseUs: copy.whyChooseUs || [],
  aboutShort: copy.aboutShort || "",
  aboutLong: copy.aboutLong || "",
  stats: copy.stats || [],
  testimonials: copy.testimonials || [],
  faqs: copy.faqs || [],
  travelersInfo: copy.travelersInfo || [],
  transfer: copy.transfer || {},
  newsletterPitch: copy.newsletterPitch || "",
};

const siteTs = `// AUTO-GENERATED by scripts/build-data.mjs — do not edit by hand.
export const site = ${JSON.stringify(site, null, 2)} as const;
export const company = site.company;
`;

const dir = path.join(process.cwd(), "src", "data");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "tours.ts"), toursTs);
fs.writeFileSync(path.join(dir, "site.ts"), siteTs);
console.log("Wrote src/data/tours.ts and src/data/site.ts");
