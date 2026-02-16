import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Cta } from "@/components/marketing/cta";

export const metadata: Metadata = {
  title: "Pactly — AI-Powered Proposals That Close Deals",
};

export default function LandingPage(): React.ReactElement {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <PricingCards />
      <Cta />
    </>
  );
}
