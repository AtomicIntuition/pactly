import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PlanType } from "@/types";

const planOrder: PlanType[] = ["free", "pro", "agency"];

export function PricingCards(): React.ReactElement {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {planOrder.map((planKey) => {
            const plan = PLANS[planKey];
            const isPopular = planKey === "pro";

            return (
              <Card
                key={planKey}
                className={cn(
                  "relative rounded-xl border bg-card p-8 shadow-sm",
                  isPopular && "border-primary shadow-md ring-1 ring-primary"
                )}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold font-mono tabular-nums">
                      ${plan.price_monthly / 100}
                    </span>
                    {plan.price_monthly > 0 && (
                      <span className="text-sm text-muted-foreground">/month</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.proposals_per_month === -1
                      ? "Unlimited proposals"
                      : `${plan.proposals_per_month} proposals per month`}
                  </p>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="mt-8 block">
                  <Button
                    variant={isPopular ? "default" : "outline"}
                    className="w-full"
                  >
                    {planKey === "free" ? "Get Started" : `Start with ${plan.name}`}
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
