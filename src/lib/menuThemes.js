// Theme-Presets für die Speisekarte. Wird vom applyTheme-Endpoint (serverseitig,
// dort zählt die Wahrheit) und vom OptionMenu (Vorschau-Kacheln) importiert.
// Werte müssen zu den bestehenden Feldern passen:
// borderRadius: none|sm|md|xl · density: compact|normal|airy · Fonts aus fontList.js

export const MENU_THEMES = {
  elegant: {
    label: "Elegant",
    description: "Serifen-Titel, Punktlinien, viel Weißraum",
    menu: { bgColor: "#FFFFFF", font: "Lato", headingFont: "Playfair Display", density: "airy" },
    group: { color: "#FFFFFF", fontColor: "#1F2937", borderRadius: "sm" },
    category: { bgColor: "#FFFFFF", fontColor: "#1F2937", borderRadius: "sm", elevated: false, leaderDots: true, titleUppercase: true },
  },
  rustikal: {
    label: "Rustikal",
    description: "Warme Töne, klassische Speisekarten-Optik",
    menu: { bgColor: "#FAF3E0", font: "Open Sans", headingFont: "Merriweather", density: "normal" },
    group: { color: "#FFF8EC", fontColor: "#4A3728", borderRadius: "md" },
    category: { bgColor: "#FFFDF7", fontColor: "#4A3728", borderRadius: "md", elevated: true, leaderDots: true, titleUppercase: false },
  },
  modern: {
    label: "Modern",
    description: "Klare Flächen, kompakte Zeilen, runde Karten",
    menu: { bgColor: "#F8F9FA", font: "Inter", headingFont: "Montserrat", density: "compact" },
    group: { color: "#FFFFFF", fontColor: "#111827", borderRadius: "xl" },
    category: { bgColor: "#FFFFFF", fontColor: "#111827", borderRadius: "xl", elevated: true, leaderDots: false, titleUppercase: true },
  },
  dunkel: {
    label: "Dunkel",
    description: "Dunkler Hintergrund, helle Schrift",
    menu: { bgColor: "#111827", font: "Inter", headingFont: "Poppins", density: "normal" },
    group: { color: "#1F2937", fontColor: "#F9FAFB", borderRadius: "md" },
    category: { bgColor: "#1F2937", fontColor: "#F9FAFB", borderRadius: "md", elevated: false, leaderDots: true, titleUppercase: false },
  },
};

// Felder, die ein Theme überschreibt — aus allen Presets gesammelt, damit
// Schnappschuss (applyTheme) und Rückgängig (undoTheme) automatisch mitwachsen,
// wenn ein Preset ein neues Feld bekommt.
const fieldsOf = (level) => [...new Set(Object.values(MENU_THEMES).flatMap((t) => Object.keys(t[level])))];

export const THEME_FIELDS = {
  menu: fieldsOf("menu"),
  group: fieldsOf("group"),
  category: fieldsOf("category"),
};

/** Nur die Theme-Felder eines Objekts übernehmen (Whitelist für Schnappschuss und Wiederherstellung). */
export function pickThemeFields(obj, level) {
  return Object.fromEntries(THEME_FIELDS[level].filter((k) => obj && k in obj).map((k) => [k, obj[k]]));
}
