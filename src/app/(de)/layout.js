import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import CookieBanner from "../components/cookieWin";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "../components/Providers.js";
import LanguageSuggestionBanner from "../components/LanguageSuggestionBanner";

// Root-Layout der deutschen Seiten.
//
// (de) ist eine Route-Gruppe und erzeugt kein URL-Segment: /pricing bleibt
// /pricing. Die Gruppe existiert nur, damit Deutsch und die uebersetzten
// Sprachen je ein eigenes <html lang="..."> bekommen koennen — siehe
// src/app/(intl)/[locale]/layout.js.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Basis-Metadaten fuer alle deutschen Seiten. Titel, Beschreibung und das
// canonical setzt jede Seite in ihrer eigenen generateMetadata — hier steht
// nur, was fuer alle gilt.
export const metadata = {
  metadataBase: new URL("https://www.whatisonmymenu.com"),
  icons: {
    icon: "/icon.svg",
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
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <LanguageSuggestionBanner locale="de" />
          {children}
          <Analytics />
          <SpeedInsights />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
