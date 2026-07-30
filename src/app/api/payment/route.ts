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
    const bblUsername = process.env.BBL_USERNAME;
    const bblPassword = process.env.BBL_PASSWORD;
    const orderNumber = `WILDER-${Date.now()}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const isLocalhost = baseUrl.includes("localhost") || process.env.NODE_ENV === "development";

    if (!bblUsername || !bblPassword) {
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
          message: "Payment gateway credentials missing.",
        },
        { status: 500 }
      );
    }

    const params = new URLSearchParams();
    params.append("userName", bblUsername);
    params.append("password", bblPassword);
    params.append("amount", String(Math.round(Number(amount) * 100)));
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
      
      // If running locally and Belize Bank rejects dynamic home IP with 'Access denied', fallback gracefully to local test mode
      if (isLocalhost) {
        console.log("Localhost environment detected & BBL IP restriction active: Simulating payment checkout flow for local testing.");
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
          message: data.errorMessage || "Belize Bank returned an initialization error.",
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
          message: "Invalid response structure from Belize Bank payment gateway.",
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    if (baseUrl.includes("localhost")) {
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
        message: "Unable to connect to Belize Bank payment gateway server.",
      },
      { status: 500 }
    );
  }
}