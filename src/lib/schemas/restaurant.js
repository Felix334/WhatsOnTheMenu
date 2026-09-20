import { z } from "zod";

// Länder, in die verkauft werden kann (ISO-3166-1 alpha-2).
//
// Bewusst eine Whitelist und kein freier String: der Wert landet direkt in der
// Stripe-Kundenadresse und steuert damit die Umsatzsteuer-Berechnung
// (Reverse-Charge innerhalb der EU). Ein falscher oder erfundener Code führt
// zu einer falsch abgerechneten Rechnung, nicht nur zu einem hässlichen Feld.
//
// Umfang: EU (Reverse-Charge über Stripe Tax) plus CH, GB, NO, LI.
// Die Preise sind in EUR ausgezeichnet — für Länder ausserhalb der Eurozone
// zahlt der Kunde den EUR-Betrag zum Wechselkurs seiner Karte.
export const SUPPORTED_COUNTRIES = [
  "AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES",
  "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IT", "LI", "LT",
  "LU", "LV", "MT", "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK",
];

export const countrySchema = z.enum(SUPPORTED_COUNTRIES);

// Gemeinsames Validierungsschema für die Restaurant-Registrierung.
// Wird sowohl client- als auch serverseitig genutzt, damit die Regeln
// nicht auseinanderlaufen und die Eingaben umgehungssicher geprüft werden.
export const restaurantRegistrationSchema = z.object({
  ownerName: z.string().min(2, "Ein Name ist erforderlich").max(100, "Name zu lang"),
  restaurantName: z.string().min(1, "Ein Restaurantname ist erforderlich").max(120, "Restaurantname zu lang"),
  email: z.string().email("Ungültige Email").max(254, "Email zu lang"),
  postalCode: z.string().min(4, "Postleitzahl erforderlich").max(12, "Postleitzahl zu lang"),
  city: z.string().min(1, "Stadt erforderlich").max(120, "Stadt zu lang"),
  street: z.string().min(1, "Straße erforderlich").max(120, "Straße zu lang"),
  houseNumber: z.string().min(1, "Hausnummer erforderlich").max(10, "Hausnummer zu lang"),
  phone: z
    .string()
    .min(7, "Die Telefonnummer ist zu kurz")
    .max(20, "Die Telefonnummer ist zu lang")
    .regex(/^\+?\d+$/, "Die Telefonnummer ist ungültig"),
  website: z.string().url("Die Website muss eine gültige URL sein").max(300).optional().or(z.literal("")),
  category: z.string().max(60).optional().or(z.literal("")),
  description: z.string().max(300, "Maximal 2-3 Sätze (höchstens 300 Zeichen)").optional().or(z.literal("")),
  country: countrySchema.optional(),
});

/**
 * Registrierungsschema mit übersetzbaren Meldungen für das Anmeldeformular.
 *
 * Das Formular hatte bisher eine eigene Kopie dieses Schemas mit fest
 * eingebauten deutschen Texten — und dabei `phone.max(10)`. Eine französische
 * Nummer wie +33612345678 hat 12 Zeichen und wurde abgewiesen, jede spanische
 * und italienische ebenso. Hier gilt dasselbe Limit wie serverseitig (20).
 *
 * `restaurantRegistrationSchema` oben bleibt unverändert die serverseitige
 * Prüfung — die Meldungen dort sieht nur das Log, nicht der Nutzer.
 */
export function createRegistrationSchema(m) {
  return z.object({
    ownerName: z.string().min(2, m.ownerName).max(100, m.ownerName),
    restaurantName: z.string().min(1, m.restaurantName).max(120, m.restaurantName),
    email: z.string().email(m.email).max(254, m.email),
    postalCode: z.string().min(1, m.postalCode).max(12, m.postalCode),
    city: z.string().min(1, m.city).max(120, m.city),
    street: z.string().min(1, m.street).max(120, m.street),
    houseNumber: z.string().min(1, m.houseNumber).max(10, m.houseNumber),
    country: countrySchema,
    phone: z.string().min(7, m.phoneShort).max(20, m.phoneLong).regex(/^\+?\d+$/, m.phoneInvalid),
    website: z.string().url(m.website).max(300).optional().or(z.literal("")),
    category: z.string().min(1, m.category).max(60),
    description: z.string().max(300, m.description).optional(),
    openingHours: z.string().optional(),
    ownerID: z.string(),
  });
}

// Schlanke Variante für den Stripe-Checkout: alle Felder optional (die
// Metadaten dürfen unvollständig sein), aber mit Längen-Obergrenzen, damit
// keine überlangen Werte in die Stripe-Metadaten geschrieben werden.
export const restaurantCheckoutSchema = z.object({
  ownerName: z.string().max(100).optional(),
  restaurantName: z.string().max(120).optional(),
  category: z.string().max(60).optional(),
  street: z.string().max(120).optional(),
  houseNumber: z.string().max(10).optional(),
  postalCode: z.string().max(12).optional(),
  city: z.string().max(120).optional(),
  // Ohne dieses Feld hat Zod das vom Client gesendete Land stillschweigend
  // entfernt, und der Checkout ist in route.js immer auf "DE" zurückgefallen —
  // jedes ausländische Restaurant wurde als deutsches abgerechnet.
  country: countrySchema.optional(),
});
