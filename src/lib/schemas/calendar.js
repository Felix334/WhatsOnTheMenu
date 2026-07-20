import { z } from "zod";

// Validierung für Kalender-Einträge (Aktionen/Events). Wird sowohl im
// API-Handler als auch im Profil-Editor genutzt.
export const calendarEntrySchema = z.object({
  eventName: z.string().min(1, "Ein Titel ist erforderlich").max(100, "Titel zu lang"),
  eventDescription: z.string().min(1, "Eine Beschreibung ist erforderlich").max(500, "Beschreibung zu lang"),
  date: z.coerce.date({ errorMap: () => ({ message: "Ungültiges Datum" }) }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Ungültige Uhrzeit (HH:MM)"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Ungültige Uhrzeit (HH:MM)"),
  type: z.enum(["promotion", "event", "specialDish"], { errorMap: () => ({ message: "Ungültiger Typ" }) }),
  dishId: z.string().min(1).max(60).optional().nullable(),
});
