/**
 * Zusatzstoffe und Merkmale eines Gerichts — Gegenstück zu allergens.js.
 *
 * `key` entspricht den Prisma-Enums `Additive` bzw. `DishTag`
 * (prisma/schema.prisma). Client-sicher, keine Server-Imports: Editor,
 * Gästeansicht, Druck und die API-Validierung (schemas/dish.js) lesen alle
 * aus dieser Datei.
 */

// Kennzeichnungspflichtige Zusatzstoffe in der Gastronomie (ZZulV/LMIV).
// Die Nummern sind die in Deutschland übliche Legende auf Speisekarten.
// nameEn / labelEn: englische Fassung für die Oberfläche (Dashboard)
export const ADDITIVES = [
  { key: "FARBSTOFF", id: 1, name: "mit Farbstoff", nameEn: "with colouring" },
  { key: "KONSERVIERUNGSSTOFF", id: 2, name: "mit Konservierungsstoff", nameEn: "with preservative" },
  { key: "ANTIOXIDATIONSMITTEL", id: 3, name: "mit Antioxidationsmittel", nameEn: "with antioxidant" },
  { key: "GESCHMACKSVERSTAERKER", id: 4, name: "mit Geschmacksverstärker", nameEn: "with flavour enhancer" },
  { key: "GESCHWEFELT", id: 5, name: "geschwefelt", nameEn: "sulphured" },
  { key: "GESCHWAERZT", id: 6, name: "geschwärzt", nameEn: "blackened" },
  { key: "GEWACHST", id: 7, name: "gewachst", nameEn: "waxed" },
  { key: "PHOSPHAT", id: 8, name: "mit Phosphat", nameEn: "with phosphate" },
  { key: "SUESSUNGSMITTEL", id: 9, name: "mit Süßungsmittel", nameEn: "with sweetener" },
  { key: "PHENYLALANIN", id: 10, name: "enthält eine Phenylalaninquelle", nameEn: "contains a source of phenylalanine" },
  { key: "KOFFEIN", id: 11, name: "koffeinhaltig", nameEn: "contains caffeine" },
  { key: "CHININ", id: 12, name: "chininhaltig", nameEn: "contains quinine" },
];

export const DISH_TAGS = [
  { key: "VEGAN", icon: "🌱", name: "Vegan", nameEn: "Vegan" },
  { key: "VEGETARISCH", icon: "🥕", name: "Vegetarisch", nameEn: "Vegetarian" },
  { key: "HAUSGEMACHT", icon: "🏠", name: "Hausgemacht", nameEn: "Homemade" },
  { key: "EMPFEHLUNG", icon: "⭐", name: "Empfehlung", nameEn: "Recommended" },
  { key: "NEU", icon: "✨", name: "Neu", nameEn: "New" },
];

export const SPICE_LEVELS = [
  { value: 0, label: "Nicht scharf", labelEn: "Not spicy" },
  { value: 1, label: "Leicht scharf", labelEn: "Mild" },
  { value: 2, label: "Scharf", labelEn: "Hot" },
  { value: 3, label: "Sehr scharf", labelEn: "Very hot" },
];

/** Höchstzahl an Größen/Preisvarianten pro Gericht */
export const MAX_DISH_VARIANTS = 8;

export const ADDITIVE_KEYS = ADDITIVES.map((a) => a.key);
export const DISH_TAG_KEYS = DISH_TAGS.map((t) => t.key);

const ADDITIVE_BY_KEY = new Map(ADDITIVES.map((a) => [a.key, a]));
const TAG_BY_KEY = new Map(DISH_TAGS.map((t) => [t.key, t]));

export function getAdditiveByKey(key) {
  return ADDITIVE_BY_KEY.get(key) ?? null;
}

export function getDishTagByKey(key) {
  return TAG_BY_KEY.get(key) ?? null;
}

/** Zusatzstoff-Nummern eines Gerichts aufsteigend, z. B. [1, 2, 11] */
export function additiveNumbers(keys) {
  return (keys ?? [])
    .map((k) => ADDITIVE_BY_KEY.get(k)?.id)
    .filter(Boolean)
    .sort((a, b) => a - b);
}
