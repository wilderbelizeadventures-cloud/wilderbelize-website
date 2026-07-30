"use client";

import { useState } from "react";
import { ChatMessage } from "./types";
import TourCard from "./TourCard";

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      type: "text",
      content:
        "Hi! I'm the Wilder Assistant. Ask me about tours, transfers, or travel tips.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      type: "text",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.type === "text") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: data.reply,
          },
        ]);
      } else if (data.type === "recommendations") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "recommendations",
            tours: data.tours,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: "Something went wrong. Please try again.",
        },
      ]);
    }

    setInput("");
    setLoading(false);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "ml-auto max-w-[85%] rounded-2xl bg-jungle-700 px-4 py-3 text-sm whitespace-pre-wrap text-white"
                : "max-w-[95%]"
            }
          >
            {message.type === "text" && message.role === "assistant" && (
              <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm whitespace-pre-wrap text-gray-800">
                {message.content}
              </div>
            )}

            {message.type === "text" && message.role === "user" && (
              <>{message.content}</>
            )}

            {message.type === "recommendations" && (
              <div className="space-y-4">
                {message.tours?.map((tour) => (
                  <TourCard key={tour.slug} tour={tour} />
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
            Thinking...
          </div>
        )}
      </div>

      <div className="border-t bg-white p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask about tours, transfers..."
            className="flex-1 rounded-xl border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-jungle-600"
          />

          <button
            onClick={sendMessage}
            className="rounded-xl bg-jungle-700 px-4 py-2 text-sm font-medium text-white hover:bg-jungle-800"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}