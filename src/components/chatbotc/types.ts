import { Tour } from "@/data/tours";

export interface ChatMessage {
  role: "user" | "assistant";
  type: "text" | "recommendations";
  content?: string;
  tours?: Tour[];
}