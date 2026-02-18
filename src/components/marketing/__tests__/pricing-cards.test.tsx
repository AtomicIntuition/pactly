import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingCards } from "../pricing-cards";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe("PricingCards", () => {
  it("renders all 3 plans", () => {
    render(<PricingCards />);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Agency")).toBeInTheDocument();
  });

  it('shows "Most Popular" badge on Pro plan', () => {
    render(<PricingCards />);
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });

  it("shows correct prices ($0, $29, $99)", () => {
    render(<PricingCards />);
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("$29")).toBeInTheDocument();
    expect(screen.getByText("$99")).toBeInTheDocument();
  });

  it('shows "Get Started" for the free plan', () => {
    render(<PricingCards />);
    expect(
      screen.getByRole("button", { name: "Get Started" }),
    ).toBeInTheDocument();
  });
});
