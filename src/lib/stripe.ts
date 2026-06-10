import Stripe from "stripe";

//const secretKey = process.env.NODE_ENV === "production" ? process.env.STRIPE_SECRET_KEY : (process.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY_TEST);
const secretKey = process.env.STRIPE_SECRET_KEY;

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
  premium: "Business",
};

export function getPriceId(tier: string): string | null {
  const key = TIER_ALIAS[tier.toLowerCase()];
  if (!key) return null;
  return PRICE_IDS[key] ?? null;
}

export function getSubscriptionTier(tier: string): "FreeTier" | "Professional" | "Business" {
  const TIER_MAP: Record<string, "FreeTier" | "Professional" | "Business"> = {
    free: "FreeTier",
    freetier: "FreeTier",
    pro: "Professional",
    professional: "Professional",
    business: "Business",
    premium: "Business",
  };

  return TIER_MAP[tier.toLowerCase()] ?? "FreeTier";
}
