"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-jungle-700 text-white shadow-xl transition hover:scale-105 hover:bg-jungle-800"
        aria-label="Open chatbot"
        suppressHydrationWarning
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-jungle-700 px-5 py-4 text-white">
            <div>
              <h2 className="font-semibold">Wilder Assistant</h2>
              <p className="text-xs text-white/80">
                Ask me about tours, transfers or FAQs.
              </p>
            </div>

            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chatbot">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatWindow />
          </div>
        </div>
      )}
    </>
  );
}