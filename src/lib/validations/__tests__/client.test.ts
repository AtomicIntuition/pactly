import { describe, it, expect } from "vitest";
import {
  createClientSchema,
  updateClientSchema,
} from "@/lib/validations/client";

describe("createClientSchema", () => {
  it("accepts valid input with all fields", () => {
    const result = createClientSchema.safeParse({
      name: "Acme Corp",
      email: "contact@acme.com",
      company: "Acme Corporation",
      website: "https://acme.com",
      industry: "Technology",
      phone: "+1-555-0100",
      notes: "Key client for Q2",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input with only the required name field", () => {
    const result = createClientSchema.safeParse({
      name: "Jane",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = createClientSchema.safeParse({
      email: "contact@acme.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty name", () => {
    const result = createClientSchema.safeParse({
      name: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameIssue = result.error.issues.find(
        (i) => i.path.includes("name"),
      );
      expect(nameIssue).toBeDefined();
    }
  });

  it("rejects an invalid email address", () => {
    const result = createClientSchema.safeParse({
      name: "Acme Corp",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("allows an empty string for email", () => {
    const result = createClientSchema.safeParse({
      name: "Acme Corp",
      email: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid URL for website", () => {
    const result = createClientSchema.safeParse({
      name: "Acme Corp",
      website: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("allows an empty string for website", () => {
    const result = createClientSchema.safeParse({
      name: "Acme Corp",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid URL for website", () => {
    const result = createClientSchema.safeParse({
      name: "Acme Corp",
      website: "https://example.com",
    });
    expect(result.success).toBe(true);
  });
});

describe("updateClientSchema", () => {
  it("accepts a valid partial update with only name", () => {
    const result = updateClientSchema.safeParse({
      name: "Updated Name",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid partial update with only email", () => {
    const result = updateClientSchema.safeParse({
      email: "new@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty object (all fields optional via partial)", () => {
    const result = updateClientSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("allows an empty string for email in update", () => {
    const result = updateClientSchema.safeParse({
      email: "",
    });
    expect(result.success).toBe(true);
  });

  it("allows an empty string for website in update", () => {
    const result = updateClientSchema.safeParse({
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email in update", () => {
    const result = updateClientSchema.safeParse({
      email: "bad-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid website URL in update", () => {
    const result = updateClientSchema.safeParse({
      website: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
