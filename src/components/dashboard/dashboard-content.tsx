"use client";

import Link from "next/link";
import { FileText, Users, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/shared/stats-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ProposalStatusBadge } from "@/components/proposals/proposal-status-badge";
import type { Proposal, ActivityLog, DashboardStats } from "@/types";

interface DashboardContentProps {
  stats: DashboardStats;
  recentProposals: Proposal[];
  activity: ActivityLog[];
  userName: string;
  greeting: string;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function DashboardContent({
  stats,
  recentProposals,
  activity,
  userName,
  greeting,
}: DashboardContentProps): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {greeting}, {userName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s your proposal activity
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Proposals"
          value={stats.totalProposals.toString()}
          subtext={`+${stats.proposalsThisWeek} this week`}
          trend={stats.proposalsThisWeek > 0 ? "up" : "neutral"}
        />
        <StatsCard
          label="Pending Review"
          value={stats.pendingReview.toString()}
        />
        <StatsCard
          label="Accepted This Month"
          value={stats.acceptedThisMonth.toString()}
          subtext={stats.totalProposals > 0 ? `${stats.acceptanceRate}% rate` : undefined}
          trend={stats.acceptedThisMonth > 0 ? "up" : "neutral"}
        />
        <StatsCard
          label="Revenue This Month"
          value={formatCurrency(stats.revenueThisMonth)}
          subtext={
            stats.revenueChange !== 0
              ? `${stats.revenueChange > 0 ? "+" : ""}${formatCurrency(stats.revenueChange)} vs last month`
              : undefined
          }
          trend={stats.revenueChange > 0 ? "up" : stats.revenueChange < 0 ? "down" : "neutral"}
        />
      </div>

      {/* Recent Proposals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Proposals</h2>
          <Link href="/proposals">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View all →
            </Button>
          </Link>
        </div>
        {recentProposals.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No proposals yet"
            description="Create your first proposal to get started."
            actionLabel="Create Proposal"
            actionHref="/proposals/new"
          />
        ) : (
          <div className="space-y-3">
            {recentProposals.map((proposal) => (
              <Link key={proposal.id} href={`/proposals/${proposal.id}`}>
                <Card className="rounded-xl border bg-card p-4 shadow-sm hover:bg-muted/50 transition-colors duration-150 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{proposal.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {proposal.client_company ?? proposal.client_name ?? "No client"}
                        {proposal.investment.total_cents > 0 && (
                          <>
                            {" "}
                            &middot;{" "}
                            <span className="font-mono tabular-nums">
                              {formatCurrency(proposal.investment.total_cents)}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      <ProposalStatusBadge status={proposal.status} />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(proposal.updated_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Activity Feed */}
      {activity.length > 0 && (
        <section>
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 text-sm">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="text-muted-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/proposals/new">
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              New Proposal
            </Button>
          </Link>
          <Link href="/clients">
            <Button variant="outline">
              <Users className="mr-1.5 h-4 w-4" />
              Add Client
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
