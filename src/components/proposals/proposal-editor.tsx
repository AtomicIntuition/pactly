"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Download,
  Link2,
  Loader2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorHeader } from "@/components/proposals/editor/editor-header";
import { DesignControls } from "@/components/proposals/editor/design-controls";
import { EditorContent } from "@/components/proposals/editor/editor-content";
import { useAutosave } from "@/hooks/use-autosave";
import { updateProposalAction, toggleShareAction, updateProposalStatusAction } from "@/actions/proposals";
import { STATUS_LABELS } from "@/lib/constants";
import type { Proposal, Profile, LineItem, ProposalStatus } from "@/types";

interface ProposalEditorProps {
  proposal: Proposal;
  /** Profile is accepted for compatibility but no longer used directly — PDF preview fetches via API */
  profile?: Profile;
}

export function ProposalEditor({ proposal: initialProposal }: ProposalEditorProps): React.ReactElement {
  const [proposal, setProposal] = useState(initialProposal);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialProposal.share_enabled && initialProposal.share_token) {
      setShareUrl(`${window.location.origin}/share/${initialProposal.share_token}`);
    }
  }, [initialProposal.share_enabled, initialProposal.share_token]);

  const handleSave = useCallback(
    async (data: Record<string, unknown>) => {
      await updateProposalAction(proposal.id, data);
    },
    [proposal.id]
  );

  const { triggerSave, flush, saving, lastSaved } = useAutosave({ onSave: handleSave });
  const [activeTab, setActiveTab] = useState("editor");
  const [previewKey, setPreviewKey] = useState(0);

  const handleTabChange = useCallback(
    async (value: string) => {
      setActiveTab(value);
      if (value === "preview") {
        await flush();
        setPreviewKey((k) => k + 1);
      }
    },
    [flush],
  );

  const updateField = useCallback(
    <K extends keyof Proposal>(field: K, value: Proposal[K]) => {
      setProposal((prev) => ({ ...prev, [field]: value }));
      triggerSave({ [field]: value });
    },
    [triggerSave]
  );

  const handleStatusChange = useCallback(
    async (status: string) => {
      const result = await updateProposalStatusAction(proposal.id, status);
      if (result.error) {
        toast.error(result.error);
      } else {
        setProposal((prev) => ({ ...prev, status: status as ProposalStatus }));
        toast.success(`Status updated to ${STATUS_LABELS[status]}`);
      }
    },
    [proposal.id]
  );

  const handleShare = useCallback(async () => {
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
      setProposal((prev) => ({ ...prev, share_enabled: true }));
    } else {
      setShareUrl(null);
      setProposal((prev) => ({ ...prev, share_enabled: false }));
      toast.success("Share link disabled");
    }
  }, [proposal.id]);

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

  // Line items management
  const updateLineItem = useCallback(
    (index: number, field: keyof LineItem, value: string | number) => {
      const items = [...proposal.investment.line_items];
      items[index] = { ...items[index], [field]: value };
      const total = items.reduce((sum, item) => sum + item.amount_cents, 0);
      const investment = { ...proposal.investment, line_items: items, total_cents: total };
      updateField("investment", investment);
    },
    [proposal.investment, updateField]
  );

  const addLineItem = useCallback(() => {
    const items = [...proposal.investment.line_items, { description: "", amount_cents: 0 }];
    const investment = { ...proposal.investment, line_items: items };
    updateField("investment", investment);
  }, [proposal.investment, updateField]);

  const removeLineItem = useCallback(
    (index: number) => {
      const items = proposal.investment.line_items.filter((_, i) => i !== index);
      const total = items.reduce((sum, item) => sum + item.amount_cents, 0);
      const investment = { ...proposal.investment, line_items: items, total_cents: total };
      updateField("investment", investment);
    },
    [proposal.investment, updateField]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <EditorHeader
        proposal={proposal}
        updateField={updateField}
        onStatusChange={handleStatusChange}
      />

      {/* Design Controls */}
      <DesignControls proposal={proposal} updateField={updateField} />

      {/* Editor + Preview */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="editor" className="flex-1">
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <EditorContent
            proposal={proposal}
            updateField={updateField}
            updateLineItem={updateLineItem}
            addLineItem={addLineItem}
            removeLineItem={removeLineItem}
          />
        </TabsContent>
        <TabsContent value="preview">
          <PdfPreview key={previewKey} proposalId={proposal.id} />
        </TabsContent>
      </Tabs>

      {/* Toolbar */}
      <div className="sticky bottom-0 z-20 -mx-4 border-t bg-card/80 backdrop-blur-sm px-4 py-3 md:-mx-6 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPdf}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} disabled={shareLoading}>
              {shareLoading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Link2 className="mr-1.5 h-3.5 w-3.5" />
              )}
              {proposal.share_enabled ? "Disable Share" : "Enable Share Link"}
            </Button>
            {shareUrl && proposal.share_enabled && (
              <div className="flex items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1">
                <span className="max-w-[200px] truncate text-xs text-muted-foreground font-mono">
                  {shareUrl.replace(/^https?:\/\//, "")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await navigator.clipboard.writeText(shareUrl);
                      toast.success("Link copied!");
                    } catch {
                      toast.info(shareUrl, { duration: 8000 });
                    }
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {saving ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </span>
            ) : lastSaved ? (
              <span>
                Last saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
              </span>
            ) : (
              <span>Autosave enabled</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PDF Preview ──────────────────────────────────────────

function PdfPreview({ proposalId }: { proposalId: string }): React.ReactElement {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/proposals/${proposalId}/pdf`);
        if (!res.ok) throw new Error("PDF generation failed");
        const blob = await res.blob();
        if (!cancelled) {
          setPdfUrl(URL.createObjectURL(blob));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [proposalId]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Generating PDF preview...</p>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <p className="text-sm text-muted-foreground">Failed to generate preview. Try again.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0`}
        className="w-full"
        style={{ aspectRatio: "210 / 297", minHeight: 700 }}
        title="PDF Preview"
      />
    </div>
  );
}
