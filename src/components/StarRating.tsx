import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  count,
  size = 16,
  className,
  showValue = false,
}: {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="relative inline-flex" aria-label={`${rating} out of 5 stars`}>
        <div className="flex text-ink/20">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} width={size} height={size} className="flex-none" strokeWidth={1.5} />
          ))}
        </div>
        <div className="absolute inset-0 flex overflow-hidden text-gold-400" style={{ width: `${pct}%` }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} width={size} height={size} className="flex-none fill-gold-400" strokeWidth={1.5} />
          ))}
        </div>
      </div>
      {showValue && <span className="text-sm font-bold text-ink">{rating.toFixed(1)}</span>}
      {count != null && <span className="text-sm text-ink-faint">({count})</span>}
    </div>
  );
}
