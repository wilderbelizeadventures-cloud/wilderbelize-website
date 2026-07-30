"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2 rounded-full bg-jungle-500/15 px-5 py-3 text-sm font-semibold text-jungle-100">
        <Check className="h-4 w-4" /> You&apos;re on the list — see you in the wild!
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className={`min-w-0 flex-1 rounded-full px-5 py-3 text-sm outline-none ring-2 ring-transparent transition focus:ring-coral-400 ${
          dark ? "bg-white/10 text-white placeholder:text-white/50" : "bg-white text-ink placeholder:text-ink-faint"
        }`}
      />
      <button type="submit" disabled={state === "loading"} className="btn btn-primary shrink-0">
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
      </button>
    </form>
  );
}
