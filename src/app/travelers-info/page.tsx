import type { Metadata } from "next";
import Link from "next/link";
import { Plane, CalendarDays, Backpack, ShieldCheck, Wallet, CalendarCheck, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { site } from "@/data/site";
import { HERO_IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Travelers Information",
  description:
    "Everything you need to plan your Belize trip with Wilder Belize Adventures — getting to Placencia, best time to visit, what to pack, health & safety, currency and booking.",
};

const ICONS = [Plane, CalendarDays, Backpack, ShieldCheck, Wallet, CalendarCheck];

export default function TravelersInfoPage() {
  return (
    <>
      <PageHero
        image={HERO_IMAGES.coast}
        theme="beach"
        kicker="Plan with confidence"
        title="Travelers information"
        subtitle="Practical know-how to make your Belize adventure smooth from the moment you land."
        crumbs={[{ label: "Home", href: "/" }, { label: "Travelers Info" }]}
      />

      <section className="section">
        <div className="container-page">
          <Stagger className="grid gap-6 md:grid-cols-2">
            {site.travelersInfo.map((info, i) => {
              const Ico = ICONS[i % ICONS.length];
              return (
                <StaggerItem key={info.title}>
                  <div className="flex h-full gap-5 rounded-3xl bg-white p-7 shadow-soft ring-1 ring-ink/5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-jungle-600 to-lagoon-500 text-white">
                      <Ico className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink">{info.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{info.body}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          <Reveal className="mt-12">
            <div className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-jungle-950 p-8 text-center text-white md:flex-row md:text-left">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Still have questions?</h2>
                <p className="mt-1 text-white/75">Our team in Placencia is happy to help you plan the perfect trip.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="btn btn-primary">Contact us <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/tours" className="btn btn-ghost border-white/30 text-white hover:bg-white hover:text-ink">Browse tours</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
