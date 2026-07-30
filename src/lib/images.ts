// Hero imagery and theme-based gradient fallbacks.
export const HERO_IMAGES = {
  waterfall: "/images/heroes/hero-waterfall.jpg",
  canopy: "/images/zip_waterfall/w2.JPG",
  boating:"/images/7-DAY-2.avif",
  coast: "/images/monkey_river/turtle.jpg",
  cave: "/images/heroes/hero-cave.jpg",
} as const;

export const THEMES_IMAGES = {
  cave: "/images/themes/belize-cave-tubing-6.jpg",
} as const;

export const MISC_IMAGES = {
  about: "/images/zip_waterfall/w2.JPG",
  placencia: "/images/misc/placencia.jpg",
  jungle: "/images/misc/jungle-texture.jpg",
  snorkel: "/images/misc/snorkel.jpg",
} as const;

// Full literal gradient class pairs per theme — written out so Tailwind detects them.
export const themeGradient: Record<string, string> = {
  atv: "from-coral-500 to-jungle-800",
  waterfall: "from-lagoon-500 to-jungle-800",
  zipline: "from-jungle-500 to-lagoon-700",
  "cave-tubing": "from-lagoon-600 to-jungle-900",
  cave: "from-jungle-900 to-ink",
  "mayan-ruins": "from-gold-500 to-jungle-800",
  "river-tubing": "from-lagoon-400 to-jungle-700",
  horseback: "from-coral-400 to-jungle-700",
  "monkey-river": "from-jungle-500 to-lagoon-700",
  manatee: "from-lagoon-400 to-lagoon-700",
  macaw: "from-coral-500 to-jungle-800",
  birdwatching: "from-gold-400 to-jungle-700",
  chocolate: "from-coral-700 to-jungle-900",
  "jungle-hike": "from-jungle-500 to-jungle-900",
  kayak: "from-lagoon-400 to-jungle-700",
  beach: "from-lagoon-300 to-lagoon-600",
};

export function gradientFor(theme: string) {
  return themeGradient[theme] ?? "from-jungle-600 to-lagoon-600";
}
