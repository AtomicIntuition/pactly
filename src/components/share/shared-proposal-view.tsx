"use client";

import { useState } from "react";
import { Diamond, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { resolveProposalColors } from "@/lib/templates";
import type { Proposal, Profile } from "@/types";

interface SharedProposalViewProps {
  proposal: Proposal;
  profile: Profile;
  token: string;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function SharedProposalView({
  proposal,
  profile,
  token,
}: SharedProposalViewProps): React.ReactElement {
  const [responding, setResponding] = useState(false);
  const [responded, setResponded] = useState(
    proposal.status === "accepted" || proposal.status === "declined"
  );
  const colors = resolveProposalColors(proposal, profile);
  const companyName = profile.company_name || profile.full_name;

  const handleRespond = async (accept: boolean): Promise<void> => {
    setResponding(true);
    try {
      const response = await fetch(`/api/share/${token}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: accept }),
      });

      if (!response.ok) throw new Error("Failed to respond");

      setResponded(true);
      toast.success(accept ? "Proposal accepted!" : "Proposal declined");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setResponding(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* Proposal Content */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 text-white" style={{ backgroundColor: colors.primary }}>
            <p className="text-sm font-medium opacity-80">{companyName}</p>
            <h1 className="mt-2 text-2xl font-semibold">{proposal.title}</h1>
            <div className="mt-4 flex flex-wrap gap-6 text-sm opacity-80">
              {proposal.client_name && (
                <div>
                  <p className="text-xs">Prepared for</p>
                  <p className="font-medium opacity-100">{proposal.client_name}</p>
                </div>
              )}
              {proposal.valid_until && (
                <div>
                  <p className="text-xs">Valid until</p>
                  <p className="font-medium opacity-100">{proposal.valid_until}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Executive Summary */}
            {proposal.executive_summary && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Executive Summary
                </h2>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                  {proposal.executive_summary}
                </p>
              </section>
            )}

            {/* Understanding */}
            {proposal.understanding && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Understanding of Your Needs
                </h2>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                  {proposal.understanding}
                </p>
              </section>
            )}

            {/* Scope */}
            {proposal.scope_of_work.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Scope of Work
                </h2>
                <div className="mt-3 space-y-3">
                  {proposal.scope_of_work.map((item, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Deliverables */}
            {proposal.deliverables.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Deliverables
                </h2>
                <ul className="mt-3 space-y-2">
                  {proposal.deliverables.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span style={{ color: colors.accent }} className="shrink-0">
                        •
                      </span>
                      <div>
                        <span className="font-medium">{item.title}</span>
                        {item.description && (
                          <span className="text-muted-foreground"> — {item.description}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Timeline */}
            {proposal.timeline.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Timeline
                </h2>
                <div className="mt-3 space-y-4">
                  {proposal.timeline.map((phase, i) => (
                    <div key={i} className="flex gap-4">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {phase.phase}{" "}
                          <span className="text-xs text-muted-foreground font-normal">
                            ({phase.duration})
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Investment */}
            {proposal.investment.line_items.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Investment
                </h2>
                <div className="mt-3 space-y-2">
                  {proposal.investment.line_items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{item.description}</span>
                      <span className="font-mono tabular-nums font-medium">
                        {formatCurrency(item.amount_cents)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total Investment</span>
                  <span className="text-xl font-semibold font-mono tabular-nums">
                    {formatCurrency(proposal.investment.total_cents)}
                  </span>
                </div>
              </section>
            )}

            {/* Terms */}
            {proposal.terms && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Terms & Conditions
                </h2>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {proposal.terms}
                </p>
              </section>
            )}

            {/* About */}
            {proposal.about_us && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  About {companyName}
                </h2>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                  {proposal.about_us}
                </p>
              </section>
            )}
          </div>

          {/* Response buttons */}
          {!responded && (
            <div className="border-t p-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  onClick={() => handleRespond(true)}
                  disabled={responding}
                  style={{ backgroundColor: colors.primary }}
                  className="text-white hover:opacity-90 min-w-[160px]"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Accept Proposal
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleRespond(false)}
                  disabled={responding}
                  className="min-w-[160px]"
                >
                  <X className="mr-2 h-4 w-4" />
                  Decline
                </Button>
              </div>
            </div>
          )}

          {responded && (
            <div className="border-t p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {proposal.status === "accepted"
                  ? "You've accepted this proposal. The sender has been notified."
                  : "You've declined this proposal. The sender has been notified."}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Powered by <Diamond className="inline h-3 w-3" /> Pactly
        </p>
      </div>
    </div>
  );
}
