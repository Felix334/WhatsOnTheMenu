// Kategorie-/Gerichte-Limits pro Abo-Tarif. Client-sicheres Modul ohne
// Server-Imports (getToken/prisma) — von TierLimits.js (UI-Anzeige) und
// setData/edditData (route.ts, serverseitige Durchsetzung) gemeinsam genutzt.
export const MENU_ENTRY_LIMITS = {
  FreeTier: { CategoryLimit: 10, DishLimit: 80 },
  Business: { CategoryLimit: 25, DishLimit: 150 },
  Professional: { CategoryLimit: 50, DishLimit: 300 },
};

// Unbekannte/fehlende Abo-Werte (z. B. "NoSubscription") fallen auf das
// restriktivste Limit (FreeTier) zurück — nie unlimitiert.
export function getMenuLimits(subscription) {
  return MENU_ENTRY_LIMITS[subscription] ?? MENU_ENTRY_LIMITS.FreeTier;
}
