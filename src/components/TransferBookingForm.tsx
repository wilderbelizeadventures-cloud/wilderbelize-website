"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Minus,
  Plus,
  Loader2,
  Check,
  CalendarDays,
  Users,
  MessageSquare,
  Car,
  X,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { TermsAndConditions } from "@/components/TermsAndConditions";
import { cn } from "@/lib/utils";

export interface TransferRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  tripType: "One-Way" | "Round Trip";
  basePrice: number; // For 1-4 persons
  extraGuestPrice: number; // Price per extra person over 4
}

export const TRANSFER_ROUTES: TransferRoute[] = [
  {
    id: "bze-to-placencia",
    name: "Belize Airport (BZE) ➔ Placencia",
    from: "Belize Airport (BZE)",
    to: "Placencia",
    tripType: "One-Way",
    basePrice: 300,
    extraGuestPrice: 30,
  },
  {
    id: "placencia-to-bze",
    name: "Placencia ➔ Belize Airport (BZE)",
    from: "Placencia",
    to: "Belize Airport (BZE)",
    tripType: "One-Way",
    basePrice: 300,
    extraGuestPrice: 30,
  },
  {
    id: "bze-placencia-roundtrip",
    name: "Belize Airport (BZE) ↔ Placencia",
    from: "Belize Airport (BZE)",
    to: "Placencia (Round Trip)",
    tripType: "Round Trip",
    basePrice: 550,
    extraGuestPrice: 60,
  },
];

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-sand-50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-jungle-500 focus:ring-2 focus:ring-jungle-500/30 placeholder:text-ink-faint";
const labelCls =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft";

interface TransferBookingFormProps {
  initialRouteId?: string;
  className?: string;
}

export function TransferBookingForm({
  initialRouteId = "bze-to-placencia",
  className,
}: TransferBookingFormProps) {
  const [selectedRouteId, setSelectedRouteId] = useState(initialRouteId);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [pickupLocation, setPickupLocation] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [today, setToday] = useState("");

  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    setToday(todayStr);
    if (!pickupDate) setPickupDate(todayStr);
  }, []);

  useEffect(() => {
    if (initialRouteId) {
      setSelectedRouteId(initialRouteId);
    }
  }, [initialRouteId]);

  useEffect(() => {
    if (!termsOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [termsOpen]);

  const currentRoute =
    TRANSFER_ROUTES.find((r) => r.id === selectedRouteId) || TRANSFER_ROUTES[0];

  const totalGuests = adults;
  const extraGuests = Math.max(0, totalGuests - 4);
  const extraGuestFee = extraGuests * currentRoute.extraGuestPrice;
  const totalPrice = currentRoute.basePrice + extraGuestFee;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (company) return; // Honeypot check

    const effectiveDate = pickupDate || today || new Date().toISOString().split("T")[0];

    if (!name || !email || !pickupLocation) {
      setError("Please fill in your Name, Email, and Pickup Location.");
      setState("error");
      return;
    }

    if (!pickupDate) {
      setPickupDate(effectiveDate);
    }

    if (currentRoute.tripType === "Round Trip" && !returnDate) {
      setError("Please select a return date for round trip transfer.");
      setState("error");
      return;
    }

    // Open Terms modal first
    setTermsOpen(true);
  }

  async function startPayment() {
    setState("loading");
    setError("");

    try {
      const transferTitle = `Transfer: ${currentRoute.name}`;

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourName: transferTitle,
          amount: totalPrice,
          name,
          email,
          phone,
          date: currentRoute.tripType === "Round Trip" ? `${pickupDate} (Return: ${returnDate})` : pickupDate,
          guests: totalGuests,
          hotel: pickupLocation,
          message: `Flight: ${flightNumber || "N/A"}. Children under 10: ${childrenCount}. ${message}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Belize Bank Diagnostic Response:", data);
        setError(
          `${data.message || "Payment initialization failed."} (Code: ${data.errorCode ?? "N/A"})`
        );
        throw new Error(data.message || "Payment initialization failed.");
      }

      const bookingPayload = {
        tour: transferTitle,
        tourName: transferTitle,
        date: currentRoute.tripType === "Round Trip" ? `${pickupDate} to ${returnDate}` : pickupDate,
        guests: totalGuests,
        hotel: pickupLocation,
        name,
        email,
        phone,
        amount: totalPrice,
        totalAmount: totalPrice,
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        message: `Flight: ${flightNumber || "N/A"}. Children: ${childrenCount}. ${message}`,
      };

      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingPayload));

      try {
        document.cookie = `pendingBooking_${data.orderId}=${encodeURIComponent(
          JSON.stringify(bookingPayload)
        )}; path=/; max-age=86400; SameSite=Lax`;
      } catch (e) {
        console.warn("Could not write backup cookie", e);
      }

      window.location.href = data.paymentUrl;
    } catch (err) {
      setState("error");
      if (!error) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)} suppressHydrationWarning id="transfer-booking-form">
      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="tb-company">Company</label>
        <input
          id="tb-company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          suppressHydrationWarning
        />
      </div>

      {/* Select Route */}
      <div>
        <label className={labelCls} htmlFor="tb-route">
          <Car className="mr-1 inline h-3.5 w-3.5" /> Transfer Route
        </label>
        <div className="grid gap-2 sm:grid-cols-3">
          {TRANSFER_ROUTES.map((r) => {
            const isSelected = r.id === selectedRouteId;
            return (
              <button
                type="button"
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                className={cn(
                  "flex flex-col items-start rounded-xl border p-3 text-left transition",
                  isSelected
                    ? "border-jungle-600 bg-jungle-50 ring-2 ring-jungle-500/30 text-jungle-950 font-semibold"
                    : "border-ink/15 bg-sand-50 hover:bg-sand-100 text-ink"
                )}
              >
                <span className="text-xs font-bold text-coral-600">{r.tripType}</span>
                <span className="text-xs font-semibold leading-snug mt-0.5">{r.name}</span>
                <span className="mt-2 text-sm font-extrabold text-ink">${r.basePrice} USD</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Guest & Passenger Count */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span id="tb-adults-label" className={labelCls}>
            <Users className="mr-1 inline h-3.5 w-3.5" /> Passengers (1–4 included)
          </span>
          <div
            role="group"
            aria-labelledby="tb-adults-label"
            className="flex items-center justify-between rounded-xl border border-ink/15 bg-sand-50 px-2 py-1.5"
          >
            <button
              type="button"
              aria-label="Fewer passengers"
              onClick={() => setAdults((a) => Math.max(1, a - 1))}
              disabled={adults <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink shadow-sm transition hover:bg-jungle-50 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-base font-bold text-ink" aria-live="polite">
              {adults} {adults === 1 ? "Passenger" : "Passengers"}
            </span>
            <button
              type="button"
              aria-label="More passengers"
              onClick={() => setAdults((a) => Math.min(14, a + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink shadow-sm transition hover:bg-jungle-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <span id="tb-children-label" className={labelCls}>
            Children under 10 <span className="font-medium normal-case text-ink-faint">(Free)</span>
          </span>
          <div
            role="group"
            aria-labelledby="tb-children-label"
            className="flex items-center justify-between rounded-xl border border-ink/15 bg-sand-50 px-2 py-1.5"
          >
            <button
              type="button"
              aria-label="Fewer children"
              onClick={() => setChildrenCount((c) => Math.max(0, c - 1))}
              disabled={childrenCount <= 0}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink shadow-sm transition hover:bg-jungle-50 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-base font-bold text-ink" aria-live="polite">
              {childrenCount} {childrenCount === 1 ? "Child" : "Children"}
            </span>
            <button
              type="button"
              aria-label="More children"
              onClick={() => setChildrenCount((c) => Math.min(10, c + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink shadow-sm transition hover:bg-jungle-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="tb-pickup-date">
            <CalendarDays className="mr-1 inline h-3.5 w-3.5" /> Transfer Date
          </label>
          <input
            id="tb-pickup-date"
            type="date"
            min={today}
            required
            className={inputCls}
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </div>

        {currentRoute.tripType === "Round Trip" ? (
          <div>
            <label className={labelCls} htmlFor="tb-return-date">
              <CalendarDays className="mr-1 inline h-3.5 w-3.5" /> Return Date
            </label>
            <input
              id="tb-return-date"
              type="date"
              min={pickupDate || today}
              required
              className={inputCls}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label className={labelCls} htmlFor="tb-flight">
              Flight # <span className="font-medium normal-case text-ink-faint">(optional)</span>
            </label>
            <input
              id="tb-flight"
              className={inputCls}
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              placeholder="e.g. AA 1234 / UA 567"
            />
          </div>
        )}
      </div>

      {/* Contact Details */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="tb-name">
            Full name
          </label>
          <input
            id="tb-name"
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Jane Traveler"
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="tb-email">
            Email address
          </label>
          <input
            id="tb-email"
            type="email"
            className={inputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="tb-phone">
            Phone / WhatsApp <span className="font-medium normal-case text-ink-faint">(optional)</span>
          </label>
          <input
            id="tb-phone"
            className={inputCls}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 123 4567"
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="tb-pickup-loc">
            Hotel / Pickup Location
          </label>
          <input
            id="tb-pickup-loc"
            className={inputCls}
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
            placeholder="Placencia Resort, BZE Airport, AirBnB..."
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className={labelCls} htmlFor="tb-message">
          <MessageSquare className="mr-1 inline h-3.5 w-3.5" />
          Special Requests / Flight Details
          <span className="font-medium normal-case text-ink-faint"> (optional)</span>
        </label>
        <textarea
          id="tb-message"
          className={cn(inputCls, "min-h-[80px] resize-y")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Arrival time, luggage count, child seat needs..."
        />
      </div>

      {/* Price Summary Box */}
      <div className="rounded-2xl border border-jungle-200 bg-jungle-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-display font-bold text-jungle-900">Transfer Cost Summary</h4>
          <span className="rounded-full bg-jungle-200/60 px-2.5 py-0.5 text-xs font-bold text-jungle-800">
            {currentRoute.tripType}
          </span>
        </div>

        <div className="space-y-1.5 text-sm text-ink-soft">
          <div className="flex justify-between">
            <span>Base Transfer (1–4 persons):</span>
            <span className="font-semibold text-ink">${currentRoute.basePrice} USD</span>
          </div>

          {extraGuests > 0 && (
            <div className="flex justify-between text-coral-700">
              <span>{extraGuests} Extra Passengers (${currentRoute.extraGuestPrice} ea):</span>
              <span className="font-semibold">+${extraGuestFee} USD</span>
            </div>
          )}

          {childrenCount > 0 && (
            <div className="flex justify-between text-jungle-700">
              <span>{childrenCount} Children under 10:</span>
              <span className="font-semibold text-jungle-600">Free</span>
            </div>
          )}

          <hr className="my-2 border-jungle-200" />

          <div className="flex items-center justify-between text-lg font-extrabold text-jungle-900">
            <span>Total Payable:</span>
            <span className="text-2xl text-jungle-800">${totalPrice} USD</span>
          </div>
        </div>
      </div>

      {state === "error" && <p className="text-sm font-semibold text-coral-600">{error}</p>}

      <button
        type="submit"
        disabled={state === "loading"}
        className="btn btn-primary w-full py-3.5 px-3 text-sm sm:text-base justify-center gap-2 shadow-lg hover:shadow-xl whitespace-normal"
      >
        {state === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <CreditCard className="h-5 w-5 shrink-0" />
            <span>Pay & Book Transfer (${totalPrice} USD)</span>
            <Check className="h-4 w-4 shrink-0" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-ink-faint">
        🔒 Secure instant payment powered by Belize Bank. Official booking receipt is generated immediately upon payment.
      </p>

      {/* Terms & Conditions Modal */}
      {termsOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-x-0 bottom-0 top-20 z-[2147483647] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label="Close terms and conditions"
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
              onClick={() => setTermsOpen(false)}
            />
            <div className="relative flex max-h-[calc(100dvh-6rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-sand-50 shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-ink/10 bg-white px-6 py-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-coral-600">
                    Confirm Transfer Booking
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                    Terms & Conditions
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setTermsOpen(false)}
                  aria-label="Close"
                  className="rounded-xl p-2 text-ink-soft transition hover:bg-sand-100 hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto px-6 py-5">
                <p className="mb-5 text-sm text-ink-soft">
                  Please review and accept our ground transfer booking terms before continuing to secure payment.
                </p>
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
                  <span>
                    I have read and agree to the Terms & Conditions for all passengers in this transfer request.
                  </span>
                </label>
                <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/terms-and-conditions"
                    target="_blank"
                    className="text-center text-sm font-semibold text-jungle-700 underline hover:text-jungle-900"
                  >
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
                    {state === "loading" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      `Proceed to Pay $${totalPrice} USD`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </form>
  );
}
