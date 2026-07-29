// Kalender-Einträge (Aktionen/Events) sind ein Premium-Feature (Professional/Business).
// Client-sicheres Modul ohne Server-Imports (getToken/prisma) — von calendarWin.js
// und calendarAuth.js/route.js gemeinsam genutzt. Die eigentliche Prüfung passiert
// immer serverseitig (route.js), hier dienen die Werte auch der UI-Anzeige.
export const CALENDAR_ENTRY_LIMITS = {
  Professional: 50,
  Business: 15,
};

// Wie weit im Voraus ein Event angelegt werden darf: Business nur die nächsten
// 30 Tage, Professional ein ganzes Jahr.
export const CALENDAR_DATE_HORIZON_DAYS = {
  Professional: 365,
  Business: 30,
};

// Spätestes erlaubtes Datum (Mitternacht, lokale Zeit) für das gegebene Abo,
// oder null wenn kein Limit gilt.
export function getCalendarMaxDate(subscription) {
  const days = CALENDAR_DATE_HORIZON_DAYS[subscription];
  if (!days) return null;
  const max = new Date();
  max.setHours(0, 0, 0, 0);
  max.setDate(max.getDate() + days);
  return max;
}
