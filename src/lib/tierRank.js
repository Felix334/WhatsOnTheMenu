// Rang-Hierarchie der Abo-Tarife (höher = mehr Leistung). Client-sicheres Modul
// ohne Server-Imports — von renderDynamicLinks.js, den Tarif-Übersichtsseiten
// und den Registrierungs-/Checkout-Routen gemeinsam genutzt, um zu verhindern,
// dass ein Nutzer ein bereits vorhandenes oder geringeres Abo erneut abschließt.
export const TIER_RANK = {
  NoSubscription: 0,
  FreeTier: 1,
  Business: 2,
  Professional: 3,
};

// true, wenn `current` bereits ein gleichwertiges oder höheres Abo als `target` ist.
export function hasEqualOrHigherTier(current, target) {
  const currentRank = TIER_RANK[current] ?? 0;
  const targetRank = TIER_RANK[target] ?? 0;
  return currentRank >= targetRank;
}
