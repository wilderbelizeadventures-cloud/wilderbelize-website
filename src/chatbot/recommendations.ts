import { tours, Tour } from "@/data/tours";

export function recommendTours(query: string): Tour[] {
  const text = query.toLowerCase();

  const scored = tours.map((tour) => {
    let score = 0;

    // Category
    if (text.includes("half day") && tour.category === "Half Day")
      score += 10;

    if (text.includes("full day") && tour.category === "Full Day")
      score += 10;

    if (text.includes("multi day") && tour.category === "Multi-day")
      score += 10;

    // Best For
    tour.bestFor.forEach((item) => {
      if (text.includes(item.toLowerCase())) {
        score += 8;
      }
    });

    // Theme
    if (text.includes(tour.theme.toLowerCase())) {
      score += 8;
    }

    // Exact Tour Name
    if (text.includes(tour.name.toLowerCase())) {
      score += 20;
    }

    // Highlights
    tour.highlights.forEach((highlight) => {
      const lower = highlight.toLowerCase();

      if (text.includes("waterfall") && lower.includes("waterfall"))
        score += 6;

      if (text.includes("zip") && lower.includes("zip"))
        score += 6;

      if (text.includes("cave") && lower.includes("cave"))
        score += 6;

      if (text.includes("river") && lower.includes("river"))
        score += 6;

      if (text.includes("maya") && lower.includes("maya"))
        score += 6;
    });

    // Difficulty
    if (
      text.includes("easy") &&
      tour.difficulty.toLowerCase().includes("easy")
    )
      score += 4;

    if (
      text.includes("challenging") &&
      tour.difficulty.toLowerCase().includes("challenging")
    )
      score += 4;

    return { tour, score };
  });

  // Require a meaningful match before recommending
  return scored
    .filter((item) => item.score >= 6)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.tour);
}