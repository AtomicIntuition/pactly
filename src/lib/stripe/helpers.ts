import { getStripe } from "./client";
import type { PlanType } from "@/types";
import { STRIPE_PLANS } from "./plans";

export async function createCheckoutSession(options: {
  userId: string;
  email: string;
  plan: PlanType;
  returnUrl: string;
}): Promise<string> {
  const stripe = getStripe();
  const planConfig = STRIPE_PLANS[options.plan];

  if (!planConfig.stripe_price_id) {
    throw new Error(`No Stripe price ID configured for plan: ${options.plan}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: options.email,
    line_items: [
      {
        price: planConfig.stripe_price_id,
        quantity: 1,
      },
    ],
    success_url: `${options.returnUrl}/settings/billing?success=true`,
    cancel_url: `${options.returnUrl}/settings/billing?canceled=true`,
    metadata: {
      userId: options.userId,
      plan: options.plan,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
}

export async function createPortalSession(options: {
  customerId: string;
  returnUrl: string;
}): Promise<string> {
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: options.customerId,
    return_url: `${options.returnUrl}/settings/billing`,
  });

  return session.url;
}
