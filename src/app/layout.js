import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/cookieWin";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "./components/Providers.js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Online Speisekarte erstellen | QR Menü Generator",
  description: "Erstelle digitale und kostenlose Speisekarten für dein Restaurant. Einfach, schnell und mobil per QR-Code nutzbar. Direkt im Browser ohne Extra Software",

  metadataBase: new URL("https://www.whatisonmymenu.com/"),

  openGraph: {
    title: "Online Speisekarte erstellen",
    description: "Erstelle digitale und Speisekarten für dein Restaurant.",
    url: "https://www.whatisonmymenu.com/",
    siteName: "WhatIsOnMyMenu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Online Speisekarte erstellen",
    description: "Digitale Menüs für Restaurants - einfach per QR-Code ohne extra Software.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "icon.svg",
  },

  robots: {
    index: true,
    follow: true,
  },
  other: {
    "google-adsense-account": "ca-pub-4153577229204032",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}


// Adsense ve