import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { Check, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/constants";
import type { PlanType } from "@/types";

function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}`;
}

function getPlanUsageLabel(plan: PlanType): string {
  const planData = PLANS[plan];
  if (planData.proposals_per_month === -1) return "Unlimited";
  return `${planData.proposals_per_month} proposals/month`;
}

async function BillingData(): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(supabase, user.id);

  if (!profile) redirect("/login");

  const currentPlan = PLANS[profile.plan];
  const usagePercent =
    currentPlan.proposals_per_month === -1
      ? 0
      : Math.min(
          (profile.proposal_count / currentPlan.proposals_per_month) * 100,
          100
        );

  return (
    <div className="space-y-8">
      {/* Current Plan & Usage */}
      <Card className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Current Plan</h3>
              <Badge variant="secondary">{currentPlan.name}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {getPlanUsageLabel(profile.plan)}
            </p>
          </div>
          {profile.plan !== "agency" && (
            <Button asChild size="sm">
              <a href="/api/checkout?plan=pro">
                <Zap className="mr-1.5 h-4 w-4" />
                Upgrade Plan
              </a>
            </Button>
          )}
        </div>

        {currentPlan.proposals_per_month !== -1 && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {profile.proposal_count} of {currentPlan.proposals_per_month} proposals
                used
              </span>
              <span>{Math.round(usagePercent)}%</span>
            </div>
            <Progress value={usagePercent} className="h-2" />
          </div>
        )}
      </Card>

      {/* Plan Comparison */}
      <div>
        <h3 className="text-sm font-medium">Compare Plans</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Choose the plan that fits your needs.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(PLANS) as [PlanType, (typeof PLANS)[PlanType]][]).map(
            ([key, plan]) => {
              const isCurrentPlan = key === profile.plan;
              const isPopular = key === "pro";

              return (
                <Card
                  key={key}
                  className={cn(
                    "relative rounded-xl border bg-card p-6 shadow-sm",
                    isPopular && "border-primary ring-1 ring-primary"
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center">
                    <h4 className="text-sm font-medium">{plan.name}</h4>
                    <div className="mt-2">
                      <span className="text-3xl font-bold tracking-tight">
                        {formatPrice(plan.price_monthly)}
                      </span>
                      {plan.price_monthly > 0 && (
                        <span className="text-sm text-muted-foreground">/mo</span>
                      )}
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {isCurrentPlan ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant={isPopular ? "default" : "outline"}
                        className="w-full"
                        asChild
                      >
                        <a href={`/api/checkout?plan=${key}`}>
                          {key === "free" ? "Downgrade" : "Upgrade"}
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Billing",
};

export default function BillingPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Manage your subscription and usage."
      />
      <Suspense
        fallback={
          <div className="space-y-8">
            <Skeleton className="h-40 rounded-xl" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          </div>
        }
      >
        <BillingData />
      </Suspense>
    </div>
  );
}
