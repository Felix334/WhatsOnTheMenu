// Regeln der Preis-Massenänderung. Client-sicheres Modul ohne Server-Imports —
// von bulkPrice.js (Live-Vorschau im Editor) und api/user/profil/bulkPrice
// (serverseitige Berechnung) gemeinsam genutzt, damit Vorschau und
// tatsächlich gespeicherter Preis nicht auseinanderlaufen.

export const PRICE_MODES = ["percent", "amount"];
export const ROUNDING_MODES = ["none", "0.05", "0.10", "0.50", "endsWith99"];

export const ROUNDING_LABELS = {
  none: "Keine (auf Cent genau)",
  "0.05": "Auf 5 Cent",
  "0.10": "Auf 10 Cent",
  "0.50": "Auf 50 Cent",
  endsWith99: "Auf ,99 enden",
};

// Decimal(10,2) in der DB → 8 Vorkommastellen. Bewusst deutlich darunter
// gedeckelt, ein Gerichtpreis über 999.999,99 € ist immer ein Eingabefehler.
const MAX_PRICE = 999999.99;

/**
 * Wendet eine Preisänderung auf einen Einzelpreis an.
 * @returns {number|null} neuer Preis auf 2 Nachkommastellen, oder null bei ungültiger Eingabe
 */
export function applyPriceChange(oldPrice, mode, value, rounding = "none") {
  if (!Number.isFinite(oldPrice) || oldPrice < 0) return null;
  if (!PRICE_MODES.includes(mode) || !Number.isFinite(value)) return null;

  let next = mode === "percent" ? oldPrice * (1 + value / 100) : oldPrice + value;
  if (!Number.isFinite(next)) return null;

  switch (rounding) {
    case "0.05":
      next = Math.round(next / 0.05) * 0.05;
      break;
    case "0.10":
      next = Math.round(next / 0.1) * 0.1;
      break;
    case "0.50":
      next = Math.round(next / 0.5) * 0.5;
      break;
    case "endsWith99":
      next = Math.max(0, Math.floor(next)) + 0.99;
      break;
    default:
      break;
  }

  // Gleitkomma-Reste aus der Rundung (12.350000000000001) hier einfangen.
  next = Math.round(next * 100) / 100;

  if (next < 0) next = 0;
  if (next > MAX_PRICE) next = MAX_PRICE;
  return next;
}

/** Preis in deutscher Schreibweise, z. B. "12,50 €". */
export function formatPrice(value) {
  return `${Number(value ?? 0).toFixed(2).replace(".", ",")} €`;
}
