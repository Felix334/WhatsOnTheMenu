// Sprach-Konfiguration fuer die oeffentlichen Seiten.
//
// Deutsch laeuft ohne Praefix auf den bestehenden, bereits indexierten URLs
// (/pricing, /WieFunktionierts, ...). Jede weitere Sprache bekommt ein Praefix
// (/en/pricing). So aendert sich keine URL, die Google schon kennt.
//
// Neue Sprache hinzufuegen: hier eintragen + src/i18n/<code>.js anlegen.
// Der Seitenbaum unter src/app/(intl)/[locale]/ wird geteilt, es muss also
// keine einzige Seite dupliziert werden.

export const defaultLocale = "de";

export const locales = ["de", "en"];

// Sprache fuer hreflang="x-default": greift fuer alle Besucher, deren Sprache
// zu keiner vorhandenen Fassung passt — also etwa Franzosen, Spanier, Italiener.
//
// Bewusst Englisch und nicht Deutsch: wer weder Deutsch noch Englisch als
// Muttersprache hat, kommt mit der englischen Fassung fast immer weiter. Das
// ist NICHT dasselbe wie defaultLocale — Deutsch bleibt die Sprache ohne
// URL-Praefix, Englisch ist nur der Auffang fuer den Rest der Welt.
export const xDefaultLocale = "en";

// Die Sprachen, die ein URL-Praefix tragen — alles ausser Deutsch.
export const prefixedLocales = locales.filter((l) => l !== defaultLocale);

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
 * localizedPath("/pricing", "de") -> "/pricing"
 * localizedPath("/pricing", "en") -> "/en/pricing"
 * localizedPath("/", "en")        -> "/en"
 */
export function localizedPath(path, locale) {
  const clean = path === "/" ? "" : `/${String(path).replace(/^\/+|\/+$/g, "")}`;
  if (locale === defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

/**
 * Entfernt ein vorhandenes Sprach-Praefix aus einem Pfad.
 * "/en/pricing" -> "/pricing"   "/pricing" -> "/pricing"   "/en" -> "/"
 *
 * Gegenstueck zu localizedPath: erst hiermit den sprachneutralen Pfad
 * gewinnen, dann in die Zielsprache uebersetzen.
 */
export function stripLocale(pathname) {
  const segments = String(pathname || "/")
    .split("/")
    .filter(Boolean);
  if (segments.length && locales.includes(segments[0]) && segments[0] !== defaultLocale) {
    segments.shift();
  }
  return `/${segments.join("/")}`;
}

/**
 * canonical + hreflang-Block fuer generateMetadata.
 *
 * Das hreflang ist der eigentliche Hebel: es sagt Google, dass /pricing und
 * /en/pricing dieselbe Seite in zwei Sprachen sind. Ohne das konkurrieren die
 * beiden Seiten gegeneinander, statt sich gegenseitig zu staerken.
 *
 * x-default zeigt auf die englische Fassung — siehe xDefaultLocale.
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
