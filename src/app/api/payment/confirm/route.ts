import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "OrderId is required." },
        { status: 400 }
      );
    }

    const bblBaseUrl = process.env.BBL_BASE_URL || "https://gateway.belizebank.com/payment/rest";
    const bblUsername = process.env.BBL_USERNAME;
    const bblPassword = process.env.BBL_PASSWORD;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const isLocalhost = baseUrl.includes("localhost") || process.env.NODE_ENV === "development";

    if (!bblUsername || !bblPassword) {
      if (isLocalhost) {
        return NextResponse.json({
          success: true,
          orderStatus: 2,
          orderNumber: orderId,
          isSimulated: true,
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
        return NextResponse.json({
          success: true,
          orderStatus: 2,
          orderNumber: orderId,
          isSimulated: true,
        });
      }

      return NextResponse.json({
        success: false,
        orderStatus: payment.orderStatus,
        errorMessage: payment.errorMessage || "Payment has not been completed.",
        payment,
      });
    }

    return NextResponse.json({
      success: true,
      orderStatus: payment.orderStatus,
      orderNumber: payment.orderNumber || orderId,
      amount: payment.amount ? payment.amount / 100 : undefined,
      cardholderName: payment.cardAuthInfo?.cardholderName,
      payment,
    });
  } catch (error) {
    console.error("Payment Confirmation API Error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    if (baseUrl.includes("localhost")) {
      return NextResponse.json({
        success: true,
        orderStatus: 2,
        isSimulated: true,
      });
    }

    return NextResponse.json(
      { success: false, message: "Failed to confirm payment status." },
      { status: 500 }
    );
  }
}