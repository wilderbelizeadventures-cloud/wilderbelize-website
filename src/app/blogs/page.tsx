import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Compass, BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogs";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Blog & Travel Guides | Wilder Belize Adventures",
  description:
    "Expert travel guides, local insights, eco-tourism tips, and real stories from licensed tour guides born and raised in Placencia, Belize.",
  alternates: {
    canonical: "https://www.wilderbelizeadventures.com/blogs",
  },
  openGraph: {
    title: "Blog & Travel Guides | Wilder Belize Adventures",
    description:
      "Expert travel guides, local insights, eco-tourism tips, and real stories from licensed tour guides born and raised in Placencia, Belize.",
    type: "website",
    images: [{ url: BLOG_POSTS[0].coverImage, alt: "Wilder Belize Adventures Blog" }],
  },
};

export default function BlogsPage() {
  const featuredPost = BLOG_POSTS[0];

  return (
    <main className="min-h-screen bg-sand-50 pb-24 pt-28 md:pt-36">
      {/* Hero Section */}
      <section className="container-page">
        <Reveal>
          <div className="max-w-3xl">
            <span className="kicker text-coral-600">Local Knowledge & Real Stories</span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
              The Belize Adventure Journal
            </h1>
            <p className="mt-4 text-lg text-ink-soft leading-relaxed">
              Straightforward guidance, safety tips, cultural deep-dives, and conservation-first travel advice from our licensed guides born and raised in Belize.
            </p>
          </div>
        </Reveal>

        {/* Featured Post Hero Card */}
        {featuredPost && (
          <Reveal className="mt-10">
            <article className="group relative overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-ink/5 transition-all duration-300 hover:shadow-2xl">
              <div className="grid lg:grid-cols-12 items-stretch">
                {/* Image */}
                <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 bg-sand-200 overflow-hidden">
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.coverImageAlt}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                    <span className="rounded-full bg-jungle-800/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                      Featured Guide
                    </span>
                    <span className="rounded-full bg-coral-500/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-ink-faint">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-coral-500" />
                        {featuredPost.publishedAt}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-lagoon-500" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl leading-snug group-hover:text-jungle-700 transition-colors">
                      <Link href={`/blogs/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-soft">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-ink/10 pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-jungle-500 bg-sand-200">
                        <Image
                          src={featuredPost.author.avatar || "/belize_new_logo.png"}
                          alt={featuredPost.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold text-ink">{featuredPost.author.name}</p>
                        <p className="text-[0.7rem] text-ink-faint">{featuredPost.author.role}</p>
                      </div>
                    </div>

                    <Link
                      href={`/blogs/${featuredPost.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-jungle-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-jungle-700 hover:shadow-soft"
                    >
                      Read Guide <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        )}

        {/* Categories / Local Highlights Section */}
        <section className="mt-16 sm:mt-20">
          <Reveal>
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-ink">Explore by Topic</h3>
                <p className="text-sm text-ink-soft mt-1">What to know before you touch down in Belize</p>
              </div>
              <Compass className="h-6 w-6 text-coral-500" />
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Category Card 1 */}
              <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jungle-100 text-jungle-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-display text-lg font-bold text-ink">Licensing & Safety</h4>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  Understand BTB regulations, insurance standards, wilderness first-aid, and safety checklists for cave and canopy tours.
                </p>
                <Link
                  href={`/blogs/${featuredPost.slug}#licensing`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-coral-600 hover:text-coral-700"
                >
                  Read License Guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Category Card 2 */}
              <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-100 text-coral-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-display text-lg font-bold text-ink">Maya Heritage & Food</h4>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  Deep dive into authentic organic cacao farming, stone grinding metates, and supporting village-owned enterprises.
                </p>
                <Link
                  href={`/blogs/${featuredPost.slug}#cacao`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-coral-600 hover:text-coral-700"
                >
                  Learn About Local Impact <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Category Card 3 */}
              <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lagoon-100 text-lagoon-700">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-display text-lg font-bold text-ink">Wildlife & Conservation</h4>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  Why no-handling wildlife rules matter, spotting Scarlet Macaws respectfully, and keeping Belize wild.
                </p>
                <Link
                  href={`/blogs/${featuredPost.slug}#wildlife`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-coral-600 hover:text-coral-700"
                >
                  View Wildlife Rules <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Call to action card */}
        <section className="mt-16 sm:mt-20">
          <Reveal>
            <div className="rounded-3xl bg-gradient-to-br from-jungle-800 to-jungle-950 p-8 sm:p-12 text-white shadow-lift text-center">
              <span className="kicker justify-center text-coral-300">Got Questions About Your Itinerary?</span>
              <h3 className="mt-2 font-display text-2xl sm:text-4xl font-extrabold text-white">
                Talk Directly With a Licensed Belizean Guide
              </h3>
              <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed">
                Whether you need advice on seasonal weather, tour difficulty, or airport transfers from Placencia, Wilder Belize Adventures is here to help.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="btn btn-primary">
                  Ask a Question
                </Link>
                <Link href="/tours" className="btn btn-secondary">
                  Explore Tours & Adventures
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </section>
    </main>
  );
}
