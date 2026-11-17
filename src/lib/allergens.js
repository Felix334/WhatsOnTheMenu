/**
 * Die 14 EU-Hauptallergene nach Verordnung (EU) Nr. 1169/2011
 * Kennzeichnungspflicht in Deutschland.
 *
 * `key` entspricht dem Wert des Prisma-Enums `Allergen` (prisma/schema.prisma)
 * und damit dem, was Dish.allergens in der DB tatsächlich speichert.
 * nameEn/descriptionEn: englische Fassung für die Oberfläche (Dashboard).
 */
export const ALLERGENS = [
  { key: "GLUTEN", id: "A", name: "Gluten", description: "Weizen, Roggen, Gerste, Hafer, Dinkel" , nameEn: "Gluten", descriptionEn: "Wheat, rye, barley, oats, spelt" },
  { key: "KREBSTIERE", id: "B", name: "Krebstiere", description: "z. B. Garnelen, Krabben, Hummer" , nameEn: "Crustaceans", descriptionEn: "e.g. prawns, crab, lobster" },
  { key: "EIER", id: "C", name: "Eier", description: "und Erzeugnisse daraus" , nameEn: "Eggs", descriptionEn: "and products thereof" },
  { key: "FISCH", id: "D", name: "Fisch", description: "und Erzeugnisse daraus" , nameEn: "Fish", descriptionEn: "and products thereof" },
  { key: "ERDNUESSE", id: "E", name: "Erdnüsse", description: "und Erzeugnisse daraus" , nameEn: "Peanuts", descriptionEn: "and products thereof" },
  { key: "SOJA", id: "F", name: "Soja", description: "und Erzeugnisse daraus" , nameEn: "Soy", descriptionEn: "and products thereof" },
  { key: "MILCH", id: "G", name: "Milch", description: "inkl. Laktose" , nameEn: "Milk", descriptionEn: "incl. lactose" },
  { key: "SCHALENFRUECHTE", id: "H", name: "Schalenfrüchte", description: "Mandeln, Haselnüsse, Walnüsse, Cashews u. a." , nameEn: "Tree nuts", descriptionEn: "Almonds, hazelnuts, walnuts, cashews etc." },
  { key: "SELLERIE", id: "I", name: "Sellerie", description: "und Erzeugnisse daraus" , nameEn: "Celery", descriptionEn: "and products thereof" },
  { key: "SENF", id: "J", name: "Senf", description: "und Erzeugnisse daraus" , nameEn: "Mustard", descriptionEn: "and products thereof" },
  { key: "SESAM", id: "K", name: "Sesam", description: "und Erzeugnisse daraus" , nameEn: "Sesame", descriptionEn: "and products thereof" },
  { key: "SULFITE", id: "L", name: "Sulfite", description: "Schwefeldioxid > 10 mg/kg" , nameEn: "Sulphites", descriptionEn: "Sulphur dioxide > 10 mg/kg" },
  { key: "LUPINEN", id: "M", name: "Lupinen", description: "und Erzeugnisse daraus" , nameEn: "Lupin", descriptionEn: "and products thereof" },
  { key: "WEICHTIERE", id: "N", name: "Weichtiere", description: "Muscheln, Tintenfisch u. a." , nameEn: "Molluscs", descriptionEn: "Mussels, squid etc." },
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
