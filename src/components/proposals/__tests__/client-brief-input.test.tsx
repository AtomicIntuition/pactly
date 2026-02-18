import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientBriefInput } from "../client-brief-input";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock the server action
vi.mock("@/actions/proposals", () => ({
  createProposalAction: vi.fn(),
}));

// Mock the templates module
vi.mock("@/lib/templates", () => ({
  getTemplatesByCategory: () => [
    {
      category: "Web Development",
      templates: [
        { id: "web-development", name: "Web Development" },
        { id: "ecommerce", name: "E-Commerce Solution" },
      ],
    },
    {
      category: "Design",
      templates: [
        { id: "brand-identity", name: "Brand & Identity Design" },
      ],
    },
  ],
}));

describe("ClientBriefInput", () => {
  it("renders the page header with title and description", () => {
    render(<ClientBriefInput proposalCount={0} planLimit={5} />);

    expect(screen.getByText("Create a Proposal")).toBeInTheDocument();
    expect(
      screen.getByText("Pick an industry preset for tailored AI guidance, then paste your client brief.")
    ).toBeInTheDocument();
  });

  it("renders the client brief textarea with placeholder", () => {
    render(<ClientBriefInput proposalCount={0} planLimit={5} />);

    const textarea = screen.getByPlaceholderText(
      "Paste the client brief, inquiry email, or project description here..."
    );
    expect(textarea).toBeInTheDocument();
    expect(textarea).toBeRequired();
  });

  it("renders the industry preset selector", () => {
    render(<ClientBriefInput proposalCount={0} planLimit={5} />);

    expect(screen.getByText("Industry Preset")).toBeInTheDocument();
    expect(
      screen.getByText("Presets guide AI tone, pricing model, and industry terms.")
    ).toBeInTheDocument();
  });

  it("renders the submit button with correct label", () => {
    render(<ClientBriefInput proposalCount={0} planLimit={5} />);

    const submitButton = screen.getByRole("button", { name: /generate proposal/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("updates character count when typing in the textarea", async () => {
    const user = userEvent.setup();
    render(<ClientBriefInput proposalCount={0} planLimit={5} />);

    const textarea = screen.getByPlaceholderText(
      "Paste the client brief, inquiry email, or project description here..."
    );

    await user.type(textarea, "Hello world");
    expect(screen.getByText("11")).toBeInTheDocument();
  });

  it("displays remaining proposals when planLimit is greater than 0", () => {
    render(<ClientBriefInput proposalCount={2} planLimit={5} />);

    expect(screen.getByText(/3 of 5 proposals remaining this month/)).toBeInTheDocument();
  });

  it("does not display proposal limit info when planLimit is 0", () => {
    render(<ClientBriefInput proposalCount={2} planLimit={0} />);

    expect(screen.queryByText(/proposals remaining this month/)).not.toBeInTheDocument();
  });

  it("shows 0 remaining when proposalCount exceeds planLimit", () => {
    render(<ClientBriefInput proposalCount={7} planLimit={5} />);

    expect(screen.getByText(/0 of 5 proposals remaining this month/)).toBeInTheDocument();
  });
});
