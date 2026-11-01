// Uebersetzte URL-Pfade pro Sprache: sprachneutraler (= deutscher) Pfad ->
// Pfad in der Zielsprache. Nur exakte Pfade, keine Praefix-Logik.
//
// Bewusst .mjs: next.config.mjs liest die Tabelle fuer Rewrites und
// Weiterleitungen direkt ein, und Node behandelt .js ohne "type": "module"
// als CommonJS.
//
// Die Seitenordner unter src/app/(intl)/[locale]/ behalten die deutschen
// Namen. next.config.mjs schreibt /en/how-it-works intern auf
// /en/WieFunktionierts um und leitet die alte URL per 308 auf die neue.
//
// Neuer Eintrag: hier ergaenzen — localizedPath, stripLocale, hreflang,
// Sitemap, Sprachumschalter und Rewrites ziehen automatisch nach.

export const LOCALIZED_PATHS = {
  en: {
    "/WieFunktionierts": "/how-it-works",
    "/UnserTeam": "/about-us",
    "/ErstelleRestaurantAccount": "/sign-up",
    "/ErstelleRestaurantAccount/FreeTier": "/sign-up/free",
    "/ErstelleRestaurantAccount/Business": "/sign-up/business",
  },
};
