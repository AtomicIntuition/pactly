import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
} from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("accepts valid login credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email address", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailIssue = result.error.issues.find(
        (i) => i.path.includes("email"),
      );
      expect(emailIssue).toBeDefined();
    }
  });

  it("rejects a password shorter than 6 characters", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordIssue = result.error.issues.find(
        (i) => i.path.includes("password"),
      );
      expect(passwordIssue).toBeDefined();
    }
  });

  it("accepts a password with exactly 6 characters", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });
});

describe("signupSchema", () => {
  it("accepts valid signup data", () => {
    const result = signupSchema.safeParse({
      full_name: "Jane Doe",
      email: "jane@example.com",
      password: "Secure1pass",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = signupSchema.safeParse({
      full_name: "J",
      email: "jane@example.com",
      password: "Secure1pass",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameIssue = result.error.issues.find(
        (i) => i.path.includes("full_name"),
      );
      expect(nameIssue).toBeDefined();
    }
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({
      full_name: "Jane Doe",
      email: "bad-email",
      password: "Secure1pass",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signupSchema.safeParse({
      full_name: "Jane Doe",
      email: "jane@example.com",
      password: "Abc1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password without an uppercase letter", () => {
    const result = signupSchema.safeParse({
      full_name: "Jane Doe",
      email: "jane@example.com",
      password: "lowercase1only",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordIssue = result.error.issues.find(
        (i) => i.path.includes("password"),
      );
      expect(passwordIssue).toBeDefined();
    }
  });

  it("rejects a password without a number", () => {
    const result = signupSchema.safeParse({
      full_name: "Jane Doe",
      email: "jane@example.com",
      password: "NoNumbersHere",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordIssue = result.error.issues.find(
        (i) => i.path.includes("password"),
      );
      expect(passwordIssue).toBeDefined();
    }
  });

  it("accepts a name with exactly 2 characters", () => {
    const result = signupSchema.safeParse({
      full_name: "Jo",
      email: "jo@example.com",
      password: "Valid1Password",
    });
    expect(result.success).toBe(true);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email address", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "user@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email address", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "not-valid",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailIssue = result.error.issues.find(
        (i) => i.path.includes("email"),
      );
      expect(emailIssue).toBeDefined();
    }
  });

  it("rejects an empty email string", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "",
    });
    expect(result.success).toBe(false);
  });
});
