import Stripe from "stripe";

const secretKey =
  process.env.STRIPE_SECRET_KEY_TEST ??
  process.env.STRIPE_SECRET_KEY;

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
  premium: process.env.STRIPE_PREMIUM_PRICE_ID,
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
 * Maps internal tier naming
 */
export function getSubscriptionTier(tier: string): "FreeTier" | "Professional" | "Individuell" {
  const normalized = tier.toLowerCase();

  const TIER_MAP: Record<string, "FreeTier" | "Professional" | "Individuell"> = {
    FreeTier: "FreeTier",
    Professional: "Professional",
    Individuell: "Individuell",
  };

  return TIER_MAP[normalized] ?? "Professional";
}