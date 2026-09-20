// Welche Abo-Stufen die Oberfläche anbieten darf.
//
// Warum eine eigene Datei und nicht der Import aus src/lib/stripe.ts:
// stripe.ts legt beim Import den Stripe-Client mit dem Secret Key an. Diese
// Datei enthält bewusst nur Konstanten und darf deshalb auch in
// Client-Komponenten importiert werden.
//
// WICHTIG: Das hier ist reine Anzeige-Logik. Die verbindliche Sperre ist
// AVAILABLE_TIERS in src/lib/stripe.ts, serverseitig erzwungen in
// api/payment/checkout — ein manipulierter Client kommt daran nicht vorbei.
// Beide Listen beim Freischalten eines Tarifs gemeinsam anpassen.

export const UI_AVAILABLE_TIERS = ["Business"];

export function isTierAvailableUI(tier) {
  return UI_AVAILABLE_TIERS.includes(tier);
}
