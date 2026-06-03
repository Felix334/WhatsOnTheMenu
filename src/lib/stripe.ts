import Stripe from "stripe";

//const secretKey = process.env.NODE_ENV === "production" ? process.env.STRIPE_SECRET_KEY : (process.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY_TEST);
const secretKey = process.env.STRIPE_SECRET_KEY_TEST;

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

/**
 * Tier-safe typing
 */
export type Tier = keyof typeof PRICE_IDS;

/**
 * Get Stripe Price ID safely
 */
export function getPriceId(tier: string): string | null {
  const priceId = PRICE_IDS[tier as Tier];
  return priceId ?? null;
}

/**
 * Maps Stripe tier names (e.g. "pro", "premium") to internal subscription enum values.
 * IMPORTANT: input is always lowercased before lookup.
 */
export function getSubscriptionTier(tier: string): "FreeTier" | "Professional" | "Business" {
  const normalized = tier.toLowerCase();

  const TIER_MAP: Record<string, "FreeTier" | "Professional" | "Business"> = {
    free: "FreeTier",
    freetier: "FreeTier",
    pro: "Professional",
    professional: "Professional",
    business: "Business"
  };

  return TIER_MAP[normalized] ?? "FreeTier";
}
