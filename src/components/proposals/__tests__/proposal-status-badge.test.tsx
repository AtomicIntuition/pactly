import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProposalStatusBadge } from "../proposal-status-badge";
import type { ProposalStatus } from "@/types";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

const statusLabelMap: Record<ProposalStatus, string> = {
  generating: "Generating",
  draft: "Draft",
  review: "In Review",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
};

const statusStyleMap: Record<ProposalStatus, string> = {
  generating: "text-status-generating",
  draft: "text-status-draft",
  review: "text-status-review",
  sent: "text-status-sent",
  accepted: "text-status-accepted",
  declined: "text-status-declined",
  expired: "text-status-expired",
};

describe("ProposalStatusBadge", () => {
  it.each(Object.entries(statusLabelMap))(
    "renders correct label for status '%s'",
    (status, label) => {
      render(<ProposalStatusBadge status={status as ProposalStatus} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    },
  );

  it.each(Object.entries(statusStyleMap))(
    "uses correct color class for status '%s'",
    (status, expectedClass) => {
      const { container } = render(
        <ProposalStatusBadge status={status as ProposalStatus} />,
      );
      const badge = container.querySelector("[data-slot='badge']");
      expect(badge).toHaveClass(expectedClass);
    },
  );
});
