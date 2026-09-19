import type { MetadataRoute } from "next";
import { tours } from "@/data/tours";

const BASE = "https://www.wilderbelizeadventures.com";
const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/tours", "/build-your-route", "/transfers", "/about", "/travelers-info", "/contact", "/terms-and-conditions"].map((r) => ({
    url: `${BASE}${r}`,
    lastModified: NOW,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.8,
  }));
  const tourPages = tours.map((t) => ({
    url: `${BASE}/tours/${t.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...pages, ...tourPages];
}

