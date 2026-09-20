"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { locales, localizedPath, stripLocale, xDefaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

const STORAGE_KEY = "wiomm.langBannerDismissed";

/**
 * Hinweis auf eine passendere Sprachfassung.
 *
 * Bewusst ein Banner und KEINE automatische Weiterleitung: Googlebot crawlt
 * ueberwiegend aus den USA mit Accept-Language "en". Wer per Redirect auf die
 * Browsersprache reagiert, riskiert, dass Google die deutsche Fassung nie zu
 * sehen bekommt. Das Banner laesst jede URL genau das ausliefern, was
 * angefragt wurde.
 *
 * Rendert serverseitig nichts und erscheint erst nach dem Mount — dadurch
 * entsteht keine Hydration-Diskrepanz, und der Hinweis taucht in keinem
 * Prerender-HTML auf, das Google indexieren koennte.
 */
export default function LanguageSuggestionBanner({ locale }) {
  const pathname = usePathname() || "/";
  const [target, setTarget] = useState(null);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Private Modus oder blockierte Site-Daten: dann eben ohne Gedaechtnis.
    }
    if (dismissed) return;

    const browserLang = (navigator.language || "").split("-")[0].toLowerCase();
    if (!browserLang || browserLang === locale) return;

    // Gibt es die Browsersprache? Dann die. Sonst der Auffang fuer den Rest
    // der Welt (xDefaultLocale) — aber nur, wenn wir nicht schon dort sind.
    const suggestion = locales.includes(browserLang) ? browserLang : locale === xDefaultLocale ? null : xDefaultLocale;

    if (suggestion && suggestion !== locale) setTarget(suggestion);
  }, [locale]);

  if (!target) return null;

  // Texte in der Zielsprache — der Leser versteht die aktuelle ja womoeglich nicht.
  const t = getDictionary(target).banner;
  const href = localizedPath(stripLocale(pathname), target);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignorieren — dann erscheint der Hinweis beim naechsten Besuch erneut
    }
    setTarget(null);
  };

  return (
    <div lang={target} className="bg-gray-900 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
        <span className="text-gray-200">{t.message}</span>
        <Link href={href} hrefLang={target} className="underline font-medium hover:text-yellow-300 whitespace-nowrap">
          {t.action}
        </Link>
        <button type="button" onClick={dismiss} aria-label={t.dismiss} className="ml-auto sm:ml-2 p-1 rounded hover:bg-white/10 shrink-0">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
