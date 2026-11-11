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
  // Seiten setzen nur noch ihren eigenen Teil ("Preise & Tarife"), die Marke
  // haengt das Template an. Wer den Titel komplett selbst bestimmen will
  // (Startseite: Keyword-Titel ohne Marke), nutzt title: { absolute: ... }.
  title: {
    default: "WhatIsOnMyMenu – Digitale Speisekarte per QR-Code",
    template: "%s | WhatIsOnMyMenu",
  },
  // Standard-Vorschau fuer alle Seiten ohne eigenes openGraph. Das Bild kommt
  // aus opengraph-image.js in diesem Ordner. Ohne openGraph.title nehmen
  // Facebook, LinkedIn & Co. den <title> der Seite.
  openGraph: {
    siteName: "WhatIsOnMyMenu",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  // Favicon, Apple-Icon und SVG-Icon kommen aus den Dateien in src/app/
  // (favicon.ico, icon.svg, apple-icon.png). Hier bewusst kein icons-Feld:
  // ein explizites icons-Objekt ueberschreibt die Datei-Konvention und
  // erzeugt nur einen einzigen <link> ohne type und sizes.
  manifest: "/manifest.json",
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
          <CookieBanner locale="de" />
        </Providers>
      </body>
    </html>
  );
}
