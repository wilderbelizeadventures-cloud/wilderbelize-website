import { site } from "@/data/site";
import { tours } from "@/data/tours";

export interface KnowledgeItem {
  id: string;
  category: "faq" | "tour" | "transfer" | "traveler" | "about";
  title: string;
  content: string;
  keywords: string[];
}

const faqItems: KnowledgeItem[] = site.faqs.map((faq, index) => ({
  id: `faq-${index}`,
  category: "faq",
  title: faq.q,
  content: faq.a,
  keywords: ["faq", "help", ...faq.q.toLowerCase().split(/\s+/)],
}));

const travelerItems: KnowledgeItem[] = site.travelersInfo.map((info, index) => ({
  id: `traveler-${index}`,
  category: "traveler",
  title: info.title,
  content: info.body,
  keywords: ["travel", "traveler", "belize", ...info.title.toLowerCase().split(/\s+/)],
}));

const transferItems: KnowledgeItem[] = site.transfer.routes.map((route, index) => ({
  id: `transfer-${index}`,
  category: "transfer",
  title: `${route.from} to ${route.to}`,
  content: `Airport transfer. Private transfer. Shuttle service. Transportation from ${route.from} to ${route.to}. Price: ${route.price}. Duration: ${route.duration}.`,
  keywords: [
    "airport",
    "transfer",
    "pickup",
    "shuttle",
    "transport",
    route.from.toLowerCase(),
    route.to.toLowerCase(),
  ],
}));

const aboutItem: KnowledgeItem = {
  id: "about",
  category: "about",
  title: "About Wilder Belize Adventures",
  content: `${site.aboutShort} ${site.aboutLong}`,
  keywords: ["about", "company", "wilder", "belize", "placencia"],
};

const tourItems: KnowledgeItem[] = tours.map((tour) => ({
  id: tour.slug,
  category: "tour",
  title: tour.name,
  content: [
    tour.description,
    `Price: ${tour.price}`,
    `Duration: ${tour.duration}`,
    `Difficulty: ${tour.difficulty}`,
    ...(tour.highlights ?? []),
    ...(tour.included ?? []),
  ].join(" "),
  keywords: [
    tour.name.toLowerCase(),
    tour.category.toLowerCase(),
    tour.difficulty.toLowerCase(),
    ...(tour.highlights ?? []).map((h) => h.toLowerCase()),
  ],
}));

export const knowledgeBase: KnowledgeItem[] = [
  ...faqItems,
  ...travelerItems,
  ...transferItems,
  aboutItem,
  ...tourItems,
];