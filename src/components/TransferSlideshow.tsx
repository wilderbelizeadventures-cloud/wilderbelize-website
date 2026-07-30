"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";

export function TransferSlideshow() {
  const images = site.transfer.slideshowImages;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Transfer vehicle ${index + 1}`}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-700 ${
            current === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              current === index
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-white">
        <p className="text-lg font-semibold">
          $300
        </p>
        <p className="text-sm mt-1">+$30 per each additional person</p>
      </div>
    </div>
  );
}