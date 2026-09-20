// Parser der Schnellerfassung: wandelt eingefügten Text in Gericht-Zeilen um.
// Bewusst als eigenes Modul ohne React-Abhängigkeit, damit die Logik separat
// nachvollziehbar bleibt (bulkImport.js rendert nur noch das Ergebnis).
//
// Unterstützte Trennzeichen: | (Vorzug), Tabulator (Excel-Paste), Semikolon.
// Unterstützte Zeilenformate:
//   Name | Beschreibung | Preis
//   Name | Preis
//   Name | Beschreibung
//   Name 12,50            (Preis am Zeilenende)
//   Name
// Leerzeilen und Zeilen, die mit # beginnen, werden übersprungen.

const SEPARATORS = ["|", "\t", ";"];

// Nur eine reine Zahl mit optionalem €/Leerzeichen gilt als Preis — damit wird
// "Pizza 4 Jahreszeiten" nicht als Preis 4 fehlinterpretiert (dort greift die
// Zeilenende-Erkennung nur, wenn wirklich nichts anderes folgt).
const PRICE_ONLY = /^\s*(\d+(?:[.,]\d{1,2})?)\s*(?:€|EUR)?\s*$/i;
const PRICE_AT_END = /^(.*\S)\s+(\d+(?:[.,]\d{1,2})?)\s*(?:€|EUR)?$/i;

// Sieht aus wie ein Preisversuch (nur Ziffern/Trenner/Währung), auch wenn das
// Format nicht stimmt — z. B. "12,505" oder "12.5.5". Solche Zeilen werden als
// Fehler gemeldet statt still mit 0,00 € übernommen zu werden. Freitext wie
// "Mit 2 Beilagen" fällt hier bewusst nicht hinein und gilt als Beschreibung.
const PRICE_ATTEMPT = /^[\d.,\s]*\d[\d.,\s]*(?:€|EUR)?$/i;

function looksLikePrice(part) {
  return PRICE_ONLY.test(part ?? "");
}

function looksLikeBrokenPrice(part) {
  const value = (part ?? "").trim();
  return value !== "" && !PRICE_ONLY.test(value) && PRICE_ATTEMPT.test(value);
}

function toNumber(priceRaw) {
  const match = PRICE_ONLY.exec(priceRaw ?? "");
  if (!match) return null;
  const num = Number.parseFloat(match[1].replace(",", "."));
  return Number.isFinite(num) ? num : null;
}

/** Wählt das Trennzeichen, das im Text am häufigsten vorkommt. */
function detectSeparator(text) {
  let best = null;
  let bestCount = 0;
  for (const sep of SEPARATORS) {
    const count = text.split(sep).length - 1;
    if (count > bestCount) {
      best = sep;
      bestCount = count;
    }
  }
  return best;
}

/**
 * @returns {{rows: Array, validRows: Array, errorCount: number, separator: string|null}}
 * Jede Zeile: { lineNumber, raw, name, description, price, error }
 */
export function parseBulkMenuText(text) {
  const source = String(text ?? "");
  const separator = detectSeparator(source);
  const rows = [];

  source.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    let name = "";
    let description = "";
    let priceRaw = "";
    let brokenPrice = null;

    const parts = separator ? trimmed.split(separator).map((p) => p.trim()) : [trimmed];

    if (parts.length === 1) {
      // Kein Trennzeichen in dieser Zeile → Preis am Zeilenende versuchen.
      const atEnd = PRICE_AT_END.exec(trimmed);
      if (atEnd) {
        name = atEnd[1].trim();
        priceRaw = atEnd[2];
      } else {
        name = trimmed;
      }
    } else if (parts.length === 2) {
      name = parts[0];
      if (looksLikePrice(parts[1])) priceRaw = parts[1];
      else if (looksLikeBrokenPrice(parts[1])) brokenPrice = parts[1];
      else description = parts[1];
    } else {
      name = parts[0];
      const last = parts[parts.length - 1];
      if (looksLikePrice(last)) {
        description = parts.slice(1, -1).join(" ").trim();
        priceRaw = last;
      } else if (looksLikeBrokenPrice(last)) {
        description = parts.slice(1, -1).join(" ").trim();
        brokenPrice = last;
      } else {
        // Letzte Spalte ist erkennbar Text → alles nach dem Namen ist Beschreibung.
        description = parts.slice(1).join(" ").trim();
      }
    }

    let error = null;
    let price = 0;

    if (!name) {
      error = "Name fehlt";
    } else if (name.length > 120) {
      error = "Name zu lang (max. 120 Zeichen)";
    } else if (brokenPrice) {
      error = `Preis "${brokenPrice}" nicht lesbar`;
    } else if (priceRaw) {
      const parsed = toNumber(priceRaw);
      if (parsed === null) error = `Preis "${priceRaw}" nicht lesbar`;
      else price = parsed;
    }

    rows.push({
      lineNumber: index + 1,
      raw: trimmed,
      name,
      description: description.slice(0, 500),
      price,
      error,
    });
  });

  const validRows = rows.filter((r) => !r.error);
  return {
    rows,
    validRows,
    errorCount: rows.length - validRows.length,
    separator,
  };
}

/**
 * Baut aus geparsten Zeilen den `menuSection`-Eintrag, den setData erwartet.
 * Preis als String mit Punkt — parsePrice in der API akzeptiert beides, aber
 * einheitliche Daten vermeiden Überraschungen.
 */
export function rowsToMenuSection(categoryGroup, title, rows) {
  return {
    type: "menuSection",
    section: {
      categoryGroup,
      title,
      items: rows.map((r) => ({
        name: r.name,
        description: r.description || "",
        price: r.price.toFixed(2),
      })),
    },
  };
}
