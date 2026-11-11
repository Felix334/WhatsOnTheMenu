import { renderOgImage } from "@/app/components/ogImage";
import { getDictionary } from "@/i18n";

// Vorschaubild fuer alle deutschen Seiten (WhatsApp, LinkedIn, Facebook, X).
// Gilt per Datei-Konvention fuer diesen Ordner und alles darunter.

export const alt = "WhatIsOnMyMenu – digitale Speisekarte per QR-Code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const t = getDictionary("de");
  return renderOgImage({ title: t.meta.home.ogTitle, subtitle: t.meta.home.ogDescription });
}
