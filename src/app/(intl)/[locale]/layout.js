import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import CookieBanner from "../../components/cookieWin";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "../../components/Providers.js";
import LanguageSuggestionBanner from "../../components/LanguageSuggestionBanner";
import { locales, ogLocales } from "@/i18n/config";

// Root-Layout aller uebersetzten oeffentlichen Seiten — in JEDER Sprache.
//
// (intl) ist eine Route-Gruppe (kein URL-Segment), [locale] dagegen erzeugt das
// Praefix: /de/pricing, /fr/pricing, ... Englisch liegt intern ebenfalls hier
// (/en/pricing), wird aber praefixlos ausgeliefert: die Middleware schreibt
// /pricing auf /en/pricing um (resolveLocaleRoute in src/i18n/config.js).
// Eine neue Sprache braucht nur einen Eintrag in src/i18n/config.js und eine
// Woerterbuch-Datei, keine einzige neue Seite.
//
// Nicht uebersetzte Seiten (Dashboards, Rechtsseiten) laufen ueber (de).

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Praerendert /en (= /), /de, ... beim Build. Google bekommt fertiges HTML statt
// einer leeren Huelle, die erst per JavaScript befuellt wird.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Nur die oben erzeugten Sprachen werden ausgeliefert. Alles andere — etwa ein
// Tippfehler wie /pricingg — faellt damit automatisch auf 404, statt vom
// dynamischen [locale]-Segment eingefangen zu werden.
export const dynamicParams = false;

// Gegenstueck zu den Basis-Metadaten in src/app/(de)/layout.js — Titel-Template,
// Standard-Vorschau (Bild aus opengraph-image.js hier im Ordner) und Twitter-Karte.
export async function generateMetadata({ params }) {
  const { locale } = await params;

  return {
    metadataBase: new URL("https://www.whatisonmymenu.com"),
    title: {
      default: locale === "de" ? "WhatIsOnMyMenu – Digitale Speisekarte per QR-Code" : "WhatIsOnMyMenu – QR Code Menus for Restaurants",
      template: "%s | WhatIsOnMyMenu",
    },
    openGraph: {
      siteName: "WhatIsOnMyMenu",
      locale: ogLocales[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
    manifest: "/manifest.json",
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "google-adsense-account": "ca-pub-4153577229204032",
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function IntlRootLayout({ children, params }) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <LanguageSuggestionBanner locale={locale} />
          {children}
          <Analytics />
          <SpeedInsights />
          <CookieBanner locale={locale} />
        </Providers>
      </body>
    </html>
  );
}
