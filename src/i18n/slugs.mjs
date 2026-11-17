// Uebersetzte URL-Pfade pro Sprache: sprachneutraler (= deutscher) Pfad ->
// Pfad in der Zielsprache. Nur exakte Pfade, keine Praefix-Logik.
//
// Die Seitenordner unter src/app/(intl)/[locale]/ behalten die deutschen
// Namen. Die Middleware (resolveLocaleRoute in ./config.js) schreibt
// /how-it-works intern auf /en/WieFunktionierts um und leitet alte URLs
// (/en/how-it-works, /WieFunktionierts) per 308 weiter.
//
// Neuer Eintrag: hier ergaenzen — localizedPath, stripLocale, hreflang,
// Sitemap, Sprachumschalter und Middleware-Routing ziehen automatisch nach.
// Eine neue uebersetzte Seite zusaetzlich in TRANSLATED_PATHS (./config.js).

export const LOCALIZED_PATHS = {
  en: {
    "/WieFunktionierts": "/how-it-works",
    "/UnserTeam": "/about-us",
    "/Impressum": "/legal-notice",
    "/ErstelleRestaurantAccount": "/sign-up",
    "/ErstelleRestaurantAccount/FreeTier": "/sign-up/free",
    "/ErstelleRestaurantAccount/Business": "/sign-up/business",
    "/Konto": "/account",
  },
};
