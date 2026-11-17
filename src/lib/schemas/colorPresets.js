// Farb-Presets und die Regel "freie Farbwahl nur ab Plus".
//
// Gemeinsam genutzt von optionMenu.js (Auswahl-Listen im Editor) und den
// Speicher-Routen (updateMenu, setData/updateMenu, edditData). Die Listen
// stehen nur hier, damit Anzeige und serverseitige Prüfung nicht
// auseinanderlaufen. Ein Preset, das hier fehlt, kann ein Free-Nutzer nicht
// speichern.
//
// Reine Konstanten, darf auch in Client-Komponenten importiert werden.

// Abos mit freier Hex-Farbwahl für Karte und Kategorien (Plus + Premium).
// Die Hero-Section ist strenger (nur Premium), siehe api/user/profil/updateHero.
export const CUSTOM_COLOR_SUBSCRIPTIONS = ["Business", "Professional"];

export const MENU_BG_PRESETS = [
  { value: "#FFFFFF", label: "Weiß", labelEn: "White" },
  { value: "#F8F9FA", label: "Grau 50", labelEn: "Grey 50", className: "bg-gray-50" },
  { value: "#F1F3F5", label: "Grau 100", labelEn: "Grey 100", className: "bg-gray-100" },
  { value: "#E9ECEF", label: "Grau 200", labelEn: "Grey 200", className: "bg-gray-200" },
  { value: "#DEE2E6", label: "Grau 300", labelEn: "Grey 300", className: "bg-gray-300" },
  { value: "#CED4DA", label: "Grau 400", labelEn: "Grey 400", className: "bg-gray-400" },
  { value: "#ADB5BD", label: "Grau 500", labelEn: "Grey 500", className: "bg-gray-500" },
  { value: "#6C757D", label: "Grau 600", labelEn: "Grey 600", className: "bg-gray-600 text-white" },
  { value: "#495057", label: "Grau 700", labelEn: "Grey 700", className: "bg-gray-700 text-white" },
  { value: "#343A40", label: "Grau 800", labelEn: "Grey 800", className: "bg-gray-800 text-white" },
  { value: "#212529", label: "Grau 900", labelEn: "Grey 900", className: "bg-gray-900 text-white" },
  { value: "#FFCDD2", label: "Hellrot", labelEn: "Light red", className: "bg-red-100" },
  { value: "#EF9A9A", label: "Rot 300", labelEn: "Red 300", className: "bg-red-300" },
  { value: "#F44336", label: "Rot 500", labelEn: "Red 500", className: "bg-red-500 text-white" },
  { value: "#D32F2F", label: "Dunkelrot", labelEn: "Dark red", className: "bg-red-700 text-white" },
  { value: "#FFE0B2", label: "Hellorange", labelEn: "Light orange", className: "bg-orange-100" },
  { value: "#FFB74D", label: "Orange 300", labelEn: "Orange 300", className: "bg-orange-300" },
  { value: "#FF9800", label: "Orange 500", labelEn: "Orange 500", className: "bg-orange-500 text-white" },
  { value: "#F57C00", label: "Dunkelorange", labelEn: "Dark orange", className: "bg-orange-700 text-white" },
  { value: "#FFF9C4", label: "Hellgelb", labelEn: "Light yellow", className: "bg-yellow-100" },
  { value: "#FFF176", label: "Gelb 300", labelEn: "Yellow 300", className: "bg-yellow-300" },
  { value: "#FFC107", label: "Gelb 500", labelEn: "Yellow 500", className: "bg-yellow-500" },
  { value: "#FFA000", label: "Dunkelgelb", labelEn: "Dark yellow", className: "bg-yellow-700" },
  { value: "#FFD700", label: "Gold", labelEn: "Gold", className: "bg-yellow-400" },
  { value: "#C8E6C9", label: "Hellgrün", labelEn: "Light green", className: "bg-green-100" },
  { value: "#81C784", label: "Grün 300", labelEn: "Green 300", className: "bg-green-300" },
  { value: "#4CAF50", label: "Grün 500", labelEn: "Green 500", className: "bg-green-500 text-white" },
  { value: "#388E3C", label: "Dunkelgrün", labelEn: "Dark green", className: "bg-green-700 text-white" },
  { value: "#BBDEFB", label: "Hellblau", labelEn: "Light blue", className: "bg-blue-100" },
  { value: "#64B5F6", label: "Blau 300", labelEn: "Blue 300", className: "bg-blue-300" },
  { value: "#2196F3", label: "Blau 500", labelEn: "Blue 500", className: "bg-blue-500 text-white" },
  { value: "#1976D2", label: "Dunkelblau", labelEn: "Dark blue", className: "bg-blue-700 text-white" },
  { value: "#17A2B8", label: "Cyan", labelEn: "Cyan", className: "bg-cyan-400 text-white" },
  { value: "#138496", label: "Dunkelcyan", labelEn: "Dark cyan", className: "bg-cyan-700 text-white" },
  { value: "#E1BEE7", label: "Helllila", labelEn: "Light purple", className: "bg-purple-200" },
  { value: "#BA68C8", label: "Lila 300", labelEn: "Purple 300", className: "bg-purple-300" },
  { value: "#6F42C1", label: "Lila 500", labelEn: "Purple 500", className: "bg-purple-500 text-white" },
  { value: "#6610F2", label: "Dunkellila", labelEn: "Dark purple", className: "bg-purple-700 text-white" },
  { value: "#EC407A", label: "Pink 300", labelEn: "Pink 300", className: "bg-pink-300" },
  { value: "#E83E8C", label: "Pink 500", labelEn: "Pink 500", className: "bg-pink-500 text-white" },
  { value: "#000000", label: "Schwarz", labelEn: "Black", className: "text-white bg-black" },
];

export const MENU_FONT_PRESETS = [
  { value: "#000000", label: "Schwarz", labelEn: "Black", className: "text-white bg-black" },
  { value: "#212529", label: "Dunkelgrau", labelEn: "Dark grey" },
  { value: "#495057", label: "Grau", labelEn: "Grey" },
  { value: "#6C757D", label: "Mittelgrau", labelEn: "Mid grey", className: "text-white bg-gray-500" },
  { value: "#1976D2", label: "Blau", labelEn: "Blue", className: "text-white bg-blue-700" },
  { value: "#388E3C", label: "Grün", labelEn: "Green", className: "text-white bg-green-700" },
  { value: "#D32F2F", label: "Rot", labelEn: "Red", className: "text-white bg-red-700" },
  { value: "#6610F2", label: "Lila", labelEn: "Purple", className: "text-white bg-purple-700" },
  { value: "#FFFFFF", label: "Weiß", labelEn: "White" },
];

const norm = (v) => String(v).trim().toUpperCase();
const MENU_BG_SET = new Set(MENU_BG_PRESETS.map((p) => norm(p.value)));
const MENU_FONT_SET = new Set(MENU_FONT_PRESETS.map((p) => norm(p.value)));

export function hasCustomColors(subscription) {
  return CUSTOM_COLOR_SUBSCRIPTIONS.includes(subscription);
}

// Leer/undefined = "Standard" bzw. "nicht ändern" — immer erlaubt.
export function isMenuBgColorAllowed(value, subscription) {
  if (value === undefined || value === null || value === "") return true;
  return hasCustomColors(subscription) || MENU_BG_SET.has(norm(value));
}

export function isMenuFontColorAllowed(value, subscription) {
  if (value === undefined || value === null || value === "") return true;
  return hasCustomColors(subscription) || MENU_FONT_SET.has(norm(value));
}

// Kategorie- und Gruppen-Hintergrund: Free wählt aus der Tailwind-Palette
// (colorPalet.js, Werte wie "bg-red-500"), Hex-Werte nur ab Plus.
// "#ffffff" ist der Standardwert, den setData beim Anlegen selbst vergibt.
export function isSectionBgColorAllowed(value, subscription) {
  if (value === undefined || value === null || value === "") return true;
  if (hasCustomColors(subscription)) return true;
  const v = String(value);
  return !v.startsWith("#") || norm(v) === "#FFFFFF";
}
