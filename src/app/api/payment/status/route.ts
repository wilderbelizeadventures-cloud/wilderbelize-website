import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();

  const params = new URLSearchParams();

  params.append("userName", process.env.BBL_USERNAME!);

  params.append("password", process.env.BBL_PASSWORD!);

  params.append("orderId", orderId);

  const response = await fetch(
    `${process.env.BBL_BASE_URL}/getOrderStatusExtended.do`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  const data = await response.json();

  return NextResponse.json(data);
}