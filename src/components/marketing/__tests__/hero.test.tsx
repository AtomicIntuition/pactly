import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "../hero";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe("Hero", () => {
  it('renders the headline "Your next proposal, in sixty seconds"', () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent("Your next proposal, in sixty seconds");
  });

  it("renders CTA buttons", () => {
    render(<Hero />);
    expect(
      screen.getByRole("button", { name: /Start Free/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /See How It Works/i }),
    ).toBeInTheDocument();
  });

  it("renders trust badges", () => {
    render(<Hero />);
    expect(screen.getByText("60-second generation")).toBeInTheDocument();
    expect(screen.getAllByText(/2,400\+ agencies/).length).toBeGreaterThan(0);
    expect(screen.getByText("4.9/5 early users")).toBeInTheDocument();
  });
});
