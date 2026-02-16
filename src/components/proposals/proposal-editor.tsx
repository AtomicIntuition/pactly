"use client";

import { useState, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorHeader } from "@/components/proposals/editor/editor-header";
import { DesignControls } from "@/components/proposals/editor/design-controls";
import { EditorContent } from "@/components/proposals/editor/editor-content";
import { useAutosave } from "@/hooks/use-autosave";
import { updateProposalAction, updateProposalStatusAction } from "@/actions/proposals";
import { STATUS_LABELS } from "@/lib/constants";
import type { Proposal, Profile, LineItem, ProposalStatus } from "@/types";

interface ProposalEditorProps {
  proposal: Proposal;
  /** Profile is accepted for compatibility but no longer used directly — PDF preview fetches via API */
  profile?: Profile;
}

export function ProposalEditor({ proposal: initialProposal }: ProposalEditorProps): React.ReactElement {
  const [proposal, setProposal] = useState(initialProposal);

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
      {/* Header with actions */}
      <EditorHeader
        proposal={proposal}
        updateField={updateField}
        onStatusChange={handleStatusChange}
        saving={saving}
        lastSaved={lastSaved}
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
