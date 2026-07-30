import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { company } from "@/data/site";
import ChatWidget from "@/components/chatbotc/ChatWidget";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wilderbelizeadventures.com"),
  title: {
    default: "Wilder Belize Adventures — Tours & Excursions in Placencia, Belize",
    template: "%s · Wilder Belize Adventures",
  },
  icons: {
    icon: "/vercel.svg",
  },
  description:
    "Family-run adventure tours from Placencia, Belize. ATV jungle rides, waterfalls, cave tubing, zip lining, Maya ruins, wildlife and more — led by born-and-raised Belizean guides.",
  keywords: [
    "Belize tours",
    "Placencia tours",
    "Belize adventure",
    "cave tubing Belize",
    "ATV Belize",
    "Maya ruins",
    "zip lining Belize",
    "Wilder Belize Adventures",
  ],
  openGraph: {
    title: "Wilder Belize Adventures — Roam Belize, the Wilder Way",
    description:
      "Jungle waterfalls, Maya temples, caves and the Caribbean — small-group adventure tours from Placencia, Belize.",
    type: "website",
    locale: "en_US",
    siteName: "Wilder Belize Adventures",
    images: [
      {
        url: "/images/heroes/hero-coast.jpg",
        width: 1200,
        height: 630,
        alt: "Wilder Belize Adventures — the Caribbean coast at Placencia, Belize",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wilder Belize Adventures — Roam Belize, the Wilder Way",
    description:
      "Jungle waterfalls, Maya temples, caves and the Caribbean — small-group adventure tours from Placencia, Belize.",
    images: ["/images/heroes/hero-coast.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a3a2a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: company.name,
    description:
      "Family-run adventure tour operator in Placencia, Belize offering jungle, cave, waterfall, Maya ruin and wildlife tours.",
    url: "https://wilderbelizeadventures.com",
    telephone: company.phones,
    email: company.emails[0],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Placencia Village",
      addressRegion: "Stann Creek",
      addressCountry: "BZ",
    },
    areaServed: "Belize",
    sameAs: [company.socials.facebook, company.socials.instagram, company.socials.tripadvisor],
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
