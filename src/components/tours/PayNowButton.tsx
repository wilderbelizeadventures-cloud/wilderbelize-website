"use client";

import { useState } from "react";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";

interface PayNowButtonProps {
  tourName: string;
  amount: number;
  guests?: number;
  label?: string;
  className?: string;
}

export function PayNowButton({
  tourName,
  amount,
  guests = 1,
  label = "Pay & Book Now",
  className,
}: PayNowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = amount * guests;

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    console.log("=== [PAY NOW BUTTON CLICKED] ===", { tourName, amount: totalAmount, guests });

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourName,
          amount: totalAmount,
          guests,
        }),
      });

      const data = await res.json();
      console.log("=== [PAYMENT API RESPONSE RECEIVED] ===", data);

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Payment failed (Status: ${res.status}).`);
      }

      const bookingPayload = {
        tour: tourName,
        tourName: tourName,
        guests,
        amount: totalAmount,
        totalAmount: totalAmount,
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        name: "Valued Guest",
        email: "",
        phone: "",
        date: "To be scheduled",
        hotel: "Not specified",
        message: "Booked via Direct Pay Now button",
        termsAccepted: true,
      };

      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingPayload));

      try {
        document.cookie = `pendingBooking_${data.orderId}=${encodeURIComponent(
          JSON.stringify(bookingPayload)
        )}; path=/; max-age=86400; SameSite=Lax`;
      } catch (e) {
        console.warn("Could not write backup cookie", e);
      }

      console.log(`=== [PAYMENT REDIRECT] Redirecting to ${data.paymentUrl} ===`);
      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error("=== [PAY NOW BUTTON EXCEPTION] ===", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={
          className ??
          "mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-jungle-700 px-6 py-4 text-lg font-semibold text-white transition hover:bg-jungle-800 disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Redirecting to Belize Bank...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" /> {label} (${totalAmount})
          </>
        )}
      </button>
      {error ? (
        <div className="mt-3 rounded-2xl border-2 border-coral-400 bg-coral-50 p-4 text-sm font-bold text-coral-900 shadow-md flex items-start gap-2 text-left">
          <AlertCircle className="h-5 w-5 shrink-0 text-coral-600 mt-0.5" />
          <div>
            <p className="font-extrabold text-coral-900">Payment Alert</p>
            <p className="text-xs font-medium text-coral-800 mt-0.5">{error}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
