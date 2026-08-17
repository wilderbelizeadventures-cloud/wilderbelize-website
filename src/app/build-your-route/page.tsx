import type { Metadata } from "next";
import { RouteBuilder } from "@/components/RouteBuilder";

export const metadata: Metadata = {
  title: "Build Your Route",
  description: "Build a custom Belize adventure route with Wilder Belize Adventures.",
  alternates: {
    canonical: "https://www.wilderbelizeadventures.com/build-your-route",
  },
};

export default function BuildYourRoutePage() {
  return <RouteBuilder />;
}
