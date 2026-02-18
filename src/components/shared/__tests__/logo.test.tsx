import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "../logo";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe("Logo", () => {
  it("renders with default props and shows wordmark", () => {
    render(<Logo />);
    expect(screen.getByText("Overture")).toBeInTheDocument();
  });

  it("renders without wordmark when showWordmark is false", () => {
    render(<Logo showWordmark={false} />);
    expect(screen.queryByText("Overture")).not.toBeInTheDocument();
  });

  it("renders at sm size with correct classes", () => {
    render(<Logo size="sm" />);
    const wordmark = screen.getByText("Overture");
    expect(wordmark).toHaveClass("text-sm");
  });

  it("renders at lg size with correct classes", () => {
    render(<Logo size="lg" />);
    const wordmark = screen.getByText("Overture");
    expect(wordmark).toHaveClass("text-2xl");
  });

  it("applies custom className to the root element", () => {
    const { container } = render(<Logo className="my-custom-class" />);
    const root = container.firstElementChild;
    expect(root).toHaveClass("my-custom-class");
  });
});
