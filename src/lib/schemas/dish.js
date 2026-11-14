import { z } from "zod";

import { ALLERGENS } from "../allergens";
import { ADDITIVE_KEYS, DISH_TAG_KEYS, MAX_DISH_VARIANTS } from "../dishInfo";

// Validierung eines Gerichts samt Details. Genutzt vom Bearbeiten-Dialog im
// Editor (react-hook-form) und serverseitig von api/user/profil/updateDish und
// setData — beide Seiten prüfen also nach denselben Regeln.

const ALLERGEN_KEYS = ALLERGENS.map((a) => a.key);

// Decimal(10,2) in der DB. Wie in priceRules.js deutlich darunter gedeckelt.
const MAX_PRICE = 999999.99;

// Nimmt "9,50", "9.5" und 9.5 an und liefert eine Zahl.
export const priceField = z.preprocess(
  (v) => (typeof v === "number" ? String(v) : typeof v === "string" ? v.trim().replace(",", ".") : v),
  z
    .string({ invalid_type_error: "Preis erforderlich", required_error: "Preis erforderlich" })
    .regex(/^\d{1,6}(\.\d{1,2})?$/, "Preis bitte als Zahl mit höchstens 2 Nachkommastellen, z. B. 9,50")
    .transform(Number)
    .refine((n) => n >= 0 && n <= MAX_PRICE, "Ungültiger Preis"),
);

// Doppelte Einträge entfernen statt ablehnen — ein doppelter Haken ist kein Fehler.
const uniqueEnumArray = (keys) =>
  z
    .array(z.enum(keys))
    .default([])
    .transform((arr) => [...new Set(arr)]);

export const dishVariantSchema = z.object({
  label: z.string().trim().min(1, "Bezeichnung erforderlich").max(40, "Bezeichnung zu lang"),
  price: priceField,
});

// Details ohne Name/Preis — auch für Kopien in setData.
export const dishExtrasSchema = z.object({
  allergens: uniqueEnumArray(ALLERGEN_KEYS),
  additives: uniqueEnumArray(ADDITIVE_KEYS),
  tags: uniqueEnumArray(DISH_TAG_KEYS),
  spiceLevel: z.coerce.number().int().min(0).max(3).default(0),
  variants: z
    .array(dishVariantSchema)
    .max(MAX_DISH_VARIANTS, `Höchstens ${MAX_DISH_VARIANTS} Varianten`)
    .default([])
    .refine((list) => new Set(list.map((v) => v.label.toLowerCase())).size === list.length, "Jede Variante braucht eine eigene Bezeichnung"),
});

export const dishDetailsSchema = z
  .object({
    name: z.string().trim().min(1, "Name erforderlich").max(120, "Name zu lang"),
    description: z
      .string()
      .trim()
      .max(1000, "Beschreibung zu lang")
      .optional()
      .nullable()
      .transform((v) => v || null),
    price: priceField,
  })
  .merge(dishExtrasSchema);

/**
 * Preis, der auf dem Gericht selbst stehen soll: bei Varianten der kleinste
 * Variantenpreis ("ab"-Preis), sonst der eingegebene.
 */
export function effectiveDishPrice(price, variants) {
  if (!variants?.length) return price;
  return Math.min(...variants.map((v) => Number(v.price)));
}
