import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProposalsList } from "../proposals-list";
import { mockProposal } from "@/test/fixtures";
import type { Proposal } from "@/types";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock server actions
vi.mock("@/actions/proposals", () => ({
  deleteProposalAction: vi.fn(),
  duplicateProposalAction: vi.fn(),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ProposalsList", () => {
  const defaultProposals: Proposal[] = [
    mockProposal({
      id: "p-1",
      title: "Website Redesign Proposal",
      client_company: "Acme Corp",
      status: "draft",
      investment: { line_items: [], total_cents: 2500000, currency: "usd" },
      updated_at: new Date().toISOString(),
    }),
    mockProposal({
      id: "p-2",
      title: "Mobile App Development",
      client_company: "Beta Inc",
      status: "sent",
      investment: { line_items: [], total_cents: 5000000, currency: "usd" },
      updated_at: new Date().toISOString(),
    }),
  ];

  it("renders the page header with title and new proposal button", () => {
    render(
      <ProposalsList
        proposals={defaultProposals}
        totalCount={2}
        currentPage={1}
      />
    );

    expect(screen.getByText("Proposals")).toBeInTheDocument();

    const newButton = screen.getByRole("link", { name: /new proposal/i });
    expect(newButton).toBeInTheDocument();
    expect(newButton).toHaveAttribute("href", "/proposals/new");
  });

  it("renders proposal cards with title, client, and currency", () => {
    render(
      <ProposalsList
        proposals={defaultProposals}
        totalCount={2}
        currentPage={1}
      />
    );

    expect(screen.getByText("Website Redesign Proposal")).toBeInTheDocument();
    expect(screen.getByText("Mobile App Development")).toBeInTheDocument();
    expect(screen.getByText("$25,000")).toBeInTheDocument();
    expect(screen.getByText("$50,000")).toBeInTheDocument();
  });

  it("renders the empty state when there are no proposals", () => {
    render(
      <ProposalsList
        proposals={[]}
        totalCount={0}
        currentPage={1}
      />
    );

    expect(screen.getByText("No proposals found")).toBeInTheDocument();
    expect(
      screen.getByText("Create your first proposal to get started.")
    ).toBeInTheDocument();
  });

  it("renders the empty state with filter message when filters are active", () => {
    render(
      <ProposalsList
        proposals={[]}
        totalCount={0}
        currentPage={1}
        currentStatus="accepted"
      />
    );

    expect(screen.getByText("No proposals found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your filters.")
    ).toBeInTheDocument();
  });

  it("renders the search input with placeholder", () => {
    render(
      <ProposalsList
        proposals={defaultProposals}
        totalCount={2}
        currentPage={1}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search proposals...");
    expect(searchInput).toBeInTheDocument();
  });

  it("renders status filter tabs", () => {
    render(
      <ProposalsList
        proposals={defaultProposals}
        totalCount={2}
        currentPage={1}
      />
    );

    expect(screen.getByRole("tab", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Draft" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Sent" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Accepted" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Declined" })).toBeInTheDocument();
  });

  it("updates the search input value when the user types", async () => {
    const user = userEvent.setup();
    render(
      <ProposalsList
        proposals={defaultProposals}
        totalCount={2}
        currentPage={1}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search proposals...");
    await user.type(searchInput, "redesign");
    expect(searchInput).toHaveValue("redesign");
  });

  it("shows pagination controls when totalCount exceeds 10", () => {
    render(
      <ProposalsList
        proposals={defaultProposals}
        totalCount={25}
        currentPage={1}
      />
    );

    expect(screen.getByText(/Showing 1-10 of 25 proposals/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
  });
});
