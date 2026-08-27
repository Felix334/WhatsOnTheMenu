/**
 * Die 14 EU-Hauptallergene nach Verordnung (EU) Nr. 1169/2011
 * Kennzeichnungspflicht in Deutschland.
 *
 * `key` entspricht dem Wert des Prisma-Enums `Allergen` (prisma/schema.prisma)
 * und damit dem, was Dish.allergens in der DB tatsächlich speichert.
 */
export const ALLERGENS = [
  { key: "GLUTEN", id: "A", name: "Gluten", description: "Weizen, Roggen, Gerste, Hafer, Dinkel" },
  { key: "KREBSTIERE", id: "B", name: "Krebstiere", description: "z. B. Garnelen, Krabben, Hummer" },
  { key: "EIER", id: "C", name: "Eier", description: "und Erzeugnisse daraus" },
  { key: "FISCH", id: "D", name: "Fisch", description: "und Erzeugnisse daraus" },
  { key: "ERDNUESSE", id: "E", name: "Erdnüsse", description: "und Erzeugnisse daraus" },
  { key: "SOJA", id: "F", name: "Soja", description: "und Erzeugnisse daraus" },
  { key: "MILCH", id: "G", name: "Milch", description: "inkl. Laktose" },
  { key: "SCHALENFRUECHTE", id: "H", name: "Schalenfrüchte", description: "Mandeln, Haselnüsse, Walnüsse, Cashews u. a." },
  { key: "SELLERIE", id: "I", name: "Sellerie", description: "und Erzeugnisse daraus" },
  { key: "SENF", id: "J", name: "Senf", description: "und Erzeugnisse daraus" },
  { key: "SESAM", id: "K", name: "Sesam", description: "und Erzeugnisse daraus" },
  { key: "SULFITE", id: "L", name: "Sulfite", description: "Schwefeldioxid > 10 mg/kg" },
  { key: "LUPINEN", id: "M", name: "Lupinen", description: "und Erzeugnisse daraus" },
  { key: "WEICHTIERE", id: "N", name: "Weichtiere", description: "Muscheln, Tintenfisch u. a." },
];

const ALLERGEN_BY_KEY = new Map(ALLERGENS.map((a) => [a.key, a]));

/** Gibt das Allergen-Objekt für einen gegebenen Enum-Key zurück (z. B. "GLUTEN") */
export function getAllergenByKey(key) {
  return ALLERGEN_BY_KEY.get(key) ?? null;
}

/** Prüft, ob ein String ein gültiger Allergen-Enum-Key ist */
export function isValidAllergenKey(key) {
  return ALLERGEN_BY_KEY.has(key);
}
