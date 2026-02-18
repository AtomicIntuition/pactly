import { describe, it, expect } from "vitest";
import {
  profileSchema,
  brandSchema,
  logoUploadSchema,
} from "@/lib/validations/settings";

describe("profileSchema", () => {
  it("accepts valid profile data with all fields", () => {
    const result = profileSchema.safeParse({
      full_name: "Jane Doe",
      company_name: "Doe Consulting",
      phone: "+1-555-0100",
      address: "123 Main St, Springfield",
      bio: "Experienced consultant",
      website: "https://janedoe.com",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid profile data with only the required name", () => {
    const result = profileSchema.safeParse({
      full_name: "Jane",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing full_name", () => {
    const result = profileSchema.safeParse({
      company_name: "Doe Consulting",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty full_name", () => {
    const result = profileSchema.safeParse({
      full_name: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameIssue = result.error.issues.find(
        (i) => i.path.includes("full_name"),
      );
      expect(nameIssue).toBeDefined();
    }
  });

  it("rejects an invalid website URL", () => {
    const result = profileSchema.safeParse({
      full_name: "Jane Doe",
      website: "not-a-valid-url",
    });
    expect(result.success).toBe(false);
  });

  it("allows an empty string for website", () => {
    const result = profileSchema.safeParse({
      full_name: "Jane Doe",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid URL for website", () => {
    const result = profileSchema.safeParse({
      full_name: "Jane Doe",
      website: "https://example.com",
    });
    expect(result.success).toBe(true);
  });
});

describe("brandSchema", () => {
  it("accepts valid hex colors", () => {
    const result = brandSchema.safeParse({
      brand_color: "#1a2b3c",
      brand_accent: "#FF00AA",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a hex color missing the hash", () => {
    const result = brandSchema.safeParse({
      brand_color: "1a2b3c",
      brand_accent: "#FF00AA",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a shorthand hex color", () => {
    const result = brandSchema.safeParse({
      brand_color: "#FFF",
      brand_accent: "#000000",
    });
    expect(result.success).toBe(false);
  });

  it("rejects hex with invalid characters", () => {
    const result = brandSchema.safeParse({
      brand_color: "#ZZZZZZ",
      brand_accent: "#000000",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing brand_color", () => {
    const result = brandSchema.safeParse({
      brand_accent: "#000000",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing brand_accent", () => {
    const result = brandSchema.safeParse({
      brand_color: "#000000",
    });
    expect(result.success).toBe(false);
  });
});

describe("logoUploadSchema", () => {
  it("accepts a valid PNG upload", () => {
    const result = logoUploadSchema.safeParse({
      fileType: "image/png",
      fileSize: 500_000,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid JPEG upload", () => {
    const result = logoUploadSchema.safeParse({
      fileType: "image/jpeg",
      fileSize: 1_000_000,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid WebP upload", () => {
    const result = logoUploadSchema.safeParse({
      fileType: "image/webp",
      fileSize: 100,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a file at exactly 2MB", () => {
    const result = logoUploadSchema.safeParse({
      fileType: "image/png",
      fileSize: 2 * 1024 * 1024,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unsupported file type", () => {
    const result = logoUploadSchema.safeParse({
      fileType: "image/gif",
      fileSize: 500_000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects application/pdf file type", () => {
    const result = logoUploadSchema.safeParse({
      fileType: "application/pdf",
      fileSize: 500_000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a file larger than 2MB", () => {
    const result = logoUploadSchema.safeParse({
      fileType: "image/png",
      fileSize: 2 * 1024 * 1024 + 1,
    });
    expect(result.success).toBe(false);
  });
});
