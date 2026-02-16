"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Plus,
  Mail,
  Phone,
  Globe,
  Building2,
  StickyNote,
  FileText,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ProposalStatusBadge } from "@/components/proposals/proposal-status-badge";
import { ClientForm } from "@/components/clients/client-form";
import type { Client, Proposal } from "@/types";

interface ClientDetailProps {
  client: Client;
  proposals: Proposal[];
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function ClientDetail({ client, proposals }: ClientDetailProps): React.ReactElement {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Clients
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
          {client.company && (
            <p className="text-sm text-muted-foreground">{client.company}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Edit className="mr-1.5 h-4 w-4" />
            Edit
          </Button>
          <Link href={`/proposals/new?client_id=${client.id}`}>
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              New Proposal
            </Button>
          </Link>
        </div>
      </div>

      {/* Info card */}
      {(client.email || client.phone || client.website || client.industry || client.notes) && (
        <Card className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            {client.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                <a
                  href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline truncate"
                >
                  {client.website}
                </a>
              </div>
            )}
            {client.industry && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{client.industry}</span>
              </div>
            )}
          </div>
          {client.notes && (
            <div className="mt-4 flex gap-2 border-t pt-4 text-sm">
              <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}
        </Card>
      )}

      {/* Proposals */}
      <div>
        <h2 className="text-lg font-medium">
          Proposals{" "}
          <span className="text-muted-foreground font-normal">({proposals.length})</span>
        </h2>
      </div>

      {proposals.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No proposals yet"
          description="Create a proposal for this client to get started."
          actionLabel="New Proposal"
          actionHref={`/proposals/new?client_id=${client.id}`}
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
                      {proposal.investment.total_cents > 0 && (
                        <>
                          <span className="font-mono tabular-nums">
                            {formatCurrency(proposal.investment.total_cents)}
                          </span>
                          {" "}&middot;{" "}
                        </>
                      )}
                      {formatDistanceToNow(new Date(proposal.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="ml-4">
                    <ProposalStatusBadge status={proposal.status} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <ClientForm client={client} onSuccess={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
