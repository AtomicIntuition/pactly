import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProposalStatus } from "@/types";
import { STATUS_LABELS } from "@/lib/constants";

interface ProposalStatusBadgeProps {
  status: ProposalStatus;
}

const statusStyles: Record<ProposalStatus, string> = {
  generating: "bg-status-generating/10 text-status-generating border-status-generating/20",
  draft: "bg-status-draft/10 text-status-draft border-status-draft/20",
  review: "bg-status-review/10 text-status-review border-status-review/20",
  sent: "bg-status-sent/10 text-status-sent border-status-sent/20",
  accepted: "bg-status-accepted/10 text-status-accepted border-status-accepted/20",
  declined: "bg-status-declined/10 text-status-declined border-status-declined/20",
  expired: "bg-status-expired/10 text-status-expired border-status-expired/20",
};

export function ProposalStatusBadge({ status }: ProposalStatusBadgeProps): React.ReactElement {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", statusStyles[status])}
    >
      {status === "generating" && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot inline-block" />
      )}
      {STATUS_LABELS[status]}
    </Badge>
  );
}
