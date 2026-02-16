import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProposals } from "@/lib/supabase/queries";
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

  let recentProposals: Awaited<ReturnType<typeof getProposals>>["proposals"] = [];

  try {
    const result = await getProposals(supabase, user.id, { limit: 10 });
    recentProposals = result.proposals;
  } catch {
    // Tables may not exist yet — show empty dashboard
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <DashboardContent
      recentProposals={recentProposals}
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
