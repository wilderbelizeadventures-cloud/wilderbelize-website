import { Quote } from "lucide-react";
import { site } from "@/data/site";
import { StarRating } from "@/components/StarRating";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

export function Testimonials() {
  return (
    <section className="section bg-sand-100">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            align="center"
            kicker="Loved by travelers"
            title="Stories from the trail"
            subtitle="Real reviews from guests who experienced Belize the wilder way."
          />
        </Reveal>

        <Stagger className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {site.testimonials.map((t, index) => (
            <StaggerItem key={`${t.name}-${index}`} className="h-full">
              <figure className="flex h-full min-h-[420px] flex-col rounded-3xl bg-white p-7 shadow-soft ring-1 ring-ink/5">
                <Quote className="h-8 w-8 text-coral-400" />
                <blockquote className="mt-4 flex-1 line-clamp-6 text-[0.95rem] leading-relaxed text-ink-soft">“{t.text}”</blockquote>
                <StarRating rating={t.rating} size={15} className="mt-5" />
                <figcaption className="mt-auto border-t border-ink/5 pt-4">
                  <div className="font-display font-bold text-ink">{t.name}</div>
                  <div className="text-sm text-ink-faint">{t.location}</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-wider text-jungle-600">{t.tour}</div>
                  {t.link && (
                    <a
                      href={t.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm font-medium text-jungle-600 hover:underline"
                    >
                      Read more reviews on Tripadvisor →
                    </a>
                  )}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
