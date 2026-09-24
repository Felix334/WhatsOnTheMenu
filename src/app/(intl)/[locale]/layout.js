import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import CookieBanner from "../../components/cookieWin";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "../../components/Providers.js";
import LanguageSuggestionBanner from "../../components/LanguageSuggestionBanner";
import { prefixedLocales } from "@/i18n/config";

// Root-Layout aller uebersetzten Sprachen.
//
// (intl) ist eine Route-Gruppe (kein URL-Segment), [locale] dagegen erzeugt das
// Praefix: /en/pricing, /fr/pricing, ... Alle Sprachen teilen sich diesen einen
// Seitenbaum — eine neue Sprache braucht nur einen Eintrag in
// src/i18n/config.js und eine Woerterbuch-Datei, keine einzige neue Seite.
//
// Deutsch laeuft bewusst NICHT hier durch, sondern praefixlos ueber (de) auf
// den bereits indexierten URLs.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Praerendert /en, /fr, ... beim Build. Google bekommt fertiges HTML statt
// einer leeren Huelle, die erst per JavaScript befuellt wird.
export function generateStaticParams() {
  return prefixedLocales.map((locale) => ({ locale }));
}

// Nur die oben erzeugten Sprachen werden ausgeliefert. Alles andere — etwa ein
// Tippfehler wie /pricingg — faellt damit automatisch auf 404, statt vom
// dynamischen [locale]-Segment eingefangen zu werden.
export const dynamicParams = false;

export const metadata = {
  metadataBase: new URL("https://www.whatisonmymenu.com"),
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
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
