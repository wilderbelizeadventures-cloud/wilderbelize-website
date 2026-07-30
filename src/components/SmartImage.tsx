"use client";

import Image from "next/image";
import { useState } from "react";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { gradientFor } from "@/lib/images";

type SmartImageProps = {
  src: string;
  alt: string;
  theme?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
};

/** next/image with a graceful gradient fallback if the file is missing. */
export function SmartImage({
  src,
  alt,
  theme = "jungle-hike",
  className,
  imgClassName,
  sizes = "100vw",
  priority = false,
}: SmartImageProps) {
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {error ? (
        <div className={cn("absolute inset-0 flex items-center justify-center bg-gradient-to-br", gradientFor(theme))}>
          <Compass className="h-10 w-10 text-white/60" />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setError(true)}
          className={cn("object-cover", imgClassName)}
        />
      )}
    </div>
  );
}
