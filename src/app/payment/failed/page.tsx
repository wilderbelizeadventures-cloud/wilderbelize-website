import Link from "next/link";
import { AlertCircle, RefreshCw, MessageSquare, ArrowLeft } from "lucide-react";

export default function FailedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4 py-16">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 text-center shadow-xl border border-coral-200">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coral-100 text-coral-600 shadow-md">
          <AlertCircle className="h-10 w-10" />
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-coral-600">
          Transaction Incomplete
        </p>

        <h1 className="mt-1 text-3xl font-extrabold text-ink">Payment Failed</h1>

        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          Unfortunately, your payment could not be processed by Belize Bank. No funds were charged to your account.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/tours"
            className="btn btn-primary justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Try Booking Again
          </Link>

          <a
            href="https://wa.me/5016501003"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-white justify-center gap-2 border border-ink/15 text-jungle-800 hover:bg-jungle-50"
          >
            <MessageSquare className="h-4 w-4 text-jungle-600" /> WhatsApp Support (+501 650-1003)
          </a>

          <Link
            href="/"
            className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}