"use client";

import { useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SignaturePanelProps {
  token: string;
  colors: { primary: string; accent: string };
  clientName: string | null;
  onResponded: (status: "accepted" | "declined") => void;
}

export function SignaturePanel({
  token,
  colors,
  clientName,
  onResponded,
}: SignaturePanelProps): React.ReactElement {
  const [name, setName] = useState(clientName ?? "");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async (): Promise<void> => {
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the terms");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/share/${token}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: true, signature_name: name.trim() }),
      });

      if (!response.ok) throw new Error("Failed to respond");
      toast.success("Proposal accepted and signed!");
      onResponded("accepted");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async (): Promise<void> => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/share/${token}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: false }),
      });

      if (!response.ok) throw new Error("Failed to respond");
      toast.success("Proposal declined");
      onResponded("declined");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t p-8">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="signature-name" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="signature-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="signature-agree"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="signature-agree" className="text-sm leading-relaxed text-muted-foreground cursor-pointer">
            I agree to the terms outlined in this proposal
          </Label>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={handleAccept}
            disabled={submitting}
            style={{ backgroundColor: colors.primary }}
            className="text-white hover:opacity-90 min-w-[160px]"
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Accept & Sign
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleDecline}
            disabled={submitting}
            className="min-w-[160px]"
          >
            <X className="mr-2 h-4 w-4" />
            Decline
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By signing, your name, date, and IP address will be recorded.
        </p>
      </div>
    </div>
  );
}
