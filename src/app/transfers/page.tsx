import type { Metadata } from "next";
import { site } from "@/data/site";
import { TransferPageContent } from "@/components/TransferPageContent";

export const metadata: Metadata = {
  title: "Private Ground Transfers",
  description: site.transfer.description,
  alternates: {
    canonical: "https://www.wilderbelizeadventures.com/transfers",
  },
};

export default function TransfersPage() {
  return <TransferPageContent siteTransfer={site.transfer} />;
}
