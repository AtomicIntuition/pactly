"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Download,
  Link2,
  Loader2,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Link2Off,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ProposalStatusBadge } from "@/components/proposals/proposal-status-badge";
import { PROPOSAL_STATUSES, STATUS_LABELS } from "@/lib/constants";
import { toggleShareAction } from "@/actions/proposals";
import type { Proposal } from "@/types";

interface EditorHeaderProps {
  proposal: Proposal;
  updateField: <K extends keyof Proposal>(field: K, value: Proposal[K]) => void;
  onStatusChange: (status: string) => void;
  saving: boolean;
  lastSaved: Date | null;
}

export function EditorHeader({
  proposal,
  updateField,
  onStatusChange,
  saving,
  lastSaved,
}: EditorHeaderProps): React.ReactElement {
  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (proposal.share_enabled && proposal.share_token) {
      setShareUrl(`${window.location.origin}/share/${proposal.share_token}`);
    }
  }, [proposal.share_enabled, proposal.share_token]);

  const handleExportPdf = useCallback(async () => {
    toast.info("Generating PDF...");
    try {
      const response = await fetch(`/api/proposals/${proposal.id}/pdf`);
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${proposal.title}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to generate PDF");
    }
  }, [proposal.id, proposal.title]);

  const handleToggleShare = useCallback(async () => {
    setShareLoading(true);
    const result = await toggleShareAction(proposal.id);
    setShareLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.shareUrl) {
      setShareUrl(result.shareUrl);
      try {
        await navigator.clipboard.writeText(result.shareUrl);
        toast.success("Share link copied to clipboard!");
      } catch {
        toast.success("Share link enabled!");
      }
    } else {
      setShareUrl(null);
      toast.success("Share link disabled");
    }
  }, [proposal.id]);

  const handleCopyShareUrl = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    } catch {
      toast.info(shareUrl, { duration: 8000 });
    }
  }, [shareUrl]);

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Accent strip */}
      <div className="h-1 bg-primary" />

      <div className="p-4 space-y-4">
        {/* Title + Actions row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Input
              value={proposal.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="text-2xl font-bold border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
              placeholder="Proposal title"
            />
            <ProposalStatusBadge status={proposal.status} />
          </div>

          {/* Actions cluster */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Autosave indicator */}
            <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">
              {saving ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving
                </span>
              ) : lastSaved ? (
                formatDistanceToNow(lastSaved, { addSuffix: true })
              ) : (
                "Autosave on"
              )}
            </span>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExportPdf}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export PDF</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={proposal.share_enabled ? handleCopyShareUrl : handleToggleShare}
                    disabled={shareLoading}
                  >
                    {shareLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Link2 className={`h-4 w-4 ${proposal.share_enabled ? "text-primary" : ""}`} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {proposal.share_enabled ? "Copy share link" : "Enable share link"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Overflow menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPdf}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {proposal.share_enabled ? (
                  <>
                    <DropdownMenuItem onClick={handleCopyShareUrl}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy share link
                    </DropdownMenuItem>
                    {shareUrl && (
                      <DropdownMenuItem asChild>
                        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open share link
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleToggleShare} disabled={shareLoading}>
                      <Link2Off className="mr-2 h-4 w-4" />
                      Disable share link
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={handleToggleShare} disabled={shareLoading}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Enable share link
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status selector */}
            <Select value={proposal.status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[140px]">
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
