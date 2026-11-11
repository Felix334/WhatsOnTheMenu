import { renderOgImage } from "@/app/components/ogImage";
import { getDictionary, prefixedLocales } from "@/i18n";

// Vorschaubild der uebersetzten Seiten — Text kommt aus dem Woerterbuch der
// jeweiligen Sprache.
//
// Eigene generateStaticParams: die aus dem Layout greift fuer Bild-Routen
// nicht. Ohne sie wuerde das PNG bei jedem Abruf neu gerendert (Serverlast),
// so entsteht es einmal pro Sprache beim Build.
export function generateStaticParams() {
  return prefixedLocales.map((locale) => ({ locale }));
}

export const alt = "WhatIsOnMyMenu – QR code menus for restaurants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return renderOgImage({ title: t.meta.home.ogTitle, subtitle: t.meta.home.ogDescription });
}
