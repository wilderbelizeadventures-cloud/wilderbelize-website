import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ToursExplorer } from "@/components/tours/ToursExplorer";
import { tours } from "@/data/tours";
import { HERO_IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "All Tours & Excursions",
  description:
    "Browse all Wilder Belize Adventures tours — ATV jungle rides, cave tubing, waterfalls, zip lining, Maya ruins, wildlife and more. Filter by category, difficulty, interest and price.",
};

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; interest?: string }>;
}) {
  const sp = await searchParams;

  return (
    <>
      <PageHero
        image={HERO_IMAGES.waterfall}
        theme="waterfall"
        kicker={`${tours.length} adventures · 1 epic country`}
        title="Find your Belize adventure"
        subtitle="Jungle, caves, waterfalls, Maya temples and the Caribbean — filter to the trip that fits your crew."
        crumbs={[{ label: "Home", href: "/" }, { label: "Tours" }]}
      />
      <ToursExplorer initialCategory={sp.category} initialInterest={sp.interest} />
    </>
  );
}
