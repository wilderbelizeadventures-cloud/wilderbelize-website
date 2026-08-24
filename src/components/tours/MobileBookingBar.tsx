"use client";

import { useEffect } from "react";

/**
 * Fixed bottom booking bar for mobile. Adds matching bottom padding to <body>
 * (only on small screens, only while a tour page is mounted) so the bar never
 * overlaps the global footer.
 */
export function MobileBookingBar({ price }: { price: number }) {
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => {
      document.body.style.paddingBottom = mq.matches ? "5.5rem" : "";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.body.style.paddingBottom = "";
    };
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-ink-faint">From</span>
          <div className="font-display text-xl font-extrabold text-ink">
            ${price}
            <span className="text-sm font-medium text-ink-faint"> /person</span>
          </div>
        </div>
        <a
          href="#book"
          onClick={(e) => {
            const target = document.getElementById("book") || document.getElementById("if-name");
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: "smooth", block: "start" });
              setTimeout(() => {
                const nameInput = document.getElementById("if-name");
                if (nameInput) nameInput.focus();
              }, 400);
            }
          }}
          className="btn btn-primary max-w-[65%] flex-1 justify-center shadow-lg font-bold"
        >
          Book & Pay Now
        </a>
      </div>
    </div>
  );
}
