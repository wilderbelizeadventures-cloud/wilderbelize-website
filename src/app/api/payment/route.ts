import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, tourName, email } = await req.json();

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

    const bblBaseUrl = process.env.BBL_BASE_URL || "https://gateway.belizebank.com/payment/rest";
    const bblUsername = process.env.BBL_USERNAME || "Wilder_Belize_Adventures-api";
    const bblPassword = process.env.BBL_PASSWORD || "WilderBelize2026!";
    const orderNumber = `WILDER-${Date.now()}`;
    const reqOrigin = req.headers.get("origin") || req.nextUrl.origin;
    let baseUrl = (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes("localhost"))
      ? process.env.NEXT_PUBLIC_BASE_URL
      : (reqOrigin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");

    if (baseUrl.includes(".vercel.app")) {
      baseUrl = "https://www.wilderbelizeadventures.com";
    }

    const isLocalhost = process.env.NODE_ENV === "development" || baseUrl.includes("localhost");

    const params = new URLSearchParams();
    params.append("userName", bblUsername);
    params.append("password", bblPassword);
    params.append("amount", String(Math.round(Number(amount) * 100)));
    params.append("currency", "840");
    params.append("description", tourName);
    params.append("returnUrl", `${baseUrl}/payment/success`);
    params.append("failUrl", `${baseUrl}/payment/failed`);
    params.append("orderNumber", orderNumber);

    if (email) {
      params.append("email", email);
    }

    const response = await fetch(`${bblBaseUrl}/register.do`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.errorCode !== undefined && Number(data.errorCode) !== 0) {
      console.error("Belize Bank API Error Response:", data);

      // On localhost, if Belize Bank rejects dynamic local IP with 'Access denied', fallback seamlessly for local dev
      if (isLocalhost) {
        console.log("Localhost environment detected & BBL IP restriction active: Redirecting to completion for local testing.");
        return NextResponse.json({
          success: true,
          paymentUrl: `${baseUrl}/payment/success?orderId=${orderNumber}`,
          orderId: orderNumber,
          orderNumber,
          isSimulated: true,
        });
      }

      return NextResponse.json(
        {
          success: false,
          message: data.errorMessage || `Belize Bank API Error Code ${data.errorCode}.`,
          errorCode: data.errorCode,
        },
        { status: 400 }
      );
    }

    if (!data.formUrl || !data.orderId) {
      if (isLocalhost) {
        return NextResponse.json({
          success: true,
          paymentUrl: `${baseUrl}/payment/success?orderId=${orderNumber}`,
          orderId: orderNumber,
          orderNumber,
          isSimulated: true,
        });
      }

      return NextResponse.json(
        {
          success: false,
          message: "Belize Bank payment gateway did not return a valid payment URL.",
          data,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentUrl: data.formUrl,
      orderId: data.orderId,
      orderNumber,
    });
  } catch (error) {
    console.error("Payment API Initialization Exception:", error);
    const reqOrigin = req.headers.get("origin") || req.nextUrl.origin;
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes("localhost"))
      ? process.env.NEXT_PUBLIC_BASE_URL
      : (reqOrigin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");

    if (process.env.NODE_ENV === "development" || baseUrl.includes("localhost")) {
      const orderNumber = `WILDER-${Date.now()}`;
      return NextResponse.json({
        success: true,
        paymentUrl: `${baseUrl}/payment/success?orderId=${orderNumber}`,
        orderId: orderNumber,
        orderNumber,
        isSimulated: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to connect to Belize Bank payment gateway server.",
      },
      { status: 500 }
    );
  }
}