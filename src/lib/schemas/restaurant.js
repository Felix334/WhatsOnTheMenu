import { z } from "zod";

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
});

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
});
