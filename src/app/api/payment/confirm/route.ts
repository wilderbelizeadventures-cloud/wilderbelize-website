import { NextRequest, NextResponse } from "next/server";
import { getPendingBooking, BookingData } from "@/lib/bookingStore";

async function sendServerBookingEmail(bookingData: BookingData, refNumber: string): Promise<boolean> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_5wqhgs4";
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_kiyis9v";
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "WGd0VSHj1R6Ooa1Rm";
  const recipientEmail = process.env.NEXT_PUBLIC_RECIPIENT_EMAIL || "wilderbelizeadventures@gmail.com";

  if (!serviceId || !templateId || !publicKey) {
    console.warn("EmailJS credentials missing for server-side email dispatch.");
    return false;
  }

  const targetEmails = Array.from(new Set([recipientEmail, bookingData.email].filter(Boolean)));
  let successCount = 0;

  for (const targetEmail of targetEmails) {
    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://www.wilderbelizeadventures.com",
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: targetEmail,
            from_name: bookingData.name,
            from_email: bookingData.email,
            name: bookingData.name,
            user_name: bookingData.name,
            email: bookingData.email,
            user_email: bookingData.email,
            phone: bookingData.phone || "Not provided",

            // Dates
            date: bookingData.date || "To be scheduled",
            preferred_dates: bookingData.date || "To be scheduled",
            preferred_date: bookingData.date || "To be scheduled",

            // Guests / Travelers
            guests: String(bookingData.guests || 1),
            travelers: String(bookingData.guests || 1),
            number_of_guests: String(bookingData.guests || 1),

            // Locations
            hotel: bookingData.hotel || "Not specified",
            pickup_location: bookingData.hotel || "Not specified",
            pickup: bookingData.hotel || "Not specified",

            // Tour / Route / Package details
            tour_name: bookingData.tourName || "Wilder Belize Adventure",
            tour: bookingData.tourName || "Wilder Belize Adventure",
            package_name: bookingData.tourName || "Wilder Belize Adventure",
            route_stops: bookingData.tourName || "Wilder Belize Adventure",

            // Amounts & References
            total_amount: `$${bookingData.totalAmount || 0}`,
            amount: `$${bookingData.totalAmount || 0}`,
            order_id: refNumber,
            reference_number: refNumber,

            // Notes & Messages
            notes: bookingData.message || "None",
            message: `Tour/Package: ${bookingData.tourName || "Wilder Belize Adventure"}\nDate: ${bookingData.date || "To be scheduled"}\nGuests: ${bookingData.guests || 1}\nPickup: ${bookingData.hotel || "Not specified"}\nNotes: ${bookingData.message || "None"}`,
            reply_to: bookingData.email,
          },
        }),
      });

      if (response.ok) {
        successCount++;
        console.log(`[SERVER EMAIL SUCCESS] Sent booking confirmation to ${targetEmail} for order ${refNumber}`);
      } else {
        const errText = await response.text();
        console.error(`[SERVER EMAIL ERROR] Failed for ${targetEmail} (HTTP ${response.status}):`, errText);
      }
    } catch (err) {
      console.error(`[SERVER EMAIL EXCEPTION] Failed for ${targetEmail}:`, err);
    }
  }

  return successCount > 0;
}

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { orderId, fallbackBooking } = reqBody;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "OrderId is required." },
        { status: 400 }
      );
    }

    const bblBaseUrl = process.env.BBL_BASE_URL || "https://gateway.belizebank.com/payment/rest";
    const bblUsername = process.env.BBL_USERNAME || "Wilder_Belize_Adventures-api";
    const bblPassword = process.env.BBL_PASSWORD || "WilderB3lize2027!";
    const reqOrigin = req.headers.get("origin") || req.nextUrl.origin;
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes("localhost"))
      ? process.env.NEXT_PUBLIC_BASE_URL
      : (reqOrigin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");

    const isLocalhost = process.env.NODE_ENV === "development" || baseUrl.includes("localhost");

    let storedBooking = getPendingBooking(orderId) || fallbackBooking;

    if (!bblUsername || !bblPassword) {
      if (isLocalhost) {
        if (storedBooking) {
          void sendServerBookingEmail(storedBooking, orderId);
        }
        return NextResponse.json({
          success: true,
          orderStatus: 2,
          orderNumber: orderId,
          isSimulated: true,
          booking: storedBooking,
        });
      }
      return NextResponse.json(
        { success: false, message: "Payment gateway credentials missing." },
        { status: 500 }
      );
    }

    const params = new URLSearchParams();
    params.append("userName", bblUsername);
    params.append("password", bblPassword);
    params.append("orderId", orderId);

    const response = await fetch(`${bblBaseUrl}/getOrderStatusExtended.do`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const payment = await response.json();

    // orderStatus: 2 = Deposited/Approved, 1 = Approved/Authorized
    const isApproved = payment.orderStatus === 2 || payment.orderStatus === 1;

    if (!isApproved) {
      if (isLocalhost) {
        if (storedBooking) {
          void sendServerBookingEmail(storedBooking, orderId);
        }
        return NextResponse.json({
          success: true,
          orderStatus: 2,
          orderNumber: orderId,
          isSimulated: true,
          booking: storedBooking,
        });
      }

      return NextResponse.json({
        success: false,
        orderStatus: payment.orderStatus,
        errorMessage: payment.errorMessage || "Payment has not been completed.",
        payment,
      });
    }

    const refNumber = payment.orderNumber || orderId;

    // Send confirmation email server-side if booking details exist
    if (storedBooking) {
      void sendServerBookingEmail(storedBooking, refNumber);
    }

    return NextResponse.json({
      success: true,
      orderStatus: payment.orderStatus,
      orderNumber: refNumber,
      amount: payment.amount ? payment.amount / 100 : undefined,
      cardholderName: payment.cardAuthInfo?.cardholderName,
      booking: storedBooking,
      payment,
    });
  } catch (error) {
    console.error("Payment Confirmation API Error:", error);
    const reqOrigin = req.headers.get("origin") || req.nextUrl.origin;
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes("localhost"))
      ? process.env.NEXT_PUBLIC_BASE_URL
      : (reqOrigin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");

    if (process.env.NODE_ENV === "development" || baseUrl.includes("localhost")) {
      return NextResponse.json({
        success: true,
        orderStatus: 2,
        isSimulated: true,
      });
    }

    return NextResponse.json(
      { success: false, message: "Failed to confirm payment status with Belize Bank." },
      { status: 500 }
    );
  }
}