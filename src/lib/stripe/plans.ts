import type { PlanType } from "@/types";

export interface PlanConfig {
  name: string;
  price_monthly: number;
  stripe_price_id?: string;
  proposals_per_month: number;
  features: string[];
}

export const STRIPE_PLANS: Record<PlanType, PlanConfig> = {
  free: {
    name: "Free",
    price_monthly: 0,
    proposals_per_month: 5,
    features: ["5 proposals/month", "PDF export", "Email support"],
  },
  pro: {
    name: "Pro",
    price_monthly: 2900,
    stripe_price_id: process.env.STRIPE_PRO_PRICE_ID,
    proposals_per_month: 50,
    features: [
      "50 proposals/month",
      "Custom branding",
      "Client portal",
      "Priority support",
      "Templates",
    ],
  },
  agency: {
    name: "Agency",
    price_monthly: 9900,
    stripe_price_id: process.env.STRIPE_AGENCY_PRICE_ID,
    proposals_per_month: -1,
    features: [
      "Unlimited proposals",
      "Team members",
      "Custom domain",
      "API access",
      "White-label PDF",
      "Dedicated support",
    ],
  },
};
