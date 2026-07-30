import Link from "next/link";
import { Compass, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { company, site } from "@/data/site";
import { NewsletterForm } from "@/components/NewsletterForm";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/SocialIcons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-auto">
      {/* CTA band */}
      <div className="container-page">
        <div className="relative -mb-20 overflow-hidden rounded-3xl bg-gradient-to-br from-jungle-700 via-jungle-600 to-lagoon-600 px-6 py-12 text-center shadow-lift md:px-16 md:py-16">
          <div className="noise absolute inset-0" />
          <div className="relative">
            <p className="kicker justify-center text-coral-200">Your adventure is waiting</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl text-white md:text-5xl">
              Ready to explore Belize the wilder way?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/85">
              Tell us your dates and we&apos;ll craft the kind of day you&apos;ll be talking about for lifetime.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/tours" className="btn btn-white">Browse Adventures <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/build-your-route" className="btn btn-ghost border-white/40 text-white hover:bg-white hover:text-ink">
                Plan a Custom Trip
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-jungle-950 pb-8 pt-32 text-white/70">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-jungle-500 to-lagoon-500 text-white">
                  <Compass className="h-5 w-5" />
                </span>
                <span className="leading-none">
                  <span className="block font-display text-base font-extrabold text-white">Wilder Belize</span>
                  <span className="block text-[0.62rem] font-bold uppercase tracking-[0.25em] text-coral-300">Adventures</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed">
                Belizean owned tour company in Placencia Village taking travelers deep into the real Belize — jungle,
                waterfalls, caves, and Maya country.
              </p>
              <div className="mt-5 flex gap-2.5">
                <a href={company.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-coral-500">
                  <FacebookIcon className="h-5 w-5" />
                </a>
                <a href={company.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-coral-500">
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a href={company.socials.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-coral-500">
                  <WhatsappIcon className="h-5 w-5" />
                </a>
                <a href={company.socials.tripadvisor} target="_blank" rel="noopener noreferrer" className="flex h-10 items-center justify-center rounded-xl bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-coral-500">
                  Tripadvisor
                </a>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Explore</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href="/tours" className="transition hover:text-coral-300">All Tours</Link></li>
                <li><Link href="/build-your-route" className="transition hover:text-coral-300">Build Your Route</Link></li>
                <li><Link href="/tours?category=full-day" className="transition hover:text-coral-300">Full-Day Adventures</Link></li>
                <li><Link href="/tours?category=half-day" className="transition hover:text-coral-300">Half-Day Adventures</Link></li>
                <li><Link href="/tours?category=multi-day" className="transition hover:text-coral-300">Multi-Day Adventures</Link></li>
                <li><Link href="/transfers" className="transition hover:text-coral-300">Ground Transfers</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Company</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href="/about" className="transition hover:text-coral-300">About Us</Link></li>
                <li><Link href="/travelers-info" className="transition hover:text-coral-300">Travelers Info</Link></li>
                <li><Link href="/contact" className="transition hover:text-coral-300">Contact</Link></li>
                <li><Link href="/contact#faq" className="transition hover:text-coral-300">FAQs</Link></li>
                <li><Link href="/terms-and-conditions" className="transition hover:text-coral-300">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Contact + newsletter */}
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Get in touch</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-coral-300" />
                  <span>{company.phones.join(" · ")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-coral-300" />
                  <a href={`mailto:${company.emails[0]}`} className="break-all transition hover:text-coral-300">{company.emails[0]}</a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral-300" />
                  <span>{company.address}</span>
                </li>
              </ul>
              <p className="mt-5 text-sm font-semibold text-white">{site.newsletterPitch}</p>
              <div className="mt-3"><NewsletterForm dark /></div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
            <p>© {year} {company.name}. All rights reserved.</p>
            <p>Crafted with care in Placencia Village, Belize 🇧🇿 · Secure payments powered by Belize Bank</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
