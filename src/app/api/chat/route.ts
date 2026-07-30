import { NextRequest, NextResponse } from "next/server";
import { getChatResponse } from "@/chatbot/chatbotService";

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  return NextResponse.json(getChatResponse(message));
}