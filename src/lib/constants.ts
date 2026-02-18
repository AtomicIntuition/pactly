import type { PlanType } from "@/types";

export const APP_NAME = "Overture";
export const APP_DESCRIPTION = "Proposals that command attention";

export const SERVICE_TYPES = [
  "Web Development",
  "Mobile App",
  "Design",
  "Marketing",
  "Consulting",
  "Writing",
  "Media",
  "Events",
  "Other",
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export const PROPOSAL_STATUSES = [
  "generating",
  "draft",
  "review",
  "sent",
  "accepted",
  "declined",
  "expired",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  generating: "Generating",
  draft: "Draft",
  review: "In Review",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
};

export const PLANS = {
  free: {
    name: "Free",
    price_monthly: 0,
    proposals_per_month: 5,
    features: ["5 proposals/month", "PDF export", "Email support"],
  },
  pro: {
    name: "Pro",
    price_monthly: 2900,
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
} as const satisfies Record<PlanType, {
  name: string;
  price_monthly: number;
  proposals_per_month: number;
  features: string[];
}>;

export const GENERATION_STEPS = [
  "Analyzing client brief",
  "Researching client company",
  "Drafting scope of work",
  "Creating timeline",
  "Calculating investment",
  "Writing executive summary",
  "Finalizing proposal",
] as const;

export const AUTOSAVE_DELAY_MS = 2000;
export const PROPOSAL_VALIDITY_DAYS = 30;
