// Gestaltungs-Konstanten der Speisekarte, gemeinsam genutzt von Editor
// (Profil/page.js, menuSection.js) und Druckansicht (Profil/Drucken).
// Eigene Datei, weil eine page.js in Next.js keine beliebigen Exporte haben
// darf, und damit Editor und Druck nicht wieder auseinanderlaufen.

export const HERO_COLOR_PRESETS = [
  { key: "amber", label: "Amber", gradient: "from-amber-700 via-orange-600 to-amber-600" },
  { key: "green", label: "Grün", gradient: "from-emerald-700 via-green-600 to-teal-600" },
  { key: "blue", label: "Blau", gradient: "from-blue-700 via-indigo-600 to-blue-600" },
  { key: "red", label: "Rot", gradient: "from-red-700 via-rose-600 to-red-500" },
  { key: "purple", label: "Lila", gradient: "from-purple-700 via-violet-600 to-purple-500" },
  { key: "dark", label: "Dunkel", gradient: "from-gray-900 via-gray-800 to-gray-700" },
  { key: "white", label: "Weiß", gradient: "white" },
];

export const HERO_GRADIENT_MAP = Object.fromEntries(HERO_COLOR_PRESETS.map(({ key, gradient }) => [key, gradient]));

// Kopfbereich: Hex-Wert → inline background, sonst Verlauf aus den Presets.
export function heroClass(heroColor) {
  return heroColor?.startsWith("#") ? "" : `bg-linear-to-r ${HERO_GRADIENT_MAP[heroColor] ?? HERO_GRADIENT_MAP.amber}`;
}

export function heroStyle(heroColor) {
  return heroColor?.startsWith("#") ? { background: heroColor } : {};
}

export const RADIUS_CLASS = { none: "rounded-none", sm: "rounded-lg", md: "rounded-xl", xl: "rounded-3xl" };
export const DENSITY_CLASS = { compact: "text-sm", normal: "", airy: "text-lg" };
