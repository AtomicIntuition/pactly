"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ProposalStatusBadge } from "@/components/proposals/proposal-status-badge";
import { PROPOSAL_STATUSES, STATUS_LABELS } from "@/lib/constants";
import type { Proposal } from "@/types";

interface EditorHeaderProps {
  proposal: Proposal;
  updateField: <K extends keyof Proposal>(field: K, value: Proposal[K]) => void;
  onStatusChange: (status: string) => void;
}

export function EditorHeader({
  proposal,
  updateField,
  onStatusChange,
}: EditorHeaderProps): React.ReactElement {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Accent strip */}
      <div className="h-1 bg-primary" />

      <div className="p-4 space-y-4">
        {/* Title + Status row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Input
              value={proposal.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="text-2xl font-bold border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
              placeholder="Proposal title"
            />
            <ProposalStatusBadge status={proposal.status} />
          </div>
          <Select value={proposal.status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[160px] shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROPOSAL_STATUSES.filter((s) => s !== "generating").map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Client metadata grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Client Name</Label>
            <Input
              value={proposal.client_name ?? ""}
              onChange={(e) => updateField("client_name", e.target.value || null)}
              placeholder="Client name"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Company</Label>
            <Input
              value={proposal.client_company ?? ""}
              onChange={(e) => updateField("client_company", e.target.value || null)}
              placeholder="Company name"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input
              type="email"
              value={proposal.client_email ?? ""}
              onChange={(e) => updateField("client_email", e.target.value || null)}
              placeholder="client@example.com"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Valid Until</Label>
            <Input
              type="date"
              value={proposal.valid_until ?? ""}
              onChange={(e) => updateField("valid_until", e.target.value || null)}
              className="h-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
