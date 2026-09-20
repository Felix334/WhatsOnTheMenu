import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import WebsiteIcon from "../icon.svg";
import { localizedPath } from "@/i18n/config";

// Schlanke Kopfzeile fuer die oeffentlichen Unterseiten.
//
// Die Startseite bringt ihre eigene, deutlich umfangreichere Navigation mit
// (Anmelden, Profil, Anker-Links) — die bleibt unangetastet. Hier geht es nur
// darum, dass auf JEDER oeffentlichen Seite ein Weg zurueck und der
// Sprachumschalter erreichbar sind.
//
// Bewusst eine Server-Komponente: so landet die Kopfzeile als fertiges HTML im
// Prerender. Nur der Umschalter selbst ist eine Client-Komponente.

export default function PublicHeader({ t, locale }) {
  return (
    <nav className="bg-white/95 backdrop-blur sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href={localizedPath("/", locale)} className="flex items-center gap-1 text-lg sm:text-2xl font-bold text-red-800 shrink-0">
            <Image src={WebsiteIcon} alt="" width={28} height={28} className="inline align-middle" />
            <span className="hidden sm:inline">WhatIsOnMyMenu.com</span>
            <span className="sm:hidden">WhatIsOnMyMenu</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link href={localizedPath("/WieFunktionierts", locale)} className="text-sm text-gray-600 hover:text-red-800 px-2 py-1">
              {t.nav.howItWorks}
            </Link>
            <Link href={localizedPath("/pricing", locale)} className="text-sm text-gray-600 hover:text-red-800 px-2 py-1">
              {t.nav.pricing}
            </Link>
            <LanguageSwitcher locale={locale} label={t.nav.language} />
          </div>
        </div>
      </div>
    </nav>
  );
}
