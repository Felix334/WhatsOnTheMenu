// Meta-Description fuer Speisekarten-Seiten (Hauptdomain + Restaurant-Subdomain).
// Suchmaschinen wollen 25–160 Zeichen (Bing meldet alles andere im Site Scan).
// Die Restaurant-Beschreibung ist Nutzertext mit bis zu 300 Zeichen — sie kann
// also zu lang oder (z. B. nur "Pizzeria") zu kurz sein.
const MIN = 25;
const MAX = 160;

function clamp(text) {
  if (text.length <= MAX) return text;
  let cut = text.slice(0, MAX - 1);
  // An der letzten Wortgrenze schneiden, solange dabei nicht zu viel verloren geht
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > MAX * 0.6) cut = cut.slice(0, lastSpace);
  return cut.replace(/[\s.,;:–—-]+$/, "") + "…";
}

export function menuMetaDescription(data) {
  const own = (data.description || "").replace(/\s+/g, " ").trim();
  if (own.length >= MIN) return clamp(own);
  return clamp(`Digitale Speisekarte von ${data.name} — jetzt ansehen und bestellen.`);
}
