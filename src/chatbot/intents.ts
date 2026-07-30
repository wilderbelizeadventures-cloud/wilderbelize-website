export type Intent =
  | "greeting"
  | "thanks"
  | "goodbye"
  | "help"
  | "search";

export function detectIntent(message: string): Intent {
  const text = message.trim().toLowerCase();

  if (
    [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
    ].includes(text)
  ) {
    return "greeting";
  }

  if (["thanks", "thank you", "thx"].includes(text)) {
    return "thanks";
  }

  if (["bye", "goodbye", "see you"].includes(text)) {
    return "goodbye";
  }

  if (
    [
      "help",
      "what can you do",
      "who are you",
    ].includes(text)
  ) {
    return "help";
  }

  return "search";
}