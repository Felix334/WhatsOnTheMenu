import Stripe from "stripe";

const secretKey =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SECRET_KEY
    : (process.env.STRIPE_SECRET_KEY_TEST ?? process.env.STRIPE_SECRET_KEY_TEST);

if (!secretKey) {
  throw new Error("Missing Stripe secret key");
}

export const stripe = new Stripe(secretKey);

export const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("Missing Stripe webhook secret");
}

export const PRICE_IDS = {
  pro: process.env.STRIPE_PRICE_PRO,
  premium: process.env.STRIPE_PRICE_PREMIUM,
} as const;

/**
 * Tier-safe typing
 */
export type Tier = keyof typeof PRICE_IDS;

/**
 * Get Stripe Price ID safely
 */
export function getPriceId(tier: string): string | null {
  const normalized = tier.toLowerCase() as Tier;

  const priceId = PRICE_IDS[normalized];

  return priceId ?? null;
}

/**
 * Maps Stripe tier names (e.g. "pro", "premium") to internal subscription enum values.
 * IMPORTANT: input is always lowercased before lookup.
 */
export function getSubscriptionTier(tier: string): "FreeTier" | "Professional" | "Individuell" {
  const normalized = tier.toLowerCase();

  const TIER_MAP: Record<string, "FreeTier" | "Professional" | "Individuell"> = {
    free:         "FreeTier",
    freetier:     "FreeTier",
    pro:          "Professional",
    professional: "Professional",
    premium:      "Individuell",
    individuell:  "Individuell",
  };

  return TIER_MAP[normalized] ?? "Professional";
}