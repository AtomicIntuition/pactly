import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../login-form";

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
vi.mock("@/actions/auth", () => ({
  loginAction: vi.fn(),
  signInWithGoogleAction: vi.fn(),
}));

describe("LoginForm", () => {
  it("renders the card with heading and description", () => {
    render(<LoginForm />);

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(
      screen.getByText("Sign in to your account to continue")
    ).toBeInTheDocument();
  });

  it("renders email and password input fields", () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("name", "email");
    expect(emailInput).toBeRequired();

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("name", "password");
    expect(passwordInput).toBeRequired();
  });

  it("renders the sign in button and Google sign-in button", () => {
    render(<LoginForm />);

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("type", "submit");

    const googleButton = screen.getByRole("button", {
      name: /continue with google/i,
    });
    expect(googleButton).toBeInTheDocument();
  });

  it("renders the forgot password and sign up links", () => {
    render(<LoginForm />);

    const forgotLink = screen.getByRole("link", { name: /forgot password/i });
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink).toHaveAttribute("href", "/forgot-password");

    const signUpLink = screen.getByRole("link", { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/signup");
  });

  it("allows typing into email and password fields", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "securepass123");

    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("securepass123");
  });
});
