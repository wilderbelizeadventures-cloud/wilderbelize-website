import Link from "next/link";
import { Compass, ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-jungle-950 px-6 text-center text-white">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-lagoon-600/30 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-coral-600/20 blur-3xl" />
      <div className="relative max-w-lg">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-jungle-500 to-lagoon-500 text-white shadow-lift">
          <Compass className="h-10 w-10 animate-spin-slow" />
        </span>
        <p className="kicker mt-8 justify-center text-coral-300">Lost in the jungle</p>
        <h1 className="mt-3 font-display text-7xl font-extrabold text-white">404</h1>
        <p className="mx-auto mt-4 max-w-sm text-white/75">
          This trail doesn&apos;t exist on our map. Let&apos;s get you back to the good stuff.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary"><Home className="h-4 w-4" /> Back home</Link>
          <Link href="/tours" className="btn btn-ghost border-white/30 text-white hover:bg-white hover:text-ink">
            Browse adventures <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
