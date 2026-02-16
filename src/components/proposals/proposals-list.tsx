"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus, MoreVertical, Search, Copy, Trash2, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ProposalStatusBadge } from "@/components/proposals/proposal-status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteProposalAction, duplicateProposalAction } from "@/actions/proposals";
import type { Proposal } from "@/types";

interface ProposalsListProps {
  proposals: Proposal[];
  totalCount: number;
  currentPage: number;
  currentStatus?: string;
  currentSearch?: string;
}

const statusTabs = [
  { value: "", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
] as const;

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function ProposalsList({
  proposals,
  totalCount,
  currentPage,
  currentStatus,
  currentSearch,
}: ProposalsListProps): React.ReactElement {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch ?? "");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const updateParams = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    router.push(`/proposals?${sp.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search, status: currentStatus ?? "" });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteProposalAction(deleteId);
    toast.success("Proposal deleted");
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Proposals">
        <Link href="/proposals/new">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            New Proposal
          </Button>
        </Link>
      </PageHeader>

      {/* Filters */}
      <Tabs
        value={currentStatus ?? ""}
        onValueChange={(v) => updateParams({ status: v, search })}
      >
        <TabsList>
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals..."
            className="pl-9"
          />
        </div>
      </form>

      {/* List */}
      {proposals.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No proposals found"
          description={
            currentSearch || currentStatus
              ? "Try adjusting your filters."
              : "Create your first proposal to get started."
          }
          actionLabel={!currentSearch && !currentStatus ? "Create Proposal" : undefined}
          actionHref={!currentSearch && !currentStatus ? "/proposals/new" : undefined}
        />
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal) => (
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
                      {" "}&middot;{" "}
                      {formatDistanceToNow(new Date(proposal.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <ProposalStatusBadge status={proposal.status} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.preventDefault()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/proposals/${proposal.id}`);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={async (e) => {
                            e.preventDefault();
                            await duplicateProposalAction(proposal.id);
                            toast.success("Proposal duplicated");
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteId(proposal.id);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCount > 10 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalCount)} of{" "}
            {totalCount} proposals
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() =>
                updateParams({
                  page: String(currentPage - 1),
                  status: currentStatus ?? "",
                  search,
                })
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage * 10 >= totalCount}
              onClick={() =>
                updateParams({
                  page: String(currentPage + 1),
                  status: currentStatus ?? "",
                  search,
                })
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete proposal?"
        description="This action cannot be undone. The proposal will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}
