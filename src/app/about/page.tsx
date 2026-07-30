import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { SmartImage } from "@/components/SmartImage";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { site } from "@/data/site";
import { HERO_IMAGES, MISC_IMAGES, THEMES_IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description: site.aboutShort,
};

export default function AboutPage() {
  const paragraphs = site.aboutLong.split("\n\n");
  return (
    <>
      <PageHero
        image={HERO_IMAGES.canopy}
        theme="jungle-hike"
        kicker="Who we are?"
        title="Belizean owned, locally operated tour company"
        subtitle={site.aboutShort}
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Story */}
      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-lift">
                <SmartImage src={THEMES_IMAGES.cave} alt="Placencia village waterfront, Belize" theme="beach" className="aspect-[4/5]" sizes="(max-width:1024px) 100vw, 50vw" />
              </div>
              <div className="absolute -bottom-5 -right-4 rounded-2xl bg-coral-500 px-6 py-5 text-white shadow-glow">
                <div className="font-display text-3xl font-extrabold">4.9★</div>
                <div className="text-xs font-semibold uppercase tracking-wider">Traveler rating</div>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <SectionHeading kicker="The Wilder way" title="Real Belize, shown by real Belizeans" />
            <div className="mt-5 space-y-4 leading-relaxed text-ink-soft">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <Link href="/tours" className="btn btn-jungle mt-7">Explore our tours <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <SectionHeading align="center" kicker="What we stand for" title="Why Travelers Trust Wilder Belize Adventures" />
          </Reveal>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-2">
            {site.whyChooseUs.map((w, i) => (
              <StaggerItem key={w.title}>
                <div className="flex h-full gap-5 rounded-3xl bg-white p-7 shadow-soft ring-1 ring-ink/5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-jungle-600 text-white">
                    <Check className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">{w.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{w.detail}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Stagger className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {site.valueProps.map((vp) => (
              <StaggerItem key={vp.title}>
                <div className="flex h-full flex-col rounded-3xl bg-sand-100 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-coral-500 shadow-sm">
                    <Icon name={vp.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink">{vp.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-soft">{vp.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
