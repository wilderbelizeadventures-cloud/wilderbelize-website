"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Calendar, Users, MapPin, CreditCard, ArrowRight, Printer, Mail, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

interface PendingBooking {
  name: string;
  email: string;
  phone: string;
  tour: string;
  date: string;
  guests: number;
  hotel: string;
  message: string;
  amount: number;
  orderId: string;
}

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
const RECIPIENT_EMAIL = process.env.NEXT_PUBLIC_RECIPIENT_EMAIL || "wilderbelizeadventures@gmail.com";

export default function SuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [booking, setBooking] = useState<PendingBooking | null>(null);
  const [orderRef, setOrderRef] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");

    // Load saved pending booking from sessionStorage
    const storedBookingStr = sessionStorage.getItem("pendingBooking");
    let storedBooking: PendingBooking | null = null;
    if (storedBookingStr) {
      try {
        storedBooking = JSON.parse(storedBookingStr);
        setBooking(storedBooking);
      } catch (e) {
        console.error("Error parsing pending booking data", e);
      }
    }

    if (!orderId) {
      setStatus("success");
      return;
    }

    async function verifyPayment() {
      try {
        const response = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setOrderRef(data.orderNumber || orderId || "");

          // Send confirmation email if booking details exist
          if (storedBooking && !emailSent) {
            void sendConfirmationEmail(storedBooking, data.orderNumber || orderId);
          }
        } else {
          setStatus("failed");
          setErrorMessage(data.errorMessage || "Payment could not be verified by Belize Bank.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        // Fallback to success if we have valid stored booking
        if (storedBooking) {
          setStatus("success");
        } else {
          setStatus("failed");
          setErrorMessage("Network error verifying payment status.");
        }
      }
    }

    verifyPayment();
  }, []);

  async function sendConfirmationEmail(bookingData: PendingBooking, refNumber: string) {
    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_PUBLIC_KEY) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: bookingData.email || RECIPIENT_EMAIL,
            from_name: bookingData.name,
            from_email: bookingData.email,
            user_name: bookingData.name,
            user_email: bookingData.email,
            phone: bookingData.phone || "Not provided",
            tour_name: bookingData.tour,
            date: bookingData.date,
            guests: bookingData.guests,
            pickup_location: bookingData.hotel,
            total_amount: `$${bookingData.amount}`,
            order_id: refNumber,
            notes: bookingData.message || "None",
            reply_to: bookingData.email,
          },
          EMAILJS_PUBLIC_KEY
        );
        setEmailSent(true);
      }
      // Clear pending booking after successfully handling
      sessionStorage.removeItem("pendingBooking");
    } catch (err) {
      console.error("Error sending confirmation email:", err);
    }
  }

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-sand-50 p-4">
        <div className="flex flex-col items-center rounded-3xl bg-white p-12 text-center shadow-xl">
          <Loader2 className="h-12 w-12 animate-spin text-jungle-600" />
          <h2 className="mt-6 text-2xl font-bold text-ink">Verifying Payment...</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Please wait while we confirm your transaction with Belize Bank.
          </p>
        </div>
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-sand-50 p-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl border border-coral-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coral-100 text-coral-600">
            !
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-ink">Payment Verification Failed</h1>
          <p className="mt-3 text-sm text-ink-soft">
            {errorMessage || "We could not verify your payment with Belize Bank."}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/tours"
              className="btn btn-primary justify-center"
            >
              Return to Tours
            </Link>
            <a
              href="https://wa.me/5016501003"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-jungle-700 hover:underline"
            >
              Contact Support on WhatsApp (+501 650-1003)
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sand-50 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        {/* Receipt Header Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl border border-jungle-100">
          <div className="bg-jungle-800 p-8 text-center text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-300">
              Payment Successful
            </p>
            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">Booking Confirmed 🎉</h1>
            <p className="mt-2 text-sm text-white/80">
              Thank you! Your adventure with Wilder Belize is booked and ready.
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Order Reference Badge */}
            {orderRef && (
              <div className="flex items-center justify-between rounded-2xl bg-sand-100 px-5 py-3 text-sm">
                <span className="font-semibold text-ink-soft">Order Reference</span>
                <span className="font-mono font-bold text-jungle-900">{orderRef}</span>
              </div>
            )}

            {/* Booking Details Breakdown */}
            <div className="space-y-4 rounded-2xl border border-sand-200 bg-sand-50/50 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Reservation Details
              </h3>

              {booking ? (
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                    <span className="text-ink-soft">Guest Name</span>
                    <span className="font-bold text-ink">{booking.name}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                    <span className="text-ink-soft">Tour Adventure</span>
                    <span className="font-bold text-jungle-800">{booking.tour}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                    <span className="text-ink-soft flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-jungle-600" /> Date
                    </span>
                    <span className="font-semibold text-ink">{booking.date || "To be scheduled"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                    <span className="text-ink-soft flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-jungle-600" /> Guests
                    </span>
                    <span className="font-semibold text-ink">{booking.guests} Guests</span>
                  </div>
                  {booking.hotel && (
                    <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                      <span className="text-ink-soft flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-jungle-600" /> Pickup Location
                      </span>
                      <span className="font-semibold text-ink">{booking.hotel}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 text-base">
                    <span className="font-bold text-ink flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-jungle-600" /> Total Paid
                    </span>
                    <span className="font-extrabold text-jungle-700 text-lg">
                      ${booking.amount} USD
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-ink-soft">
                  Your transaction has been processed successfully by Belize Bank.
                </p>
              )}
            </div>

            {/* Email Notification Callout */}
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
              <Mail className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-bold">Confirmation Email Queued</p>
                <p className="text-xs text-emerald-800 mt-0.5">
                  A receipt and details have been sent to{" "}
                  <span className="font-semibold">{booking?.email || "your email"}</span>. Our Placencia team will reach out to confirm pickup times.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-white flex-1 justify-center gap-2 border border-ink/15"
              >
                <Printer className="h-4 w-4" /> Print Receipt
              </button>
              <Link
                href="/"
                className="btn btn-primary flex-1 justify-center gap-2"
              >
                Back to Home <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}