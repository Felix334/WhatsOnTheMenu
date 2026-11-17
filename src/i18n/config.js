// Sprach-Konfiguration fuer die oeffentlichen Seiten.
//
// Englisch ist die Standardsprache und laeuft OHNE Praefix (/pricing,
// /how-it-works). Jede weitere Sprache bekommt ein Praefix (/de/pricing,
// /de/WieFunktionierts). Bis Nov 2026 war es umgekehrt (Deutsch ohne Praefix,
// /en/...) — die alten URLs leitet die Middleware per 308 weiter, siehe
// resolveLocaleRoute unten.
//
// Intern liegen ALLE Sprachen unter src/app/(intl)/[locale]/ — auch Englisch.
// Die Middleware schreibt /pricing intern auf /en/pricing um, der Besucher
// sieht davon nichts. So wird keine einzige Seite dupliziert.
//
// Neue Sprache hinzufuegen: hier eintragen + src/i18n/<code>.js anlegen.
//
// Uebersetzte Pfad-Namen (/how-it-works statt /WieFunktionierts) stehen in
// ./slugs.mjs. Die Ordner — und damit der "sprachneutrale" Pfad, den
// localizedPath/buildAlternates erwarten — tragen die deutschen Namen.
//
// Nicht uebersetzte Seiten (Dashboards, Rechtsseiten, Speisekarten) liegen
// weiterhin unter src/app/(de)/ und laufen ohne Praefix auf Deutsch.

import { LOCALIZED_PATHS } from "./slugs.mjs";

export const defaultLocale = "en";

export const locales = ["en", "de"];

// Sprache fuer hreflang="x-default": greift fuer alle Besucher, deren Sprache
// zu keiner vorhandenen Fassung passt — also etwa Franzosen, Spanier, Italiener.
export const xDefaultLocale = "en";

// Die Sprachen, die ein URL-Praefix tragen — alles ausser der Standardsprache.
export const prefixedLocales = locales.filter((l) => l !== defaultLocale);

// Sprache der alten praefixlosen URLs von vor dem Umbau. /WieFunktionierts,
// /UnserTeam & Co. waren deutsch und sind so bei Google indexiert — sie
// werden auf die deutsche Fassung weitergeleitet, nicht auf die englische.
const LEGACY_UNPREFIXED_LOCALE = "de";

// Sprachneutrale Pfade aller Seiten, die es in jeder Sprache gibt (= Ordner
// unter src/app/(intl)/[locale]/). Nur diese Pfade schreibt die Middleware
// um; alles andere laeuft unveraendert durch.
export const TRANSLATED_PATHS = [
  "/",
  "/pricing",
  "/WieFunktionierts",
  "/UnserTeam",
  "/Impressum",
  "/ErstelleRestaurantAccount",
  "/ErstelleRestaurantAccount/FreeTier",
  "/ErstelleRestaurantAccount/Business",
  "/Konto",
];

export function isTranslatedPath(path) {
  return TRANSLATED_PATHS.includes(path);
}

// Fuer das og:locale-Feld und <html lang>.
export const ogLocales = {
  de: "de_DE",
  en: "en_US",
};

// Anzeigenamen fuer den Sprachumschalter — jeweils in der eigenen Sprache,
// damit ein Franzose "Francais" liest und nicht "Franzoesisch".
export const localeNames = {
  de: "Deutsch",
  en: "English",
};

export function isLocale(value) {
  return locales.includes(value);
}

/**
 * Baut aus einem sprachneutralen Pfad die URL fuer eine Sprache.
 * localizedPath("/pricing", "en")          -> "/pricing"
 * localizedPath("/pricing", "de")          -> "/de/pricing"
 * localizedPath("/", "de")                 -> "/de"
 * localizedPath("/WieFunktionierts", "en") -> "/how-it-works"  (siehe slugs.mjs)
 */
export function localizedPath(path, locale) {
  const clean = path === "/" ? "" : `/${String(path).replace(/^\/+|\/+$/g, "")}`;
  const slug = LOCALIZED_PATHS[locale]?.[clean] ?? clean;
  if (locale === defaultLocale) return slug || "/";
  return `/${locale}${slug}`;
}

/**
 * Entfernt ein vorhandenes Sprach-Praefix aus einem Pfad und macht einen
 * uebersetzten Pfad wieder sprachneutral.
 * "/de/pricing" -> "/pricing"   "/pricing" -> "/pricing"   "/de" -> "/"
 * "/how-it-works" -> "/WieFunktionierts"
 * "/en/how-it-works" -> "/WieFunktionierts"  (alte URL / interner Pfad)
 *
 * Gegenstueck zu localizedPath: erst hiermit den sprachneutralen Pfad
 * gewinnen, dann in die Zielsprache uebersetzen.
 */
export function stripLocale(pathname) {
  const segments = String(pathname || "/")
    .split("/")
    .filter(Boolean);
  let locale = defaultLocale;
  if (segments.length && locales.includes(segments[0])) {
    locale = segments.shift();
  }
  const path = `/${segments.join("/")}`;
  const neutral = Object.entries(LOCALIZED_PATHS[locale] || {}).find(([, localized]) => localized === path);
  return neutral ? neutral[0] : path;
}

/**
 * Sprach-Routing fuer die Middleware. Liefert, was mit einer eingehenden URL
 * passieren soll — oder null, wenn sie unveraendert durchlaufen darf.
 *
 *   /pricing, /how-it-works  -> rewrite  /en/pricing, /en/WieFunktionierts
 *   /en/pricing (alt)        -> redirect /pricing
 *   /WieFunktionierts (alt)  -> redirect /de/WieFunktionierts
 *   /de/pricing              -> null (liegt direkt unter [locale])
 *   /Profil, /AGBs, ...      -> null (nicht uebersetzt, liegt unter (de))
 *
 * Bewusst ohne Abhaengigkeiten: laeuft in der Edge-Runtime.
 */
export function resolveLocaleRoute(pathname) {
  const first = String(pathname).split("/").filter(Boolean)[0];

  // Praefix der Standardsprache (/en/...) ist nur noch eine alte URL.
  // Andere /en/...-Pfade (z. B. /en/opengraph-image) laufen durch.
  if (first === defaultLocale) {
    const neutral = stripLocale(pathname);
    return isTranslatedPath(neutral) ? { redirect: localizedPath(neutral, defaultLocale) } : null;
  }

  // /de/... wird direkt vom [locale]-Baum bedient.
  if (isLocale(first)) return null;

  const neutral = stripLocale(pathname);
  if (!isTranslatedPath(neutral)) return null;

  if (pathname === localizedPath(neutral, defaultLocale)) {
    return { rewrite: `/${defaultLocale}${neutral === "/" ? "" : neutral}` };
  }

  // Praefixloser Pfad, der nicht der englischen URL entspricht: alte deutsche URL.
  return { redirect: localizedPath(neutral, LEGACY_UNPREFIXED_LOCALE) };
}

/**
 * canonical + hreflang-Block fuer generateMetadata.
 *
 * Das hreflang ist der eigentliche Hebel: es sagt Google, dass /pricing und
 * /de/pricing dieselbe Seite in zwei Sprachen sind. Ohne das konkurrieren die
 * beiden Seiten gegeneinander, statt sich gegenseitig zu staerken.
 */
export function buildAlternates(path, locale) {
  const languages = {};
  for (const l of locales) {
    languages[l] = localizedPath(path, l);
  }
  languages["x-default"] = localizedPath(path, xDefaultLocale);

  return {
    canonical: localizedPath(path, locale),
    languages,
  };
}
