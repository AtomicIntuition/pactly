"use client";

import {
  FileText,
  Lightbulb,
  Scale,
  Building2,
} from "lucide-react";
import { SectionEditor } from "@/components/proposals/section-editor";
import { ScopeOfWorkEditor } from "./scope-of-work-editor";
import { DeliverablesEditor } from "./deliverables-editor";
import { TimelineEditor } from "./timeline-editor";
import { InvestmentEditor } from "./investment-editor";
import type { Proposal, LineItem } from "@/types";

interface EditorContentProps {
  proposal: Proposal;
  updateField: <K extends keyof Proposal>(field: K, value: Proposal[K]) => void;
  updateLineItem: (index: number, field: keyof LineItem, value: string | number) => void;
  addLineItem: () => void;
  removeLineItem: (index: number) => void;
}

export function EditorContent({
  proposal,
  updateField,
  updateLineItem,
  addLineItem,
  removeLineItem,
}: EditorContentProps): React.ReactElement {
  return (
    <div className="space-y-4">
      {/* 1. Executive Summary */}
      <SectionEditor
        title="Executive Summary"
        value={proposal.executive_summary ?? ""}
        onChange={(v) => updateField("executive_summary", v)}
        icon={<FileText className="h-4 w-4" />}
        accentBorder
        minHeight="180px"
      />

      {/* 2. Understanding of Needs */}
      <SectionEditor
        title="Understanding of Needs"
        value={proposal.understanding ?? ""}
        onChange={(v) => updateField("understanding", v)}
        icon={<Lightbulb className="h-4 w-4" />}
        accentBorder
        minHeight="160px"
      />

      {/* 3. Scope of Work */}
      <ScopeOfWorkEditor
        items={proposal.scope_of_work}
        updateField={updateField}
      />

      {/* 4. Deliverables */}
      <DeliverablesEditor
        items={proposal.deliverables}
        updateField={updateField}
      />

      {/* 5. Timeline */}
      <TimelineEditor
        items={proposal.timeline}
        updateField={updateField}
      />

      {/* 6. Investment */}
      <InvestmentEditor
        lineItems={proposal.investment.line_items}
        totalCents={proposal.investment.total_cents}
        updateLineItem={updateLineItem}
        addLineItem={addLineItem}
        removeLineItem={removeLineItem}
      />

      {/* 7. Terms & Conditions */}
      <SectionEditor
        title="Terms & Conditions"
        value={proposal.terms ?? ""}
        onChange={(v) => updateField("terms", v)}
        defaultOpen={false}
        icon={<Scale className="h-4 w-4" />}
      />

      {/* 8. About Us */}
      <SectionEditor
        title="About Us"
        value={proposal.about_us ?? ""}
        onChange={(v) => updateField("about_us", v)}
        defaultOpen={false}
        icon={<Building2 className="h-4 w-4" />}
      />
    </div>
  );
}
