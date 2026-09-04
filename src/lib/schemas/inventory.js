import { z } from "zod";

// Validierung für Inventar-Items und Lieferanten. Wird sowohl im API-Handler
// als auch im Profil-Editor genutzt.
export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Ein Name ist erforderlich").max(100, "Name zu lang"),
  unit: z.string().min(1, "Eine Einheit ist erforderlich").max(20, "Einheit zu lang"),
  currentStock: z.coerce.number({ errorMap: () => ({ message: "Ungültiger Bestand" }) }).nonnegative("Bestand darf nicht negativ sein"),
  minStock: z.coerce.number({ errorMap: () => ({ message: "Ungültiger Mindestbestand" }) }).nonnegative("Mindestbestand darf nicht negativ sein"),
  costPerUnit: z.coerce.number({ errorMap: () => ({ message: "Ungültiger Preis" }) }).nonnegative("Preis darf nicht negativ sein"),
  supplierId: z.string().min(1).max(60).optional().nullable(),
});

export const supplierSchema = z.object({
  name: z.string().min(1, "Ein Name ist erforderlich").max(100, "Name zu lang"),
  contactName: z.string().max(100, "Zu lang").optional().nullable(),
  phone: z.string().max(30, "Zu lang").optional().nullable(),
  email: z.string().email("Ungültige E-Mail").max(150, "Zu lang").optional().nullable().or(z.literal("")),
  website: z.string().max(200, "Zu lang").optional().nullable(),
  street: z.string().max(100, "Zu lang").optional().nullable(),
  houseNumber: z.string().max(20, "Zu lang").optional().nullable(),
  postalCode: z.string().max(20, "Zu lang").optional().nullable(),
  city: z.string().max(100, "Zu lang").optional().nullable(),
  country: z.string().max(100, "Zu lang").optional().nullable(),
  monthlyCost: z.coerce.number({ errorMap: () => ({ message: "Ungültiger Betrag" }) }).nonnegative("Betrag darf nicht negativ sein").optional().nullable(),
  notes: z.string().max(1000, "Zu lang").optional().nullable(),
});
