import type { Metadata } from "next";
import { TermsAndConditions } from "@/components/TermsAndConditions";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Booking, cancellation, and liability terms for Wilder Belize Adventures.",
};

export default function TermsAndConditionsPage() {
  return (
    <section className="section pt-32">
      <div className="container-page max-w-3xl">
        <p className="kicker text-coral-600">Before you book</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink md:text-5xl">Terms & Conditions</h1>
        <p className="mt-4 text-ink-soft">Please read carefully before completing payment. By submitting payment, you agree to these terms for yourself and everyone included in your booking.</p>
        <div className="mt-10 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-ink/5 md:p-10">
          <TermsAndConditions />
        </div>
      </div>
    </section>
  );
}
