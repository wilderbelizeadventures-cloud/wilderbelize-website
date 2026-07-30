import type { MetadataRoute } from "next";
import { tours } from "@/data/tours";

const BASE = "https://wilderbelizeadventures.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/tours", "/build-your-route", "/transfers", "/about", "/travelers-info", "/contact"].map((r) => ({
    url: `${BASE}${r}`,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.8,
  }));
  const tourPages = tours.map((t) => ({
    url: `${BASE}/tours/${t.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...pages, ...tourPages];
}
