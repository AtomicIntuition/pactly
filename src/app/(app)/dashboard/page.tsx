import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getProposals, getActivityLog } from "@/lib/supabase/queries";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function DashboardData(): Promise<React.ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div />;
  }

  const defaultStats = {
    totalProposals: 0,
    pendingReview: 0,
    acceptedThisMonth: 0,
    revenueThisMonth: 0,
    proposalsThisWeek: 0,
    acceptanceRate: 0,
    revenueChange: 0,
  };

  let stats = defaultStats;
  let recentProposals: Awaited<ReturnType<typeof getProposals>>["proposals"] = [];
  let activity: Awaited<ReturnType<typeof getActivityLog>> = [];

  try {
    const results = await Promise.all([
      getDashboardStats(supabase, user.id),
      getProposals(supabase, user.id, { limit: 5 }),
      getActivityLog(supabase, user.id, 10),
    ]);
    stats = results[0];
    recentProposals = results[1].proposals;
    activity = results[2];
  } catch {
    // Tables may not exist yet — show empty dashboard
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <DashboardContent
      stats={stats}
      recentProposals={recentProposals}
      activity={activity}
      userName={user.user_metadata?.full_name ?? "there"}
      greeting={greeting}
    />
  );
}

export default function DashboardPage(): React.ReactElement {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}
