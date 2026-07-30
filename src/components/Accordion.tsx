"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: string }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="divide-y divide-ink/10 overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-sand-50"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base font-bold text-ink md:text-lg">{item.q}</span>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${isOpen ? "bg-coral-500 text-white" : "bg-jungle-50 text-jungle-700"}`}>
                <Plus className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft md:text-base">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
