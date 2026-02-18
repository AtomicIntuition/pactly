import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileText } from "lucide-react";
import { EmptyState } from "../empty-state";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe("EmptyState", () => {
  it("renders icon, title, and description", () => {
    render(
      <EmptyState
        icon={FileText}
        title="No proposals yet"
        description="Create your first proposal to get started."
      />,
    );

    expect(screen.getByText("No proposals yet")).toBeInTheDocument();
    expect(screen.getByText("Create your first proposal to get started.")).toBeInTheDocument();
  });

  it("renders action button with href", () => {
    render(
      <EmptyState
        icon={FileText}
        title="No proposals yet"
        description="Create your first proposal to get started."
        actionLabel="Create Proposal"
        actionHref="/proposals/new"
      />,
    );

    const button = screen.getByRole("button", { name: "Create Proposal" });
    expect(button).toBeInTheDocument();

    const link = button.closest("a");
    expect(link).toHaveAttribute("href", "/proposals/new");
  });

  it("renders action button with onClick", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <EmptyState
        icon={FileText}
        title="No proposals yet"
        description="Create your first proposal to get started."
        actionLabel="Try Again"
        onAction={handleClick}
      />,
    );

    const button = screen.getByRole("button", { name: "Try Again" });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not render a button when no action is provided", () => {
    render(
      <EmptyState
        icon={FileText}
        title="No proposals yet"
        description="Create your first proposal to get started."
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
