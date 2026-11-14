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
export const ADDITIVES = [
  { key: "FARBSTOFF", id: 1, name: "mit Farbstoff" },
  { key: "KONSERVIERUNGSSTOFF", id: 2, name: "mit Konservierungsstoff" },
  { key: "ANTIOXIDATIONSMITTEL", id: 3, name: "mit Antioxidationsmittel" },
  { key: "GESCHMACKSVERSTAERKER", id: 4, name: "mit Geschmacksverstärker" },
  { key: "GESCHWEFELT", id: 5, name: "geschwefelt" },
  { key: "GESCHWAERZT", id: 6, name: "geschwärzt" },
  { key: "GEWACHST", id: 7, name: "gewachst" },
  { key: "PHOSPHAT", id: 8, name: "mit Phosphat" },
  { key: "SUESSUNGSMITTEL", id: 9, name: "mit Süßungsmittel" },
  { key: "PHENYLALANIN", id: 10, name: "enthält eine Phenylalaninquelle" },
  { key: "KOFFEIN", id: 11, name: "koffeinhaltig" },
  { key: "CHININ", id: 12, name: "chininhaltig" },
];

export const DISH_TAGS = [
  { key: "VEGAN", icon: "🌱", name: "Vegan" },
  { key: "VEGETARISCH", icon: "🥕", name: "Vegetarisch" },
  { key: "HAUSGEMACHT", icon: "🏠", name: "Hausgemacht" },
  { key: "EMPFEHLUNG", icon: "⭐", name: "Empfehlung" },
  { key: "NEU", icon: "✨", name: "Neu" },
];

export const SPICE_LEVELS = [
  { value: 0, label: "Nicht scharf" },
  { value: 1, label: "Leicht scharf" },
  { value: 2, label: "Scharf" },
  { value: 3, label: "Sehr scharf" },
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
