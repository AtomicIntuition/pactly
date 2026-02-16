"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendProposalAction } from "@/actions/proposals";

interface SendProposalDialogProps {
  proposalId: string;
  clientEmail: string | null;
  clientName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendProposalDialog({
  proposalId,
  clientEmail,
  clientName,
  open,
  onOpenChange,
}: SendProposalDialogProps): React.ReactElement {
  const [email, setEmail] = useState(clientEmail ?? "");
  const [sending, setSending] = useState(false);

  const handleSend = async (): Promise<void> => {
    if (!email.trim()) {
      toast.error("Please enter a client email");
      return;
    }

    setSending(true);
    const result = await sendProposalAction(proposalId, { client_email: email.trim() });
    setSending(false);

    if (result.error && !result.success) {
      toast.error(result.error);
      return;
    }

    if (result.warning) {
      toast.warning(result.warning);
    } else {
      toast.success("Proposal sent!");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Proposal</DialogTitle>
          <DialogDescription>
            {clientName
              ? `Send this proposal to ${clientName} via email.`
              : "Send this proposal to your client via email."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client-email">Client Email</Label>
            <Input
              id="client-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send Proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
