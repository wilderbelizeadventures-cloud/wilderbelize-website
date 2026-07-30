import { searchKnowledge } from "./search";
import { detectIntent } from "./intents";
import { recommendTours } from "./recommendations";
import { ChatResponse } from "./responseTypes";

export function getChatResponse(message: string): ChatResponse {
  const intent = detectIntent(message);

  if (intent === "greeting") {
    return {
      type: "text",
      reply:
        "Hi! 👋 I'm the Wilder Assistant.\n\nI can help you with tours, airport transfers, prices, travel tips and FAQs.",
    };
  }

  if (intent === "thanks") {
    return {
      type: "text",
      reply:
        "You're welcome! Let me know if you have any questions about Belize.",
    };
  }

  if (intent === "goodbye") {
    return {
      type: "text",
      reply:
        "Have an amazing trip to Belize! 🇧🇿",
    };
  }

  if (intent === "help") {
    return {
      type: "text",
      reply:
        "You can ask me about tours, airport transfers, prices, Belize travel tips and FAQs.",
    };
  }

  // STEP 1: Search the knowledge base first
  const results = searchKnowledge(message);

  if (results.length > 0) {
    return {
      type: "text",
      reply: results
        .map(item => `• ${item.title}\n${item.content}`)
        .join("\n\n"),
    };
  }

  // STEP 2: If nothing found, recommend tours
  const tours = recommendTours(message);

  if (tours.length > 0) {
    return {
      type: "recommendations",
      tours,
    };
  }

  // STEP 3: Nothing matched
  return {
    type: "text",
    reply:
      "Sorry, I couldn't find information about that. Try asking about our tours, transfers or Belize travel.",
  };
}