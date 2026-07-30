import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Accordion } from "@/components/Accordion";
import { InquiryForm } from "@/components/InquiryForm";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/SocialIcons";
import { company, site } from "@/data/site";
import { HERO_IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Wilder Belize Adventures in Placencia Village. Call, WhatsApp, or send us a message to plan your Belize adventure.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        image={HERO_IMAGES.cave}
        theme="cave"
        kicker="We&apos;re here to help"
        title="Let&apos;s plan your adventure"
        subtitle="Questions, custom trips, or ready to book — a real person in Placencia will get right back to you."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* Details */}
          <Reveal>
            <div>
              <SectionHeading kicker="Get in touch" title="Reach the Wilder team" />
              <div className="mt-8 space-y-4">
                <ContactRow icon={<Phone className="h-5 w-5" />} label="Call us">
                  {company.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block transition hover:text-jungle-700">{p}</a>
                  ))}
                </ContactRow>
                <ContactRow icon={<Mail className="h-5 w-5" />} label="Email">
                  {company.emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="block break-all transition hover:text-jungle-700">{e}</a>
                  ))}
                </ContactRow>
                <ContactRow icon={<MapPin className="h-5 w-5" />} label="Find us">
                  {company.address}
                </ContactRow>
                <ContactRow icon={<Clock className="h-5 w-5" />} label="Hours">
                  Daily · 6:00 AM – 9:00 PM
                </ContactRow>
              </div>

              <div className="mt-7 flex gap-3">
                <a href={company.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl bg-jungle-600 text-white transition hover:bg-jungle-700" aria-label="WhatsApp">
                  <WhatsappIcon className="h-6 w-6" />
                </a>
                <a href={company.socials.facebook} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl bg-jungle-600 text-white transition hover:bg-jungle-700" aria-label="Facebook">
                  <FacebookIcon className="h-6 w-6" />
                </a>
                <a href={company.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl bg-jungle-600 text-white transition hover:bg-jungle-700" aria-label="Instagram">
                  <InstagramIcon className="h-6 w-6" />
                </a>
              </div>

              <div className="mt-7 overflow-hidden rounded-3xl shadow-soft ring-1 ring-ink/5">
                <iframe
                  title="Placencia Village map"
                  src="https://www.google.com/maps?q=Placencia%20Village%2C%20Belize&output=embed"
                  className="h-64 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal>
            <div className="rounded-3xl bg-white p-7 shadow-lift ring-1 ring-ink/5 md:p-8">
              <h2 className="font-display text-2xl font-bold text-ink">Send us a message</h2>
              <p className="mt-1.5 text-sm text-ink-soft">We typically reply within 24 hours.</p>
              <div className="mt-6">
                <InquiryForm mode="contact" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section bg-sand-100 pt-0">
        <div className="container-page pt-20 md:pt-24">
          <Reveal>
            <SectionHeading align="center" kicker="Good to know" title="Frequently asked questions" />
          </Reveal>
          <Reveal className="mx-auto mt-10 max-w-3xl">
            <Accordion items={site.faqs.map((f) => ({ q: f.q, a: f.a }))} />
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-jungle-50 text-jungle-700">{icon}</span>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-ink-faint">{label}</div>
        <div className="mt-0.5 font-semibold text-ink">{children}</div>
      </div>
    </div>
  );
}
