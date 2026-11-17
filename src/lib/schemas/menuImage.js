// Regeln für das Hintergrundbild der Speisekarte — gemeinsam genutzt von der
// Upload-Route (api/user/profil/bgImage), dem Profil-Editor und der Kontolöschung.
// Die Bucket-Einstellungen in Supabase (Größenlimit, erlaubte Typen) sollten
// dieselben Werte haben, damit Supabase sie auch ohne unseren Code durchsetzt.

export const MENU_IMAGE_BUCKET = "menu-images";

// Unter Vercels Body-Limit von 4,5 MB für Serverless-Funktionen. Der Editor
// verkleinert größere Bilder vor dem Upload im Browser.
export const MENU_IMAGE_MAX_BYTES = 4 * 1024 * 1024;

// Bewusst kein SVG: SVG kann Skripte enthalten.
export const MENU_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Längste Kante der Desktop-Fassung (und Zielgröße der Komprimierung im Browser).
export const MENU_IMAGE_MAX_EDGE = 1920;

// Längste Kante der Handy-Fassung. Gäste scannen fast immer mit dem Handy —
// diese Fassung macht den Großteil des Traffics aus.
export const MENU_IMAGE_SMALL_EDGE = 1280;

// WebP-Qualität auf dem Server; bei einem Hintergrundbild kein sichtbarer Unterschied zu 80.
export const MENU_IMAGE_QUALITY = 75;

// Zu jedem gespeicherten Bild (<uuid>.webp) gibt es eine Handy-Fassung (<uuid>-sm.webp).
// In der DB steht nur der Pfad der großen Fassung; die kleine wird daraus abgeleitet.
export function smallVariantPath(pathOrUrl) {
  return typeof pathOrUrl === "string" ? pathOrUrl.replace(/\.webp$/, "-sm.webp") : pathOrUrl;
}

// Schutz vor "Dekompressionsbomben": winzige Datei, riesige Pixelzahl.
export const MENU_IMAGE_MAX_INPUT_PIXELS = 50_000_000;

// Hintergrundbild gibt es in jedem Owner-Tarif (Free = 1 Hintergrundbild).
export const BG_IMAGE_SUBSCRIPTIONS = ["FreeTier", "Business", "Professional"];

export function bgImageFolder(restaurantId) {
  return `restaurants/${restaurantId}/background`;
}

// Nur Pfade löschen, die wirklich zu diesem Restaurant gehören — auch wenn in
// der DB aus irgendeinem Grund etwas anderes stünde.
export function isBgImagePathOf(path, restaurantId) {
  if (typeof path !== "string") return false;
  const prefix = `${bgImageFolder(restaurantId)}/`;
  return path.startsWith(prefix) && /^[a-zA-Z0-9-]+\.webp$/.test(path.slice(prefix.length));
}
