const WORDS = [
  "Jungle Waterfalls",
  "ATV Trails",
  "Cave Tubing",
  "Maya Temples",
  "Zip Lining",
  "Scarlet Macaws",
  "Howler Monkeys",
  "Snorkel the Reef",
  "Cacao & Chocolate",
  "Jaguar Reserve",
];

export function Marquee() {
  return (
    <div className="group relative flex overflow-hidden border-y border-jungle-800/40 bg-jungle-900 py-5 text-white">
      <div className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]">
        {[...WORDS, ...WORDS].map((w, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6 font-display text-xl font-bold tracking-tight text-white/90 md:text-2xl">{w}</span>
            <span className="text-coral-400">✦</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-jungle-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-jungle-900 to-transparent" />
    </div>
  );
}
