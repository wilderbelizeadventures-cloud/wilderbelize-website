import Fuse from "fuse.js";
import { knowledgeBase } from "./knowledgeBase";

const fuse = new Fuse(knowledgeBase, {
  keys: ["title", "content", "keywords"],
  threshold: 0.35,
  includeScore: true,
});

export function searchKnowledge(query: string) {
  const normalized = query.toLowerCase();

  // ---------- PRIORITY: Airport Transfers ----------
  if (
    normalized.includes("airport") ||
    normalized.includes("transfer") ||
    normalized.includes("pickup") ||
    normalized.includes("transport") ||
    normalized.includes("shuttle")
  ) {
    return knowledgeBase.filter(
      (item) => item.category === "transfer"
    );
  }

  // ---------- Normal Knowledge Search ----------
  return fuse
    .search(normalized)
    .slice(0, 3)
    .map((result) => result.item);
}