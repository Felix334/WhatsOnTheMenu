import { buildAlternates, getDictionary } from "@/i18n";
import PublicHeader from "@/app/components/PublicHeader";

export const metadata = {
  alternates: buildAlternates("/pricing", "de"),
  title: "Preise & Tarife | WhatIsOnMyMenu.com",
  description: "Vergleiche die Tarife von WhatIsOnMyMenu.com – kostenlos starten und jederzeit upgraden für mehr Funktionen bei deiner digitalen Speisekarte per QR-Code.",
};

// Die Kopfzeile sitzt hier im Layout und nicht in page.js: page.js ist eine
// Client-Komponente, PublicHeader eine Server-Komponente — die laesst sich dort
// nicht direkt einhaengen. Ueber das Layout bleibt sie serverseitig gerendert.
export default function PricingLayout({ children }) {
  return (
    <>
      <PublicHeader t={getDictionary("de")} locale="de" />
      {children}
    </>
  );
}
