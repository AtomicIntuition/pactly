"use client";

import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ProposalStatusBadge } from "@/components/proposals/proposal-status-badge";
import type { Proposal } from "@/types";

interface DashboardContentProps {
  recentProposals: Proposal[];
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
  recentProposals,
  userName,
  greeting,
}: DashboardContentProps): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* Greeting + New Proposal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {greeting}, {userName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s your recent proposals
          </p>
        </div>
        <Link href="/proposals/new">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            New Proposal
          </Button>
        </Link>
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
    </div>
  );
}
