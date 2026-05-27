/**
 * Die 14 EU-Hauptallergene nach Verordnung (EU) Nr. 1169/2011
 * Kennzeichnungspflicht in Deutschland.
 */
export const ALLERGENS = [
  { id: "A", name: "Gluten",         description: "Weizen, Roggen, Gerste, Hafer, Dinkel" },
  { id: "B", name: "Krebstiere",     description: "z. B. Garnelen, Krabben, Hummer" },
  { id: "C", name: "Eier",           description: "und Erzeugnisse daraus" },
  { id: "D", name: "Fisch",          description: "und Erzeugnisse daraus" },
  { id: "E", name: "Erdnüsse",       description: "und Erzeugnisse daraus" },
  { id: "F", name: "Soja",           description: "und Erzeugnisse daraus" },
  { id: "G", name: "Milch",          description: "inkl. Laktose" },
  { id: "H", name: "Schalenfrüchte", description: "Mandeln, Haselnüsse, Walnüsse, Cashews u. a." },
  { id: "I", name: "Sellerie",       description: "und Erzeugnisse daraus" },
  { id: "J", name: "Senf",           description: "und Erzeugnisse daraus" },
  { id: "K", name: "Sesam",          description: "und Erzeugnisse daraus" },
  { id: "L", name: "Sulfite",        description: "Schwefeldioxid > 10 mg/kg" },
  { id: "M", name: "Lupinen",        description: "und Erzeugnisse daraus" },
  { id: "N", name: "Weichtiere",     description: "Muscheln, Tintenfisch u. a." },
];

/** Gibt das Allergen-Objekt für einen gegebenen Namen zurück */
export function getAllergenByName(name) {
  return ALLERGENS.find((a) => a.name === name) ?? null;
}
