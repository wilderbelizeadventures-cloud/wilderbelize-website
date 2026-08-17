import { NextRequest, NextResponse } from "next/server";
import { getPendingBooking, BookingData } from "@/lib/bookingStore";

interface EmailResult {
  success: boolean;
  wilderNotified: boolean;
  customerNotified: boolean;
}

async function sendServerBookingEmail(
  bookingData: BookingData,
  refNumber: string
): Promise<EmailResult> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const recipientEmail =
    process.env.NEXT_PUBLIC_RECIPIENT_EMAIL ||
    process.env.RECIPIENT_EMAIL ||
    "wilderbelizeadventures@gmail.com";

  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      "[SERVER EMAIL WARN] EmailJS environment variables (NEXT_PUBLIC_EMAILJS_SERVICE_ID / NEXT_PUBLIC_EMAILJS_TEMPLATE_ID / NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) are missing."
    );
    return { success: false, wilderNotified: false, customerNotified: false };
  }

  let wilderNotified = false;
  let customerNotified = false;

  // 1. Authoritative Primary Notification to Wilder Belize Adventures
  try {
    const responseWilder = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
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
          to_email: recipientEmail,
          recipient_email: recipientEmail,
          admin_email: recipientEmail,
          wilder_email: recipientEmail,
          from_name: bookingData.name || "Guest",
          from_email: bookingData.email || recipientEmail,
          name: bookingData.name || "Guest",
          user_name: bookingData.name || "Guest",
          email: bookingData.email || "Not provided",
          user_email: bookingData.email || "Not provided",
          phone: bookingData.phone || "Not provided",

          date: bookingData.date || "To be scheduled",
          preferred_dates: bookingData.date || "To be scheduled",
          preferred_date: bookingData.date || "To be scheduled",

          guests: String(bookingData.guests || 1),
          travelers: String(bookingData.guests || 1),
          number_of_guests: String(bookingData.guests || 1),

          hotel: bookingData.hotel || "Not specified",
          pickup_location: bookingData.hotel || "Not specified",
          pickup: bookingData.hotel || "Not specified",

          tour_name: bookingData.tourName || "Wilder Belize Adventure",
          tour: bookingData.tourName || "Wilder Belize Adventure",
          package_name: bookingData.tourName || "Wilder Belize Adventure",
          route_stops: bookingData.tourName || "Wilder Belize Adventure",

          total_amount: `$${bookingData.totalAmount || 0}`,
          amount: `$${bookingData.totalAmount || 0}`,
          order_id: refNumber,
          reference_number: refNumber,

          notes: bookingData.message || "None",
          message: `Tour/Package: ${bookingData.tourName || "Wilder Belize Adventure"}\nDate: ${bookingData.date || "To be scheduled"}\nGuests: ${bookingData.guests || 1}\nPickup: ${bookingData.hotel || "Not specified"}\nNotes: ${bookingData.message || "None"}`,
          reply_to: bookingData.email || recipientEmail,
        },
      }),
    });

    if (responseWilder.ok) {
      wilderNotified = true;
      console.log(`[SERVER EMAIL SUCCESS] Primary notification sent to Wilder (${recipientEmail}) for order ${refNumber}`);
    } else {
      const errText = await responseWilder.text();
      console.error(`[SERVER EMAIL ERROR] Failed sending to Wilder (${recipientEmail}):`, errText);
    }
  } catch (err) {
    console.error(`[SERVER EMAIL EXCEPTION] Failed sending to Wilder:`, err);
  }

  // 2. Separate Customer Receipt (only if customer email is present and distinct from Wilder email)
  if (bookingData.email && bookingData.email.toLowerCase() !== recipientEmail.toLowerCase()) {
    try {
      const responseCustomer = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
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
            to_email: bookingData.email,
            recipient_email: bookingData.email,
            from_name: "Wilder Belize Adventures",
            from_email: recipientEmail,
            name: bookingData.name || "Guest",
            user_name: bookingData.name || "Guest",
            email: bookingData.email,
            user_email: bookingData.email,
            phone: bookingData.phone || "Not provided",

            date: bookingData.date || "To be scheduled",
            preferred_dates: bookingData.date || "To be scheduled",
            preferred_date: bookingData.date || "To be scheduled",

            guests: String(bookingData.guests || 1),
            travelers: String(bookingData.guests || 1),
            number_of_guests: String(bookingData.guests || 1),

            hotel: bookingData.hotel || "Not specified",
            pickup_location: bookingData.hotel || "Not specified",
            pickup: bookingData.hotel || "Not specified",

            tour_name: bookingData.tourName || "Wilder Belize Adventure",
            tour: bookingData.tourName || "Wilder Belize Adventure",
            package_name: bookingData.tourName || "Wilder Belize Adventure",
            route_stops: bookingData.tourName || "Wilder Belize Adventure",

            total_amount: `$${bookingData.totalAmount || 0}`,
            amount: `$${bookingData.totalAmount || 0}`,
            order_id: refNumber,
            reference_number: refNumber,

            notes: bookingData.message || "None",
            message: `Thank you for booking with Wilder Belize Adventures!\n\nOrder Reference: ${refNumber}\nTour: ${bookingData.tourName || "Wilder Belize Adventure"}\nDate: ${bookingData.date || "To be scheduled"}\nGuests: ${bookingData.guests || 1}\nPickup: ${bookingData.hotel || "Not specified"}\nTotal Paid: $${bookingData.totalAmount || 0} USD`,
            reply_to: recipientEmail,
          },
        }),
      });

      if (responseCustomer.ok) {
        customerNotified = true;
        console.log(`[SERVER EMAIL SUCCESS] Customer receipt sent to ${bookingData.email} for order ${refNumber}`);
      } else {
        const errText = await responseCustomer.text();
        console.error(`[SERVER EMAIL ERROR] Failed sending customer receipt to ${bookingData.email}:`, errText);
      }
    } catch (err) {
      console.error(`[SERVER EMAIL EXCEPTION] Failed sending customer receipt:`, err);
    }
  }

  return {
    success: wilderNotified,
    wilderNotified,
    customerNotified,
  };
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
    const bblUsername = process.env.BBL_USERNAME;
    const bblPassword = process.env.BBL_PASSWORD;
    const reqOrigin = req.headers.get("origin") || req.nextUrl.origin;
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes("localhost"))
      ? process.env.NEXT_PUBLIC_BASE_URL
      : (reqOrigin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");

    const isLocalhost = process.env.NODE_ENV === "development" || baseUrl.includes("localhost");

    let storedBooking = getPendingBooking(orderId) || fallbackBooking;

    if (!bblUsername || !bblPassword) {
      if (isLocalhost) {
        let emailResult = { success: false, wilderNotified: false, customerNotified: false };
        if (storedBooking) {
          emailResult = await sendServerBookingEmail(storedBooking, orderId);
        }
        return NextResponse.json({
          success: true,
          orderStatus: 2,
          orderNumber: orderId,
          isSimulated: true,
          booking: storedBooking,
          emailResult,
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
        let emailResult = { success: false, wilderNotified: false, customerNotified: false };
        if (storedBooking) {
          emailResult = await sendServerBookingEmail(storedBooking, orderId);
        }
        return NextResponse.json({
          success: true,
          orderStatus: 2,
          orderNumber: orderId,
          isSimulated: true,
          booking: storedBooking,
          emailResult,
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

    // Send primary authoritative email server-side
    let emailResult = { success: false, wilderNotified: false, customerNotified: false };
    if (storedBooking) {
      emailResult = await sendServerBookingEmail(storedBooking, refNumber);
    }

    return NextResponse.json({
      success: true,
      orderStatus: payment.orderStatus,
      orderNumber: refNumber,
      amount: payment.amount ? payment.amount / 100 : undefined,
      cardholderName: payment.cardAuthInfo?.cardholderName,
      booking: storedBooking,
      emailResult,
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