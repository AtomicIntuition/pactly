"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { createProposalAction } from "@/actions/proposals";
import { getTemplatesByCategory } from "@/lib/templates";

interface ClientBriefInputProps {
  proposalCount: number;
  planLimit: number;
}

export function ClientBriefInput({
  proposalCount,
  planLimit,
}: ClientBriefInputProps): React.ReactElement {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(createProposalAction, { error: undefined });
  const [briefLength, setBriefLength] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    searchParams.get("template_id") ?? "none"
  );

  const categories = getTemplatesByCategory();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Create a Proposal"
        description="Pick an industry preset for tailored AI guidance, then paste your client brief."
      />

      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        {/* Hidden field for template_id */}
        <input
          type="hidden"
          name="template_id"
          value={selectedTemplate === "none" ? "" : selectedTemplate}
        />

        {/* Industry Preset dropdown */}
        <div className="space-y-2">
          <Label htmlFor="preset">Industry Preset</Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger id="preset" className="w-full">
              <SelectValue placeholder="Select a preset..." />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-72">
              <SelectItem value="none">No preset — AI generates everything fresh</SelectItem>
              <SelectSeparator />
              {categories.map(({ category, templates }, i) => (
                <SelectGroup key={category}>
                  <SelectLabel>{category}</SelectLabel>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={`system:${t.id}`}>
                      {t.name}
                    </SelectItem>
                  ))}
                  {i < categories.length - 1 && <SelectSeparator />}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Presets guide AI tone, pricing model, and industry terms.
          </p>
        </div>

        {/* Client Brief */}
        <div className="space-y-2">
          <Label htmlFor="client_brief">Client Brief</Label>
          <div className="relative">
            <Textarea
              id="client_brief"
              name="client_brief"
              placeholder="Paste the client brief, inquiry email, or project description here..."
              className="min-h-[200px] resize-y text-sm"
              required
              onChange={(e) => setBriefLength(e.target.value.length)}
            />
            <span className="absolute bottom-3 right-3 text-xs text-muted-foreground font-mono tabular-nums">
              {briefLength}
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {planLimit > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 shrink-0" />
              <span>
                {Math.max(0, planLimit - proposalCount)} of {planLimit} proposals remaining this month
              </span>
            </div>
          )}
          <Button type="submit" disabled={isPending} className="w-full sm:ml-auto sm:w-auto">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Generate Proposal
          </Button>
        </div>
      </form>
    </div>
  );
}
