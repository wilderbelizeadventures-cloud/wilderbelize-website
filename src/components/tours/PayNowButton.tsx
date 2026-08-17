"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";

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
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to start payment.");
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

      window.location.href = data.paymentUrl;
    } catch (err) {
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
      {error ? <p className="mt-3 text-sm font-semibold text-coral-600 text-center">{error}</p> : null}
    </>
  );
}
