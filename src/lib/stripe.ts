import Stripe from "stripe";

const isProd = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

const secretKey = isProd
  ? process.env.STRIPE_SECRET_KEY
  : (process.env.STRIPE_SECRET_KEY_TEST ?? process.env.STRIPE_SECRET_KEY);

if (!secretKey) {
  throw new Error("Missing Stripe secret key:");
}

export const stripe = new Stripe(secretKey);

export const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("Missing Stripe webhook secret");
}

export const PRICE_IDS = {
  Professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
  Business: process.env.STRIPE_BUSINESS_PRICE_ID,
} as const;

export type Tier = keyof typeof PRICE_IDS;

const TIER_ALIAS: Record<string, Tier> = {
  pro: "Professional",
  professional: "Professional",
  business: "Business",
};

// Aktuell buchbare Abo-Stufen — Professional ist noch "Coming Soon".
// Zum Freischalten das Tier hier eintragen (z. B. ["Business"]); das UI-Pendant
// ist TIER_AVAILABLE_UI in src/app/(Routes)/pricing/page.js. Professional bleibt
// bewusst auch nach dem Business-Launch vorerst gesperrt.
export const AVAILABLE_TIERS: readonly Tier[] = ["Business"];

export function isTierAvailable(tier: string): boolean {
  const key = TIER_ALIAS[tier.toLowerCase()];
  return key !== undefined && AVAILABLE_TIERS.includes(key);
}

export function getPriceId(tier: string): string | null {
  const key = TIER_ALIAS[tier.toLowerCase()];
  if (!key) return null;
  return PRICE_IDS[key] ?? null;
}

// Rückwärts-Lookup für Webhook-Events (z. B. customer.subscription.updated),
// die nur die Stripe-Preis-ID liefern, nicht unseren Tier-Namen.
export function getTierByPriceId(priceId: string): Tier | null {
  const entry = (Object.entries(PRICE_IDS) as [Tier, string | undefined][]).find(([, id]) => id === priceId);
  return entry ? entry[0] : null;
}

export function getSubscriptionTier(tier: string): "FreeTier" | "Professional" | "Business" {
  const TIER_MAP: Record<string, "FreeTier" | "Professional" | "Business"> = {
    free: "FreeTier",
    freetier: "FreeTier",
    pro: "Professional",
    professional: "Professional",
    business: "Business",
  };

  return TIER_MAP[tier.toLowerCase()] ?? "FreeTier";
}
