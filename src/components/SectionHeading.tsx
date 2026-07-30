import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  light = false,
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      {kicker && <p className={cn("kicker", align === "center" && "justify-center", light && "text-coral-300")}>{kicker}</p>}
      <h2 className={cn("mt-3 text-3xl md:text-4xl lg:text-[2.75rem]", light ? "text-white" : "text-ink")}>{title}</h2>
      {subtitle && (
        <p className={cn("mt-4 text-base leading-relaxed md:text-lg", light ? "text-white/80" : "text-ink-soft")}>{subtitle}</p>
      )}
    </div>
  );
}
