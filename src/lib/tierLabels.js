// Anzeigenamen der Abo-Stufen — die EINZIGE Stelle, an der sie gepflegt werden.
//
// Die internen Werte (Prisma-Enum `Subscription`, Stripe-Metadaten, JWT,
// Routen wie /ErstelleRestaurantAccount/Professional) bleiben unverändert:
//   FreeTier     → "Free"
//   Business     → "Plus"     (mittlerer Tarif)
//   Professional → "Premium"  (höchster Tarif)
// Grund für die Trennung: Ein Umbenennen des Enums bräuchte eine Migration und
// würde laufende Stripe-Abos (metadata.tier) brechen. Angezeigt wird deshalb
// immer tierLabel(<Enum-Wert>), nie der Enum-Wert selbst.
//
// Reine Konstanten, ohne Server-Abhängigkeiten — darf auch in
// Client-Komponenten importiert werden. Die Produktnamen im Stripe-Dashboard
// (Rechnungen, Kundenportal) müssen von Hand gleich benannt werden.

export const TIER_LABELS = {
  NoSubscription: "Kein Abo",
  FreeTier: "Free",
  Business: "Plus",
  Professional: "Premium",
  // Altlast aus der früheren "Individuell"-Stufe, wird wie Business angezeigt.
  Individuell: "Plus",
};

export function tierLabel(subscription) {
  return TIER_LABELS[subscription] ?? TIER_LABELS.NoSubscription;
}
