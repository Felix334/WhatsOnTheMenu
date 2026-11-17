/**
 * Setzt Werte in einen Woerterbuch-Text ein: fmt("{n} Gerichte", { n: 3 }).
 * Unbekannte Platzhalter bleiben stehen, damit ein Tippfehler im Woerterbuch
 * sichtbar wird statt still zu verschwinden.
 */
export function fmt(template, vars = {}) {
  return String(template ?? "").replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

/**
 * Einzahl/Mehrzahl: plural(1, "{n} Gericht", "{n} Gerichte") -> "1 Gericht".
 * Fuer Deutsch und Englisch reicht die Unterscheidung 1 / alles andere.
 */
export function plural(n, one, other, vars = {}) {
  return fmt(n === 1 ? one : other, { n, ...vars });
}
