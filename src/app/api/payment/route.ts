import { NextRequest, NextResponse } from "next/server";
import { storePendingBooking } from "@/lib/bookingStore";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log("=== [BBL PAYMENT DEBUG START] ===");

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    console.error("[Payment] Invalid JSON in request body.");
    return NextResponse.json(
      { success: false, message: "Invalid request body — expected JSON." },
      { status: 400 }
    );
  }

  try {
    const { amount, tourName, email, name, phone, date, guests, hotel, message } = body;

    // 1. Verify environment variables loading
    const bblBaseUrl = process.env.BBL_BASE_URL || "https://gateway.belizebank.com/payment/rest";
    const bblUsername = process.env.BBL_USERNAME || "Wilder_Belize_Adventures-api";
    const bblPassword = process.env.BBL_PASSWORD || "WilderB3lize2027!";
    const bblMid = process.env.BBL_MID || "Not set";
    const bblTid = process.env.BBL_TID || "Not set";

    const envCheck = {
      hasBaseUrl: !!process.env.BBL_BASE_URL,
      baseUrl: bblBaseUrl,
      hasUsername: !!process.env.BBL_USERNAME,
      usernameValue: bblUsername ? `${bblUsername.substring(0, 4)}***` : "MISSING",
      hasPassword: !!process.env.BBL_PASSWORD,
      passwordLength: bblPassword ? bblPassword.length : 0,
      hasMid: !!process.env.BBL_MID,
      midValue: bblMid,
      hasTid: !!process.env.BBL_TID,
      tidValue: bblTid,
      nodeEnv: process.env.NODE_ENV,
    };

    console.log("Environment Variables Check:", JSON.stringify(envCheck, null, 2));

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid payment amount is required." },
        { status: 400 }
      );
    }

    if (!tourName) {
      return NextResponse.json(
        { success: false, message: "Tour name is required." },
        { status: 400 }
      );
    }

    if (!bblUsername || !bblPassword) {
      console.error("CRITICAL ERROR: Belize Bank API credentials missing.");
      return NextResponse.json(
        {
          success: false,
          message: "Belize Bank API credentials (BBL_USERNAME/BBL_PASSWORD) missing in environment variables.",
          envCheck,
        },
        { status: 500 }
      );
    }

    const orderNumber = `WILDER-${Date.now()}`;
    const reqOrigin = req.headers.get("origin") || req.nextUrl.origin;
    let baseUrl = reqOrigin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (baseUrl.includes(".vercel.app")) {
      baseUrl = "https://www.wilderbelizeadventures.com";
    }

    const amountInCents = String(Math.round(Number(amount) * 100));
    const targetUrl = `${bblBaseUrl}/register.do`;

    // 2. Construct Payload according to Belize Bank Integration Guide v1.3 Page 11
    const params = new URLSearchParams();
    params.append("userName", bblUsername);
    params.append("password", bblPassword);
    params.append("amount", amountInCents);
    params.append("description", String(tourName || "Wilder Belize Adventure"));
    params.append("returnUrl", `${baseUrl}/payment/success`);
    params.append("orderNumber", orderNumber);
    params.append("currency", process.env.BBL_CURRENCY || "840");

    if (email) {
      params.append("email", String(email));
    }

    // Masked payload for logging
    const maskedParams = new URLSearchParams(params.toString());
    maskedParams.set("password", "********");

    console.log(`Calling Belize Bank Authorization Endpoint: ${targetUrl}`);
    console.log(`Request Method: POST`);
    console.log(`Request Content-Type: application/x-www-form-urlencoded`);
    console.log(`Request Payload (Masked): ${maskedParams.toString()}`);

    // 3. Send HTTP POST request to Belize Bank Gateway
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: params.toString(),
    });

    const responseStatus = response.status;
    const responseStatusText = response.statusText;
    const rawResponseBody = await response.text();

    console.log(`Belize Bank HTTP Status: ${responseStatus} ${responseStatusText}`);
    console.log(`Belize Bank Raw Response Body: ${rawResponseBody}`);

    let data: any = {};
    try {
      data = JSON.parse(rawResponseBody);
    } catch (parseErr) {
      console.error("Failed to parse JSON response from Belize Bank:", parseErr);
      data = { rawText: rawResponseBody };
    }

    console.log("=== [BBL PAYMENT DEBUG END] ===");

    // 4. Inspect Gateway Error Response
    if ((data.errorCode !== undefined && Number(data.errorCode) !== 0) || !data.formUrl || !data.orderId) {
      console.error("Belize Bank API Response/Error Received:", data);

      const isSandboxMode = bblBaseUrl.includes("sandbox.belizebank.com") || process.env.NODE_ENV === "development" || baseUrl.includes("localhost");

      if (isSandboxMode) {
        console.log("[SANDBOX TEST MODE] Generating simulated payment transaction link for testing...");
        const sandboxOrderId = orderNumber;
        storePendingBooking({
          orderId: sandboxOrderId,
          orderNumber,
          name: typeof name === "string" ? name : "Valued Guest",
          email: typeof email === "string" ? email : "",
          phone: typeof phone === "string" ? phone : "",
          tourName: typeof tourName === "string" ? tourName : "Wilder Belize Adventure",
          date: typeof date === "string" ? date : "",
          guests: Number(guests) || 1,
          hotel: typeof hotel === "string" ? hotel : "",
          message: typeof message === "string" ? message : "",
          totalAmount: Number(amount) || 0,
          createdAt: Date.now(),
        });

        return NextResponse.json({
          success: true,
          paymentUrl: `${baseUrl}/payment/success?orderId=${sandboxOrderId}`,
          orderId: sandboxOrderId,
          orderNumber,
          isSandboxMode: true,
          message: "Sandbox payment simulation initiated.",
        });
      }

      return NextResponse.json(
        {
          success: false,
          message: data.errorMessage || `Belize Bank Gateway returned Error Code ${data.errorCode || "Unknown"}.`,
          errorCode: data.errorCode,
          errorMessage: data.errorMessage,
          rawResponse: data,
          targetUrl,
          httpStatus: responseStatus,
          envCheck,
          executionTimeMs: Date.now() - startTime,
        },
        { status: 400 }
      );
    }

    if (data.orderId) {
      storePendingBooking({
        orderId: data.orderId,
        orderNumber,
        name: typeof name === "string" ? name : "Valued Guest",
        email: typeof email === "string" ? email : "",
        phone: typeof phone === "string" ? phone : "",
        tourName: typeof tourName === "string" ? tourName : "Wilder Belize Adventure",
        date: typeof date === "string" ? date : "",
        guests: Number(guests) || 1,
        hotel: typeof hotel === "string" ? hotel : "",
        message: typeof message === "string" ? message : "",
        totalAmount: Number(amount) || 0,
        createdAt: Date.now(),
      });
    }

    return NextResponse.json({
      success: true,
      paymentUrl: data.formUrl,
      orderId: data.orderId,
      orderNumber,
      rawResponse: data,
      targetUrl,
      httpStatus: responseStatus,
      envCheck,
      executionTimeMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error("Payment API Initialization Exception:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to connect to Belize Bank payment gateway server.",
        errorDetails: String(error),
      },
      { status: 500 }
    );
  }
}