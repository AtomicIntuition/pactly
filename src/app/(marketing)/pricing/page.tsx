import type { Metadata } from "next";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Cta } from "@/components/marketing/cta";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage(): React.ReactElement {
  return (
    <>
      <PricingCards />
      <Cta />
    </>
  );
}
