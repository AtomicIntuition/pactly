import { describe, it, expect } from "vitest";
import {
  createProposalSchema,
  updateProposalSchema,
  lineItemSchema,
  investmentSchema,
  scopeItemSchema,
  deliverableSchema,
  timelinePhaseSchema,
} from "@/lib/validations/proposal";

describe("createProposalSchema", () => {
  it("accepts valid input with all fields", () => {
    const result = createProposalSchema.safeParse({
      client_brief: "We need a new website redesign for our company",
      client_name: "Jane Doe",
      client_email: "jane@example.com",
      client_company: "Acme Corp",
      service_type: "Web Development",
      template_id: "tpl_abc123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input with only the required field", () => {
    const result = createProposalSchema.safeParse({
      client_brief: "We need a new website redesign for our company",
    });
    expect(result.success).toBe(true);
  });

  it("rejects brief that is too short (fewer than 10 characters)", () => {
    const result = createProposalSchema.safeParse({
      client_brief: "Short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const briefIssue = result.error.issues.find(
        (i) => i.path.includes("client_brief"),
      );
      expect(briefIssue).toBeDefined();
    }
  });

  it("rejects an invalid email address", () => {
    const result = createProposalSchema.safeParse({
      client_brief: "We need a new website redesign for our company",
      client_email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("allows an empty string for client_email", () => {
    const result = createProposalSchema.safeParse({
      client_brief: "We need a new website redesign for our company",
      client_email: "",
    });
    expect(result.success).toBe(true);
  });

  it("allows an empty string for template_id", () => {
    const result = createProposalSchema.safeParse({
      client_brief: "We need a new website redesign for our company",
      template_id: "",
    });
    expect(result.success).toBe(true);
  });

  it("allows empty optional fields to be omitted", () => {
    const result = createProposalSchema.safeParse({
      client_brief: "A sufficiently long brief for testing purposes",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.client_name).toBeUndefined();
      expect(result.data.client_company).toBeUndefined();
      expect(result.data.service_type).toBeUndefined();
    }
  });
});

describe("updateProposalSchema", () => {
  it("accepts a valid partial update", () => {
    const result = updateProposalSchema.safeParse({
      title: "Updated Title",
      status: "review",
      executive_summary: "A new summary",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty object (all fields optional)", () => {
    const result = updateProposalSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects an invalid status value", () => {
    const result = updateProposalSchema.safeParse({
      status: "invalid_status",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid hex colors for template_color_primary", () => {
    const result = updateProposalSchema.safeParse({
      template_color_primary: "#1a2B3c",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid hex colors for template_color_accent", () => {
    const result = updateProposalSchema.safeParse({
      template_color_accent: "#FF00AA",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid hex colors (missing hash)", () => {
    const result = updateProposalSchema.safeParse({
      template_color_primary: "1a2b3c",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid hex colors (wrong length)", () => {
    const result = updateProposalSchema.safeParse({
      template_color_accent: "#FFF",
    });
    expect(result.success).toBe(false);
  });

  it("allows empty string for hex color fields", () => {
    const result = updateProposalSchema.safeParse({
      template_color_primary: "",
      template_color_accent: "",
    });
    expect(result.success).toBe(true);
  });

  it("allows null for hex color fields", () => {
    const result = updateProposalSchema.safeParse({
      template_color_primary: null,
      template_color_accent: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid layout enum value", () => {
    const layouts = ["modern", "classic", "bold", "minimal"] as const;
    for (const layout of layouts) {
      const result = updateProposalSchema.safeParse({ layout });
      expect(result.success).toBe(true);
    }
  });

  it("rejects an invalid layout value", () => {
    const result = updateProposalSchema.safeParse({
      layout: "futuristic",
    });
    expect(result.success).toBe(false);
  });
});

describe("lineItemSchema", () => {
  it("accepts a valid line item", () => {
    const result = lineItemSchema.safeParse({
      description: "Design mockups",
      amount_cents: 50000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing description", () => {
    const result = lineItemSchema.safeParse({
      amount_cents: 50000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty description", () => {
    const result = lineItemSchema.safeParse({
      description: "",
      amount_cents: 50000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative amount", () => {
    const result = lineItemSchema.safeParse({
      description: "Discount",
      amount_cents: -100,
    });
    expect(result.success).toBe(false);
  });

  it("accepts zero amount", () => {
    const result = lineItemSchema.safeParse({
      description: "Free consultation",
      amount_cents: 0,
    });
    expect(result.success).toBe(true);
  });
});

describe("investmentSchema", () => {
  it("accepts a valid investment", () => {
    const result = investmentSchema.safeParse({
      line_items: [
        { description: "Design", amount_cents: 30000 },
        { description: "Development", amount_cents: 70000 },
      ],
      total_cents: 100000,
      currency: "usd",
    });
    expect(result.success).toBe(true);
  });

  it("defaults currency to usd when not provided", () => {
    const result = investmentSchema.safeParse({
      line_items: [],
      total_cents: 0,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currency).toBe("usd");
    }
  });

  it("rejects negative total_cents", () => {
    const result = investmentSchema.safeParse({
      line_items: [],
      total_cents: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe("scopeItemSchema", () => {
  it("accepts a valid scope item", () => {
    const result = scopeItemSchema.safeParse({
      title: "Frontend Development",
      description: "Build responsive UI components",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = scopeItemSchema.safeParse({
      title: "",
      description: "Some description",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty description", () => {
    const result = scopeItemSchema.safeParse({
      title: "Backend",
      description: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("deliverableSchema", () => {
  it("accepts a valid deliverable", () => {
    const result = deliverableSchema.safeParse({
      title: "Design System",
      description: "A comprehensive design system with all components",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = deliverableSchema.safeParse({
      title: "",
      description: "Something",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty description", () => {
    const result = deliverableSchema.safeParse({
      title: "Wireframes",
      description: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("timelinePhaseSchema", () => {
  it("accepts a valid timeline phase", () => {
    const result = timelinePhaseSchema.safeParse({
      phase: "Discovery",
      duration: "2 weeks",
      description: "Initial research and requirements gathering",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty phase", () => {
    const result = timelinePhaseSchema.safeParse({
      phase: "",
      duration: "1 week",
      description: "Work",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty duration", () => {
    const result = timelinePhaseSchema.safeParse({
      phase: "Build",
      duration: "",
      description: "Development phase",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty description", () => {
    const result = timelinePhaseSchema.safeParse({
      phase: "Launch",
      duration: "1 week",
      description: "",
    });
    expect(result.success).toBe(true);
  });
});
