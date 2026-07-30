import { Tour } from "@/data/tours";

export type ChatResponse =
  | {
      type: "text";
      reply: string;
    }
  | {
      type: "recommendations";
      tours: Tour[];
    };