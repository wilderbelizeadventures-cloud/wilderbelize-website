import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Leaf, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Sparkles,
  Share2
} from "lucide-react";
import { BLOG_POSTS, getBlogPost } from "@/data/blogs";
import { Reveal } from "@/components/Reveal";
import { company } from "@/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog Post Not Found" };

  return {
    title: `${post.title} | Wilder Belize Adventures`,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.wilderbelizeadventures.com/blogs/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage, alt: post.coverImageAlt }],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: [`https://www.wilderbelizeadventures.com${post.coverImage}`],
      datePublished: "2026-10-16",
      author: {
        "@type": "Person",
        name: post.author.name,
        jobTitle: post.author.role,
      },
      publisher: {
        "@type": "TravelAgency",
        name: "Wilder Belize Adventures",
        logo: {
          "@type": "ImageObject",
          url: "https://www.wilderbelizeadventures.com/belize_new_logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://www.wilderbelizeadventures.com/blogs/${post.slug}`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.wilderbelizeadventures.com/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.wilderbelizeadventures.com/blogs" },
        { "@type": "ListItem", position: 3, name: post.title, item: `https://www.wilderbelizeadventures.com/blogs/${post.slug}` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="min-h-screen bg-sand-50 pb-20 pt-28 md:pt-36">
      {/* Breadcrumb & Navigation */}
      <div className="container-page mb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-soft shadow-soft ring-1 ring-ink/5 transition hover:bg-jungle-50 hover:text-jungle-700"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to all guides & stories
          </Link>
          <span className="rounded-full bg-jungle-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-jungle-800">
            {post.category}
          </span>
        </div>
      </div>

      {/* Header Container */}
      <header className="container-page max-w-4xl">
        <Reveal>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.18]">
            {post.title}
          </h1>
          <p className="mt-4 text-lg font-medium text-ink-soft md:text-xl">
            {post.subtitle}
          </p>

          {/* Author & Meta bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-ink/10 py-4 text-sm text-ink-soft">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-jungle-500 bg-sand-200 shadow-sm">
                <Image
                  src={post.author.avatar || "/belize_new_logo.png"}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-display font-bold text-ink">By {post.author.name}</p>
                <p className="text-xs text-ink-faint">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-5 text-xs font-medium text-ink-faint sm:text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-coral-500" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-lagoon-500" />
                {post.readTime}
              </span>
            </div>
          </div>
        </Reveal>
      </header>

      {/* Main Content Body */}
      <div className="container-page max-w-4xl mt-8">
        {/* Intro Highlight */}
        <Reveal>
          <div className="rounded-2xl border-l-4 border-coral-500 bg-coral-50/60 p-6 sm:p-8 text-ink-soft">
            <p className="text-base sm:text-lg leading-relaxed font-serif italic text-ink">
              &ldquo;Every week someone messages me the same thing: <strong className="font-semibold text-coral-700 font-sans not-italic">&lsquo;I found a tour for half the price. Is it the same?&rsquo;</strong>&rdquo;
            </p>
            <p className="mt-4 leading-relaxed">
              Sometimes it is. Often it isn&apos;t. And in Belize, the difference between a great day and a dangerous one, or between a trip that supports local families and one that quietly harms the places you came to see, usually comes down to one decision: <strong>who you book with</strong>.
            </p>
            <p className="mt-3 leading-relaxed">
              We were born here, we&apos;ve guided here, and We run a company here. So let me tell you what I&apos;d check if I were a visitor booking from overseas.
            </p>
          </div>
        </Reveal>

        {/* Featured Photo 1: Scarlet Macaw */}
        <Reveal className="my-10">
          <figure className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5">
            <div className="relative aspect-[16/10] w-full bg-sand-200">
              <Image
                src="/images/blogimages/WhatsApp Image 2026-10-16 at 13.32.56.jpeg"
                alt="Scarlet macaws in flight over Belize rainforest"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
            <figcaption className="p-4 text-center text-xs sm:text-sm italic text-ink-soft bg-sand-50 border-t border-ink/5">
              Scarlet macaws in flight. Seeing wildlife like this is a privilege, not a guarantee, and good operators never chase it. <span className="font-semibold text-ink-faint">(Photo: Celso Sho)</span>
            </figcaption>
          </figure>
        </Reveal>

        {/* Section 1: Start with the license */}
        <section className="my-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jungle-600 text-white font-display font-black text-lg">
                1
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                Start with the license. Always.
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                In Belize, tour operators and tour guides are regulated through the <strong>Belize Tourism Board (BTB)</strong>. A legitimate operator holds a valid operating license, and the guides leading you hold their own tour guide licenses. This isn&apos;t paperwork for its own sake. Licensing is tied to training, first aid, safety standards and insurance.
              </p>
            </div>

            {/* Questions to ask box */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-jungle-500/20 border-l-4 border-jungle-600">
              <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-jungle-800">
                <ShieldCheck className="h-5 w-5 text-jungle-600" />
                So ask, plainly:
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-ink font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-coral-600 font-bold">&bull;</span>
                  <span>&ldquo;Are you licensed by the Belize Tourism Board? Can I see your license number?&rdquo;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-coral-600 font-bold">&bull;</span>
                  <span>&ldquo;Is my guide a licensed tour guide?&rdquo;</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-coral-600 font-bold">&bull;</span>
                  <span>&ldquo;What insurance covers me on this activity?&rdquo;</span>
                </li>
              </ul>
              <p className="mt-4 text-xs sm:text-sm text-ink-soft italic border-t border-ink/5 pt-3">
                A real operator answers in seconds and is happy you asked. If you get vague answers, a changed subject, or &ldquo;don&apos;t worry, we know everyone,&rdquo; keep scrolling.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Section 2: Safety isn't a vibe. It's a system. */}
        <section className="my-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jungle-600 text-white font-display font-black text-lg">
                2
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                Safety isn&apos;t a vibe. It&apos;s a system.
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                Belize is wild, and that&apos;s the point. Waterfalls, caves, jungle trails, rivers. But adventure and recklessness are not the same thing.
              </p>
              <p>
                When I take guests rappelling down a waterfall, ziplining over the canopy, or out on ATVs, there is a briefing, properly maintained gear, helmets that fit, and a guide who stops the activity if conditions change. Rain changes everything in the jungle, and a good guide will cancel before a guest has to ask.
              </p>
            </div>
          </Reveal>

          {/* Waterfall rappelling photo */}
          <Reveal className="my-8">
            <figure className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5">
              <div className="relative aspect-[16/10] w-full bg-sand-200">
                <Image
                  src="/images/zip_waterfall/Copy of Copy of Screenshot_20241112-154929~3.png"
                  alt="Waterfall rappelling in Belize rainforest"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
              <figcaption className="p-4 text-center text-xs sm:text-sm italic text-ink-soft bg-sand-50 border-t border-ink/5">
                Rappelling a waterfall: thrilling because it&apos;s controlled. Ropes, helmets and trained guides are non-negotiable.
              </figcaption>
            </figure>
          </Reveal>

          {/* Signs of safety checklist */}
          <Reveal>
            <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink/5">
              <h3 className="font-display text-base font-bold text-ink">
                Look for these signs:
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl bg-sand-50 p-3.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-jungle-600 mt-0.5" />
                  <span className="text-sm font-medium text-ink">A safety briefing before every activity, not just a &ldquo;hold on tight.&rdquo;</span>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-sand-50 p-3.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-jungle-600 mt-0.5" />
                  <span className="text-sm font-medium text-ink">Helmets and harnesses that are clean, fitted and checked in front of you.</span>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-sand-50 p-3.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-jungle-600 mt-0.5" />
                  <span className="text-sm font-medium text-ink">Small guide-to-guest ratios on riskier activities.</span>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-sand-50 p-3.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-jungle-600 mt-0.5" />
                  <span className="text-sm font-medium text-ink">A guide who is willing to say &ldquo;not today.&rdquo;</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Group Photo with Gear */}
          <Reveal className="my-8">
            <figure className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5">
              <div className="relative aspect-[16/10] w-full bg-sand-200">
                <Image
                  src="/images/blogimages/WhatsApp Image 2026-10-16 at 13.32.55.jpeg"
                  alt="Happy tour group with proper helmets and harnesses"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
              <figcaption className="p-4 text-center text-xs sm:text-sm italic text-ink-soft bg-sand-50 border-t border-ink/5 font-medium">
                Good gear, good guides, big smiles.
              </figcaption>
            </figure>
          </Reveal>
        </section>

        {/* Section 3: Eco-friendly test */}
        <section className="my-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jungle-600 text-white font-display font-black text-lg">
                3
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                &ldquo;Eco-friendly&rdquo; is easy to print. Here&apos;s how to test it.
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                Almost every brochure in Belize says <em>sustainable</em>. Very few explain what that means. Here&apos;s my local filter:
              </p>
            </div>

            <div className="mt-6 space-y-3.5">
              <div className="rounded-2xl border border-jungle-200 bg-white p-5 shadow-soft">
                <h4 className="flex items-center gap-2 font-display text-base font-bold text-jungle-800">
                  <Leaf className="h-5 w-5 text-jungle-600" />
                  Wildlife is watched, never handled.
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  If a tour promises you can hold, feed or take a selfie with a wild animal, it&apos;s not sustainable. Period.
                </p>
              </div>

              <div className="rounded-2xl border border-jungle-200 bg-white p-5 shadow-soft">
                <h4 className="flex items-center gap-2 font-display text-base font-bold text-jungle-800">
                  <Users className="h-5 w-5 text-jungle-600" />
                  Group sizes stay small.
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  Fewer people means less trail erosion, less noise, and a better experience for you.
                </p>
              </div>

              <div className="rounded-2xl border border-jungle-200 bg-white p-5 shadow-soft">
                <h4 className="flex items-center gap-2 font-display text-base font-bold text-jungle-800">
                  <Sparkles className="h-5 w-5 text-jungle-600" />
                  Animals are treated well.
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  On horseback tours, look at the horses: healthy weight, well-fitted tack, rest and water breaks, and handlers who know each animal by name.
                </p>
              </div>

              <div className="rounded-2xl border border-jungle-200 bg-white p-5 shadow-soft">
                <h4 className="flex items-center gap-2 font-display text-base font-bold text-jungle-800">
                  <CheckCircle2 className="h-5 w-5 text-jungle-600" />
                  Nothing gets left behind.
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  Pack in, pack out. No plastic bottles on the trail, no souvenirs taken from caves or rivers.
                </p>
              </div>

              <div className="rounded-2xl border border-jungle-200 bg-white p-5 shadow-soft">
                <h4 className="flex items-center gap-2 font-display text-base font-bold text-jungle-800">
                  <Compass className="h-5 w-5 text-jungle-600" />
                  Guides stay on marked paths and explain why.
                </h4>
              </div>
            </div>
          </Reveal>

          {/* Horseback images grid */}
          <div className="my-8 grid gap-6 sm:grid-cols-2">
            <Reveal>
              <figure className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5">
                <div className="relative aspect-[4/5] w-full bg-sand-200">
                  <Image
                    src="/images/blogimages/WhatsApp Image 2026-10-16 at 13.32.57.jpeg"
                    alt="Horseback riding along scenic trail in Belize"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 450px"
                  />
                </div>
                <figcaption className="p-3 text-center text-xs italic text-ink-soft bg-sand-50 border-t border-ink/5">
                  Horseback through a shallow river crossing. Calm, well-cared-for horses and proper helmets matter.
                </figcaption>
              </figure>
            </Reveal>

            <Reveal>
              <figure className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5">
                <div className="relative aspect-[4/5] w-full bg-sand-200">
                  <Image
                    src="/images/horse_riding/h4.JPG"
                    alt="Local Belizean guide leading horseback expedition"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 450px"
                  />
                </div>
                <figcaption className="p-3 text-center text-xs italic text-ink-soft bg-sand-50 border-t border-ink/5">
                  Local guides who know the land, and the horses, make the ride.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* Section 4: Follow the money. Who actually benefits? */}
        <section className="my-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jungle-600 text-white font-display font-black text-lg">
                4
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                Follow the money. Who actually benefits?
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                Sustainability isn&apos;t only about nature. It&apos;s about people. A tour can look green and still send every dollar out of the country.
              </p>
              <p>
                Ask who owns the company, whether the guides are local, and where the lunch comes from. When your operator hires Belizean guides, buys from village farms and works with community-run sites, your money stays in the places you&apos;re visiting. That&apos;s the kind of tourism that gives locals a reason to protect the forest.
              </p>
            </div>
          </Reveal>

          {/* Cacao and local craft images */}
          <Reveal className="my-8">
            <figure className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5">
              <div className="relative aspect-[16/10] w-full bg-sand-200">
                <Image
                  src="/images/blogimages/WhatsApp Image 2026-10-16 at 13.32.55 (1).jpeg"
                  alt="Raw organic cacao pods and beans harvested in Belize"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
              <figcaption className="p-4 text-center text-xs sm:text-sm italic text-ink-soft bg-sand-50 border-t border-ink/5">
                Cacao is part of Belize&apos;s story. Buying chocolate from local makers keeps that story going.
              </figcaption>
            </figure>
            <p className="mt-4 text-center font-medium italic text-ink-soft">
              &ldquo;If your tour never introduces you to a single local business, ask yourself who it was really built for.&rdquo;
            </p>
          </Reveal>
        </section>

        {/* Section 5: Pay attention to communication */}
        <section className="my-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jungle-600 text-white font-display font-black text-lg">
                5
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                Pay attention to how they communicate.
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                A professional operator tells you what&apos;s included, what isn&apos;t, what to wear, what the physical demands are, and what the cancellation policy is. Before you book. In writing.
              </p>
            </div>

            {/* Red flags alert box */}
            <div className="mt-6 rounded-2xl bg-coral-50 border border-coral-200 p-6 text-ink-soft">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-coral-800">
                <AlertTriangle className="h-5 w-5 text-coral-600" />
                Red flags I see all the time:
              </h3>
              <ul className="mt-3.5 space-y-2 text-sm text-ink-soft">
                <li className="flex items-start gap-2">
                  <span className="text-coral-600 font-bold">✕</span>
                  <span>Prices that are far below everyone else&apos;s, with no explanation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral-600 font-bold">✕</span>
                  <span>Pressure to pay cash on the street or &ldquo;right now.&rdquo;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral-600 font-bold">✕</span>
                  <span>No website, no reviews, no real business address.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral-600 font-bold">✕</span>
                  <span>Guarantees about wildlife sightings. Nature doesn&apos;t take bookings.</span>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Guide communication photo */}
          <Reveal className="my-8">
            <figure className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5">
              <div className="relative aspect-[16/10] w-full bg-sand-200">
                <Image
                  src="/images/blogimages/WhatsApp Image 2026-10-16 at 13.32.59 (1).jpeg"
                  alt="Belize Audubon Society guide explaining trail biodiversity"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
              <figcaption className="p-4 text-center text-xs sm:text-sm italic text-ink-soft bg-sand-50 border-t border-ink/5 font-medium">
                The best days start with clear information and finish with everyone on the same page.
              </figcaption>
            </figure>
          </Reveal>
        </section>

        {/* Section 6: Make you part of something */}
        <section className="my-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-jungle-600 text-white font-display font-black text-lg">
                6
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                The best operators make you part of something.
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                This is harder to put on a checklist, but you feel it. The guide who remembers your name by the second stop. The group that goes from strangers to a circle of friends by lunch. The moment at a hidden swimming hole when nobody reaches for their phone.
              </p>
            </div>
          </Reveal>

          {/* Gallery Carousel / Trio */}
          <div className="my-8 grid gap-6 sm:grid-cols-3">
            <Reveal>
              <figure className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5 h-full flex flex-col">
                <div className="relative aspect-[4/5] w-full bg-sand-200">
                  <Image
                    src="/images/zip_waterfall/w2.JPG"
                    alt="Tour group bonding during jungle tour"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 300px"
                  />
                </div>
                <figcaption className="p-3 text-center text-xs italic text-ink-soft bg-sand-50 border-t border-ink/5 mt-auto">
                  Strangers on Monday, a team by Tuesday.
                </figcaption>
              </figure>
            </Reveal>

            <Reveal>
              <figure className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5 h-full flex flex-col">
                <div className="relative aspect-[4/5] w-full bg-sand-200">
                  <Image
                    src="/images/zip_waterfall/Copy of Copy of IMG-20240708-WA0019.jpg"
                    alt="Hidden jungle swimming pool in Belize"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 300px"
                  />
                </div>
                <figcaption className="p-3 text-center text-xs italic text-ink-soft bg-sand-50 border-t border-ink/5 mt-auto">
                  Hidden spots like this stay hidden because someone cares for them.
                </figcaption>
              </figure>
            </Reveal>

            <Reveal>
              <figure className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5 h-full flex flex-col">
                <div className="relative aspect-[4/5] w-full bg-sand-200">
                  <Image
                    src="/images/blogimages/WhatsApp Image 2026-10-16 at 13.32.56 (1).jpeg"
                    alt="Quiet wildlife watching deep in Belize canopy"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 300px"
                  />
                </div>
                <figcaption className="p-3 text-center text-xs italic text-ink-soft bg-sand-50 border-t border-ink/5 mt-auto">
                  Belize rewards visitors who tread lightly.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* Quick Checklist Card */}
        <section className="my-14">
          <Reveal>
            <div className="rounded-3xl bg-gradient-to-br from-jungle-900 to-jungle-950 p-8 sm:p-10 text-white shadow-lift">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral-500 text-white">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-white">
                    Your quick checklist before you book
                  </h3>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Valid BTB operator license and licensed guides. Ask for the number.",
                  "Insurance and a clear safety briefing for every activity.",
                  "Private groups and zero wildlife handling.",
                  "Local guides, local food, local partners.",
                  "Transparent pricing and written terms.",
                  "Recent, genuine reviews from real travelers.",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-coral-400 mt-0.5" />
                    <span className="text-sm font-medium text-white/90 leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-white/15 pt-6 text-sm text-white/80 leading-relaxed italic">
                &ldquo;Belize isn&apos;t a place you want to rush through with the cheapest option. It&apos;s a place to do properly, with people who love it and are accountable for how they share it.&rdquo;
              </div>
            </div>
          </Reveal>
        </section>

        {/* Call to Action Banner */}
        <Reveal className="my-12">
          <div className="rounded-3xl bg-sand-100 p-8 sm:p-10 text-center ring-1 ring-ink/5 shadow-soft">
            <span className="kicker justify-center text-coral-600">Plan with local pride</span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-2">
              Ready to see Belize the right way?
            </h3>
            <p className="mt-3 max-w-xl mx-auto text-ink-soft leading-relaxed">
              At Wilder Belize Adventures, we&apos;re licensed, locally run, and proud of it. Ask us anything, check our credentials, and let&apos;s plan a Belize trip you can feel great about.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/tours" className="btn btn-primary">
                Browse Guided Tours <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/build-your-route" className="btn btn-secondary">
                Build a Custom Route
              </Link>
              <Link href="/contact" className="btn btn-ghost border-ink/20">
                Contact Wilder
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Tags */}
        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-6">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-faint mr-2">Tags:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-soft shadow-sm ring-1 ring-ink/5"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
    </>
  );
}
