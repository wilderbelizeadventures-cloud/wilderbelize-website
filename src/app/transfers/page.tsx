import type { Metadata } from "next";
import { site } from "@/data/site";
import { TransferPageContent } from "@/components/TransferPageContent";

export const metadata: Metadata = {
  title: "Private Ground Transfers",
  description: site.transfer.description,
};

export default function TransfersPage() {
  return <TransferPageContent siteTransfer={site.transfer} />;
}
