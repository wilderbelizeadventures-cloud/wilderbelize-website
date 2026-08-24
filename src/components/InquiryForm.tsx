"use client";

import { useEffect, useState, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, Loader2, Check, CalendarDays, Users, MessageSquare, PartyPopper, X, AlertCircle } from "lucide-react";
import Link from "next/link";

import { TermsAndConditions } from "@/components/TermsAndConditions";
import { tours } from "@/data/tours";
import { cn } from "@/lib/utils";

type Mode = "booking" | "contact";

type InquiryFormProps = {
  mode?: Mode;
  lockedTourName?: string;
  defaultTourName?: string;
  className?: string;
  submitLabel?: string;
  /** Single-column layout for narrow containers (e.g. the sticky booking sidebar). */
  compact?: boolean;
};

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-sand-50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-jungle-500 focus:ring-2 focus:ring-jungle-500/30 placeholder:text-ink-faint";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft";

export function InquiryForm({
  mode = "booking",
  lockedTourName,
  defaultTourName,
  className,
  submitLabel,
  compact = false,
}: InquiryFormProps) {
  const idPrefix = useId();
  const errorRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tour, setTour] = useState(lockedTourName ?? defaultTourName ?? "");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(3);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [hotel, setHotel] = useState("");
  const [company, setCompany] = useState(""); // honeypot — real users leave this empty
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);
  const rowCls = cn("grid gap-4", !compact && "sm:grid-cols-2");

  useEffect(() => {
    if (!termsOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [termsOpen]);

  const clearErrorOnTyping = () => {
    if (error) setError("");
    if (state === "error") setState("idle");
  };

  function triggerValidationError(msg: string) {
    setError(msg);
    setState("error");
    setTimeout(() => {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (company) return;

    const nameVal = name.trim();
    const emailVal = email.trim();
    const phoneVal = phone.trim();
    const dateVal = date || today || new Date().toISOString().split("T")[0];
    const hotelVal = hotel.trim();
    const messageVal = message.trim();

    console.log("=== [FORM ONSUBMIT CALLED] ===", { mode, nameVal, emailVal, phoneVal, dateVal, hotelVal, messageVal });

    if (!nameVal) {
      triggerValidationError("Please enter your Full Name.");
      return;
    }

    if (!emailVal || !emailVal.includes("@")) {
      triggerValidationError("Please enter a valid Email address.");
      return;
    }

    if (mode === "booking" && !hotelVal) {
      triggerValidationError("Please enter your Hotel or Pickup Location.");
      return;
    }

    if (mode === "contact") {
      void sendContactEmail(nameVal, emailVal, phoneVal, messageVal);
      return;
    }

    void startPayment(nameVal, emailVal, phoneVal, dateVal, hotelVal, messageVal);
  }

  async function sendContactEmail(
    nameVal: string,
    emailVal: string,
    phoneVal: string,
    messageVal: string
  ) {
    if (!nameVal || !emailVal || !messageVal) {
      triggerValidationError("Please fill in your name, email, and message.");
      return;
    }

    setState("loading");
    setError("");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: nameVal,
          email: emailVal,
          phone: phoneVal || "",
          tour: tour || "",
          date: date || "",
          guests: String(guests),
          hotel: hotel || "",
          subject: subject || "",
          message: messageVal,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setState("done");
    } catch (err) {
      console.error("Failed to send inquiry:", err);
      setState("error");
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again or contact us directly.");
    }
  }

  async function startPayment(
    nameVal?: string,
    emailVal?: string,
    phoneVal?: string,
    dateVal?: string,
    hotelVal?: string,
    messageVal?: string
  ) {
    const resolvedName = (nameVal || name).trim();
    const resolvedEmail = (emailVal || email).trim();
    const resolvedPhone = (phoneVal || phone).trim();
    const resolvedDate = dateVal || date || today || new Date().toISOString().split("T")[0];
    const resolvedHotel = (hotelVal || hotel).trim();
    const resolvedMessage = (messageVal || message).trim();

    const tourIdentifier = lockedTourName || tour;
    const selectedTour =
      tours.find((t) => t.name === tourIdentifier) ??
      tours.find((t) => t.slug === tourIdentifier) ??
      tours.find((t) => t.name.toLowerCase().includes((tourIdentifier || "").toLowerCase())) ??
      (tourIdentifier ? { name: tourIdentifier, price: 150 } : null);

    if (!resolvedName || !resolvedEmail || !resolvedDate) {
      triggerValidationError("Please fill in your Full Name, Email, and Preferred Date.");
      return;
    }

    if (!selectedTour) {
      triggerValidationError("Please select a valid tour adventure.");
      return;
    }

    setState("loading");
    setError("");

    const totalAmount = selectedTour.price * guests;

    console.log("=== [FORM SUBMIT INITIATED] ===", {
      tourName: selectedTour.name,
      amount: totalAmount,
      name: resolvedName,
      email: resolvedEmail,
      phone: resolvedPhone,
      date: resolvedDate,
      guests,
      hotel: resolvedHotel,
    });

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourName: selectedTour.name,
          amount: totalAmount,
          name: resolvedName,
          email: resolvedEmail,
          phone: resolvedPhone,
          date: resolvedDate,
          guests,
          hotel: resolvedHotel,
          message: resolvedMessage,
        }),
      });

      const data = await res.json();
      console.log("=== [PAYMENT API RESPONSE RECEIVED] ===", data);

      if (!res.ok || !data.success) {
        console.error("Belize Bank Diagnostic Response:", data);
        const errMsg = `${data.message || "Payment initialization failed."}`;
        setError(errMsg);
        throw new Error(errMsg);
      }

      const bookingPayload = {
        tourName: selectedTour.name,
        date: resolvedDate,
        guests,
        hotel: resolvedHotel,
        name: resolvedName,
        email: resolvedEmail,
        phone: resolvedPhone,
        message: resolvedMessage,
        totalAmount,
        orderId: data.orderId,
        orderNumber: data.orderNumber,
      };

      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingPayload));

      try {
        document.cookie = `pendingBooking_${data.orderId}=${encodeURIComponent(
          JSON.stringify(bookingPayload)
        )}; path=/; max-age=86400; SameSite=Lax`;
      } catch (e) {
        console.warn("Could not write backup cookie", e);
      }

      console.log(`=== [PAYMENT REDIRECT] Redirecting browser to payment URL: ${data.paymentUrl} ===`);
      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error("=== [START PAYMENT EXCEPTION] ===", err);
      setState("error");
      if (!error) {
        setError(err instanceof Error ? err.message : "Something went wrong initiating payment.");
      }
    }
  }

  if (state === "done") {
    return (
      <div className={cn("rounded-3xl bg-jungle-800 p-8 text-center text-white", className)}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-coral-500">
          <PartyPopper className="h-7 w-7" />
        </div>
        <h3 className="text-2xl text-white">Request received!</h3>
        <p className="mt-2 text-sm text-white/80">
          Thanks, {name.split(" ")[0] || "friend"}. A real person in Placencia will get back to you within 24 hours to
          confirm the details. Keep an eye on your inbox.
        </p>
        <button
          type="button"
          onClick={() => {
            setState("idle");
            setMessage("");
          }}
          className="btn btn-white mt-6"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("space-y-4", className)} suppressHydrationWarning>
      {/* Honeypot — visually hidden, ignored by humans */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${idPrefix}-company`}>Company</label>
        <input
          id={`${idPrefix}-company`}
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          suppressHydrationWarning
        />
      </div>

      <div className={rowCls}>
        <div>
          <label className={labelCls} htmlFor={`${idPrefix}-name`}>Full name</label>
          <input
            id={`${idPrefix}-name`}
            className={inputCls}
            value={name}
            onChange={(e) => { setName(e.target.value); clearErrorOnTyping(); }}
            required
            placeholder="Jane Traveler"
            suppressHydrationWarning
          />
        </div>
        <div>
          <label className={labelCls} htmlFor={`${idPrefix}-email`}>Email</label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            className={inputCls}
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearErrorOnTyping(); }}
            required
            placeholder="you@email.com"
            suppressHydrationWarning
          />
        </div>
      </div>

      <div className={rowCls}>
        <div>
          <label className={labelCls} htmlFor={`${idPrefix}-phone`}>Phone / WhatsApp <span className="font-medium normal-case text-ink-faint">(optional)</span></label>
          <input
            id={`${idPrefix}-phone`}
            className={inputCls}
            value={phone}
            onChange={(e) => { setPhone(e.target.value); clearErrorOnTyping(); }}
            placeholder="+1 555 123 4567"
            suppressHydrationWarning
          />
        </div>
        {mode === "contact" ? (
          <div>
            <label className={labelCls} htmlFor={`${idPrefix}-subject`}>Subject <span className="font-medium normal-case text-ink-faint">(optional)</span></label>
            <input
              id={`${idPrefix}-subject`}
              className={inputCls}
              value={subject}
              onChange={(e) => { setSubject(e.target.value); clearErrorOnTyping(); }}
              placeholder="Trip planning, custom tour…"
            />
          </div>
        ) : (
          <div>
            <label className={labelCls} htmlFor={`${idPrefix}-date`}><CalendarDays className="mr-1 inline h-3.5 w-3.5" /> Preferred date</label>
            <input
              id={`${idPrefix}-date`}
              type="date"
              min={today}
              suppressHydrationWarning
              required={mode === "booking"}
              className={inputCls}
              value={date}
              onChange={(e) => { setDate(e.target.value); clearErrorOnTyping(); }}
            />
          </div>
        )}
      </div>

      {mode === "booking" && (
        <div className={rowCls}>
          <div>
            <label className={labelCls} htmlFor={`${idPrefix}-tour`}>Tour</label>
            {lockedTourName ? (
              <input
                id={`${idPrefix}-tour`}
                readOnly
                value={lockedTourName}
                className="w-full rounded-xl border border-jungle-500/30 bg-jungle-50 px-4 py-2.5 text-sm font-semibold text-jungle-800"
              />
            ) : (
              <select
                id={`${idPrefix}-tour`}
                className={inputCls}
                value={tour}
                onChange={(e) => { setTour(e.target.value); clearErrorOnTyping(); }}
                required
              >
                <option value="">Choose an adventure…</option>
                <optgroup label="Full Day">
                  {tours.filter((t) => t.category === "Full Day").map((t) => (
                    <option key={t.slug} value={t.name}>{t.name} — ${t.price}</option>
                  ))}
                </optgroup>
                <optgroup label="Half Day">
                  {tours.filter((t) => t.category === "Half Day").map((t) => (
                    <option key={t.slug} value={t.name}>{t.name} — ${t.price}</option>
                  ))}
                </optgroup>
              </select>
            )}
          </div>
          <div>
            <span id={`${idPrefix}-guests-label`} className={labelCls}><Users className="mr-1 inline h-3.5 w-3.5" /> Guests</span>
            <div role="group" aria-labelledby={`${idPrefix}-guests-label`} className="flex items-center justify-between rounded-xl border border-ink/15 bg-sand-50 px-2 py-1.5">
              <button
                type="button"
                aria-label="Fewer guests"
                onClick={() => setGuests((g) => Math.max(3, g - 1))}
                disabled={guests <= 3}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink shadow-sm transition hover:bg-jungle-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-base font-bold text-ink" aria-live="polite">{guests}</span>
              <button
                type="button"
                aria-label="More guests"
                onClick={() => setGuests((g) => Math.min(20, g + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink shadow-sm transition hover:bg-jungle-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <label className={labelCls} htmlFor={`${idPrefix}-hotel`}>
          Hotel / Pickup Location
        </label>
        <input
          id={`${idPrefix}-hotel`}
          className={inputCls}
          value={hotel}
          onChange={(e) => { setHotel(e.target.value); clearErrorOnTyping(); }}
          placeholder="Placencia Resort, AirBnB, etc."
          required={mode === "booking"}
        />
      </div>
      <div>
        <label className={labelCls} htmlFor={`${idPrefix}-message`}>
          <MessageSquare className="mr-1 inline h-3.5 w-3.5" />
          {mode === "contact" ? "Your message" : "Anything we should know?"}
          {mode === "booking" && <span className="font-medium normal-case text-ink-faint"> (optional)</span>}
        </label>
        <textarea
          id={`${idPrefix}-message`}
          className={cn(inputCls, "min-h-[96px] resize-y")}
          value={message}
          onChange={(e) => { setMessage(e.target.value); clearErrorOnTyping(); }}
          required={mode === "contact"}
          placeholder={mode === "contact" ? "Tell us what you're dreaming up…" : "Hotel name, kids' ages, dietary needs, special requests…"}
        />
      </div>

      {mode === "booking" && (() => {
        const tourIdentifier = lockedTourName || tour;
        const selectedTour =
          tours.find((t) => t.name === tourIdentifier) ??
          tours.find((t) => t.slug === tourIdentifier) ??
          (tourIdentifier ? { name: tourIdentifier, price: 150 } : null);

        const total = (selectedTour?.price ?? 0) * guests;

        return (
          <div className="rounded-2xl border border-jungle-200 bg-jungle-50 p-4">
            <h3 className="mb-3 text-lg font-semibold text-jungle-800">
              Booking Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tour</span>
                <span>{selectedTour?.name}</span>
              </div>

              <div className="flex justify-between">
                <span>Date</span>
                <span>{date || "-"}</span>
              </div>

              <div className="flex justify-between">
                <span>Guests</span>
                <span>{guests}</span>
              </div>

              <div className="flex justify-between">
                <span>Pickup</span>
                <span>{hotel || "-"}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold text-jungle-700">
                <span>Total</span>
                <span>${total} USD</span>
              </div>
            </div>
          </div>
        );
      })()}

      {error && (
        <div ref={errorRef} className="rounded-2xl border-2 border-coral-400 bg-coral-50 p-4 text-sm font-bold text-coral-900 shadow-md flex items-start gap-2.5 my-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-coral-600 mt-0.5" />
          <div>
            <p className="font-extrabold text-coral-900">Please Check Your Details</p>
            <p className="text-xs font-medium text-coral-800 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        suppressHydrationWarning
        disabled={state === "loading"}
        className="btn btn-primary w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {submitLabel ?? (mode === "contact" ? "Send Message" : "Pay & Book Now")}
            <Check className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-ink-faint">
        Secure payment powered by Belize Bank. Your booking will be confirmed after successful payment.
      </p>

      {termsOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-x-0 bottom-0 top-20 z-[2147483647] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={`${idPrefix}-terms-dialog-title`}>
          <button
            type="button"
            aria-label="Close terms and conditions"
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setTermsOpen(false)}
          />
          <div className="relative flex max-h-[calc(100dvh-6rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-sand-50 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-coral-600">One last step</p>
                <h2 id={`${idPrefix}-terms-dialog-title`} className="mt-1 font-display text-2xl font-bold text-ink">Terms & Conditions</h2>
              </div>
              <button type="button" onClick={() => setTermsOpen(false)} aria-label="Close" className="rounded-xl p-2 text-ink-soft transition hover:bg-sand-100 hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5">
              <p className="mb-5 text-sm text-ink-soft">Please read these terms before continuing to secure payment.</p>
              <TermsAndConditions />
            </div>

            <div className="border-t border-ink/10 bg-white px-6 py-5">
              <label className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-ink/30 accent-jungle-700"
                />
                <span>I have read and agree to the Terms & Conditions for everyone included in this booking.</span>
              </label>
              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/terms-and-conditions" target="_blank" className="text-center text-sm font-semibold text-jungle-700 underline underline-offset-4 hover:text-jungle-900">
                  Open full terms in a new tab
                </Link>
                <button
                  type="button"
                  disabled={!termsAccepted || state === "loading"}
                  onClick={() => {
                    setTermsOpen(false);
                    void startPayment();
                  }}
                  className="btn btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {state === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue to Secure Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </form>
  );
}
