import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  pro: {
    name: "Pro",
    price: 900, // cents
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    topics: 10,
    pushes: 10_000,
  },
  business: {
    name: "Business",
    price: 2900, // cents
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    topics: Infinity,
    pushes: 100_000,
  },
} as const;

export type PaidPlan = keyof typeof PLANS;

export const PLAN_LIMITS = {
  free: { topics: 1, pushes: 100, privateTopics: false, webhooks: false },
  pro: { topics: 10, pushes: 10_000, privateTopics: true, webhooks: true },
  business: { topics: Infinity, pushes: 100_000, privateTopics: true, webhooks: true },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;
