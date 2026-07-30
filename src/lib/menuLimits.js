// Kategorie-/Gerichte-Limits pro Abo-Tarif. Client-sicheres Modul ohne
// Server-Imports (getToken/prisma) — von TierLimits.js (UI-Anzeige) und
// setData/edditData (route.ts, serverseitige Durchsetzung) gemeinsam genutzt.
export const MENU_ENTRY_LIMITS = {
  FreeTier: { CategoryLimit: 7, DishLimit: 50 },
  Business: { CategoryLimit: 15, DishLimit: 100 },
  Professional: { CategoryLimit: 25, DishLimit: 200 },
};

// Unbekannte/fehlende Abo-Werte (z. B. "NoSubscription") fallen auf das
// restriktivste Limit (FreeTier) zurück — nie unlimitiert.
export function getMenuLimits(subscription) {
  return MENU_ENTRY_LIMITS[subscription] ?? MENU_ENTRY_LIMITS.FreeTier;
}
