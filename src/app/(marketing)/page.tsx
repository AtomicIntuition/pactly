import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { SocialProof } from "@/components/marketing/social-proof";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Cta } from "@/components/marketing/cta";

export const metadata: Metadata = {
  title: "Overture — Proposals That Command Attention",
};

export default function LandingPage(): React.ReactElement {
  return (
    <>
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <PricingCards />
      <Cta />
    </>
  );
}
