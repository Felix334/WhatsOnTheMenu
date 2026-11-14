import { createHash, randomBytes } from "crypto";
import { z } from "zod";

// Regeln für Übernahme-Links: Ein Bau-Account baut eine Speisekarte vor, der
// Wirt löst den Link mit seinem eigenen Google-Konto ein und wird Owner.
// Gemeinsam genutzt von /api/user/profil/claimLink (Link erzeugen) und
// /api/claim/[token] (Vorschau + Einlösen). Nur serverseitig importieren.

// Gültigkeit eines Links
export const CLAIM_TTL_MS = 14 * 24 * 60 * 60 * 1000;

// 32 Zufallsbytes als base64url = genau 43 Zeichen
export const CLAIM_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export const claimCreateSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Ungültige E-Mail-Adresse")
    .max(254)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export function generateClaimToken() {
  return randomBytes(32).toString("base64url");
}

// In der DB liegt nur der Hash — ein DB-Leak verrät keine einlösbaren Links.
export function hashClaimToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

// Welche Accounts Übernahme-Links erzeugen dürfen, steht in der Env-Variable
// CLAIM_BUILDER_EMAILS (kommagetrennt). Ohne Eintrag darf niemand.
export function isClaimBuilder(email) {
  if (!email) return false;
  const allowed = (process.env.CLAIM_BUILDER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

// Bau-Account muss ein kostenloser Owner ohne Stripe-Abo sein: Beim Einlösen
// wird er zurückgesetzt, ein bezahltes Abo würde dabei verwaist.
export function canBuildClaims(user) {
  return Boolean(user && user.role === "Owner" && !user.stripeSubscriptionId && isClaimBuilder(user.email));
}
