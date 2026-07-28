import { z } from "zod";

// Validierung für Kalender-Einträge (Aktionen/Events). Wird sowohl im
// API-Handler als auch im Profil-Editor genutzt.
const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Ungültige Uhrzeit (HH:MM)");

export const calendarEntrySchema = z
  .object({
    eventName: z.string().min(1, "Ein Titel ist erforderlich").max(100, "Titel zu lang"),
    eventDescription: z.string().min(1, "Eine Beschreibung ist erforderlich").max(500, "Beschreibung zu lang"),
    date: z.coerce.date({ errorMap: () => ({ message: "Ungültiges Datum" }) }),
    // Mehrtägiges Event (Zeitraum über mehrere Tage) — schließt startTime/endTime aus
    endDate: z.coerce.date().optional().nullable(),
    // Eintägiges Event mit Zeitfenster — schließt endDate aus. Beide leer = ganztägig.
    startTime: timeString.optional().nullable(),
    endTime: timeString.optional().nullable(),
    type: z.enum(["promotion", "event", "specialDish"], { errorMap: () => ({ message: "Ungültiger Typ" }) }),
    dishId: z.string().min(1).max(60).optional().nullable(),
  })
  .refine((data) => !!data.startTime === !!data.endTime, {
    message: "Start- und Endzeit müssen zusammen angegeben werden (oder beide leer lassen für ganztägig)",
    path: ["startTime"],
  })
  .refine((data) => !data.endDate || !(data.startTime || data.endTime), {
    message: "Ein mehrtägiges Event kann kein Zeitfenster an einem einzelnen Tag haben",
    path: ["endDate"],
  })
  .refine((data) => !data.endDate || data.endDate >= data.date, {
    message: "Das Enddatum muss nach dem Startdatum liegen",
    path: ["endDate"],
  });
