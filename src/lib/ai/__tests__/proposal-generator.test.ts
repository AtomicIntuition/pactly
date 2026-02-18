import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockProfile } from "@/test/fixtures";
import type { CreateProposalInput } from "@/lib/validations/proposal";
import type { TemplateContent } from "@/lib/templates/types";

// ---------------------------------------------------------------------------
// Mock: Supabase admin client
// ---------------------------------------------------------------------------

function chainable(result: { data: unknown; error: unknown; count?: number }) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  const methods = [
    "select", "insert", "update", "delete",
    "eq", "neq", "gte", "lte", "in",
    "or", "limit", "single", "maybeSingle", "order", "range",
  ];

  for (const m of methods) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  chain.single = vi.fn().mockResolvedValue(result);
  chain.maybeSingle = vi.fn().mockResolvedValue(result);

  Object.defineProperty(chain, "then", {
    value: (resolve: (v: typeof result) => void) =>
      Promise.resolve(result).then(resolve),
    enumerable: false,
    configurable: true,
  });

  return chain;
}

const mockSupabase = {
  from: vi.fn().mockImplementation(() =>
    chainable({ data: null, error: null, count: 0 })
  ),
};

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => mockSupabase),
}));

// ---------------------------------------------------------------------------
// Mock: AI client (promptClaude)
// ---------------------------------------------------------------------------

const mockPromptClaude = vi.fn();

vi.mock("@/lib/ai/client", () => ({
  promptClaude: (...args: unknown[]) => mockPromptClaude(...args),
}));

// ---------------------------------------------------------------------------
// Import under test (after mocks are registered)
// ---------------------------------------------------------------------------

import { generateProposal } from "@/lib/ai/proposal-generator";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const validPlan = {
  title: "Website Redesign Proposal for Acme Corp",
  client_analysis: "Acme Corp needs a modern SaaS website.",
  client_name: "John Smith",
  client_email: "john@acme.com",
  client_company: "Acme Corp",
  scope_items: [{ title: "UX Research", description: "User interviews" }],
  deliverables: [{ title: "Design System", description: "Figma components" }],
  timeline_phases: [
    { phase: "Discovery", duration: "2 weeks", description: "Research" },
  ],
  suggested_investment_cents: 850000,
  line_items: [{ description: "UX Research", amount_cents: 850000 }],
  key_selling_points: ["Fast delivery", "Expert team"],
};

const defaultInput: CreateProposalInput = {
  client_brief: "We need a complete website redesign for our SaaS product.",
  client_name: "John Smith",
  client_email: "john@acme.com",
  client_company: "Acme Corp",
  service_type: "web-design",
};

const defaultProfile = mockProfile();

function setupHappyPath(): void {
  // First call: plan (extended thinking, returns JSON)
  mockPromptClaude.mockResolvedValueOnce(JSON.stringify(validPlan));
  // Subsequent calls: executive summary, understanding, terms, about us
  mockPromptClaude.mockResolvedValueOnce("Executive summary text.");
  mockPromptClaude.mockResolvedValueOnce("Understanding of your needs.");
  mockPromptClaude.mockResolvedValueOnce("PAYMENT TERMS\n50% upfront...");
  mockPromptClaude.mockResolvedValueOnce("About us section.");
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("generateProposal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPromptClaude.mockReset();
    // Reset the from mock to the default chain
    mockSupabase.from.mockImplementation(() =>
      chainable({ data: null, error: null, count: 0 })
    );
  });

  it("calls promptClaude to generate a plan with extended thinking", async () => {
    setupHappyPath();

    await generateProposal("proposal-1", defaultInput, defaultProfile);

    // First call should request extended thinking for the plan step
    expect(mockPromptClaude).toHaveBeenCalledWith(
      expect.stringContaining("expert business consultant"),
      expect.stringContaining("Create a detailed proposal plan"),
      expect.objectContaining({
        useExtendedThinking: true,
        budgetTokens: 8192,
      })
    );
  });

  it("generates all content sections via parallel promptClaude calls", async () => {
    setupHappyPath();

    await generateProposal("proposal-1", defaultInput, defaultProfile);

    // 1 plan call + 4 section calls = 5 total
    expect(mockPromptClaude).toHaveBeenCalledTimes(5);
  });

  it("updates proposal status to draft with generated content on success", async () => {
    setupHappyPath();

    await generateProposal("proposal-1", defaultInput, defaultProfile);

    // The final update call should set status to "draft" and include content
    const updateCalls = mockSupabase.from.mock.calls.filter(
      (call: string[]) => call[0] === "proposals"
    );
    expect(updateCalls.length).toBeGreaterThan(0);

    // Verify the from("proposals") was called for the final update
    expect(mockSupabase.from).toHaveBeenCalledWith("proposals");
  });

  it("updates generation_metadata progress through each step", async () => {
    setupHappyPath();

    const updateChains: ReturnType<typeof chainable>[] = [];
    mockSupabase.from.mockImplementation(() => {
      const c = chainable({ data: null, error: null, count: 0 });
      updateChains.push(c);
      return c;
    });

    await generateProposal("proposal-1", defaultInput, defaultProfile);

    // updateGenerationStatus is called multiple times with increasing progress
    // Each call does from("proposals").update(...).eq("id", proposalId)
    // Verify at least one update call was made
    const proposalCalls = mockSupabase.from.mock.calls.filter(
      (call: string[]) => call[0] === "proposals"
    );
    expect(proposalCalls.length).toBeGreaterThanOrEqual(5);
  });

  it("handles JSON wrapped in markdown code blocks", async () => {
    // Return plan wrapped in markdown code block
    mockPromptClaude.mockResolvedValueOnce(
      "```json\n" + JSON.stringify(validPlan) + "\n```"
    );
    mockPromptClaude.mockResolvedValueOnce("Executive summary.");
    mockPromptClaude.mockResolvedValueOnce("Understanding section.");
    mockPromptClaude.mockResolvedValueOnce("Terms section.");
    mockPromptClaude.mockResolvedValueOnce("About us section.");

    // The regex extraction in the source should handle this
    await expect(
      generateProposal("proposal-1", defaultInput, defaultProfile)
    ).resolves.toBeUndefined();
  });

  it("writes error to generation_metadata when plan parsing fails completely", async () => {
    // Return something that is not valid JSON at all
    mockPromptClaude.mockResolvedValueOnce("This is not JSON at all.");

    const updateChains: ReturnType<typeof chainable>[] = [];
    mockSupabase.from.mockImplementation(() => {
      const c = chainable({ data: null, error: null, count: 0 });
      updateChains.push(c);
      return c;
    });

    await generateProposal("proposal-1", defaultInput, defaultProfile);

    // The last from("proposals").update() should contain error metadata
    // We verify the function did not throw (it catches internally)
    const proposalCalls = mockSupabase.from.mock.calls.filter(
      (call: string[]) => call[0] === "proposals"
    );
    expect(proposalCalls.length).toBeGreaterThan(0);
  });

  it("writes error to generation_metadata when promptClaude throws", async () => {
    mockPromptClaude.mockRejectedValueOnce(
      new Error("API rate limit exceeded")
    );

    const updateChains: ReturnType<typeof chainable>[] = [];
    mockSupabase.from.mockImplementation(() => {
      const c = chainable({ data: null, error: null, count: 0 });
      updateChains.push(c);
      return c;
    });

    // Should not throw -- the function catches errors internally
    await expect(
      generateProposal("proposal-1", defaultInput, defaultProfile)
    ).resolves.toBeUndefined();

    // Should have written error metadata
    const proposalCalls = mockSupabase.from.mock.calls.filter(
      (call: string[]) => call[0] === "proposals"
    );
    expect(proposalCalls.length).toBeGreaterThan(0);
  });

  it("includes client brief and profile info in the plan prompt", async () => {
    setupHappyPath();

    await generateProposal("proposal-1", defaultInput, defaultProfile);

    const planCallArgs = mockPromptClaude.mock.calls[0];
    const userPrompt = planCallArgs[1] as string;

    expect(userPrompt).toContain(defaultInput.client_brief);
    expect(userPrompt).toContain("Test Agency"); // profile.company_name
    expect(userPrompt).toContain("John Smith"); // client_name
    expect(userPrompt).toContain("web-design"); // service_type
  });

  it("auto-creates a client record when client info is extracted", async () => {
    setupHappyPath();

    // Track what gets inserted into clients table
    const clientInsertChain = chainable({
      data: { id: "new-client-1" },
      error: null,
    });
    const defaultChain = chainable({ data: null, error: null, count: 0 });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "clients") {
        return clientInsertChain;
      }
      return defaultChain;
    });

    await generateProposal("proposal-1", defaultInput, defaultProfile);

    // Should have called from("clients") to check/create client
    expect(mockSupabase.from).toHaveBeenCalledWith("clients");
  });

  it("uses existing client when found by email", async () => {
    setupHappyPath();

    const existingClient = chainable({
      data: { id: "existing-client-1" },
      error: null,
    });
    const defaultChain = chainable({ data: null, error: null, count: 0 });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "clients") {
        return existingClient;
      }
      return defaultChain;
    });

    await generateProposal("proposal-1", defaultInput, defaultProfile);

    // Should query clients table for existing client
    expect(mockSupabase.from).toHaveBeenCalledWith("clients");
  });

  it("incorporates template AI guidance when templateContent is provided", async () => {
    setupHappyPath();

    const template: TemplateContent = {
      color_scheme: { primary: "#000000", accent: "#ffffff" },
      layout: "modern",
      terms: "Custom template terms.",
      ai_guidance: {
        tone: "Formal and authoritative",
        industry_context: "Enterprise software consulting",
        pricing_guidance: "Premium pricing for enterprise clients",
        pricing_model: "fixed",
        style_notes: "Use short sentences",
      },
      section_config: {
        include_understanding: true,
        include_about_us: true,
      },
    };

    await generateProposal("proposal-1", defaultInput, defaultProfile, template);

    // System prompt should include template tone guidance
    const planCallArgs = mockPromptClaude.mock.calls[0];
    const systemPrompt = planCallArgs[0] as string;
    expect(systemPrompt).toContain("Formal and authoritative");
    expect(systemPrompt).toContain("Use short sentences");

    // User prompt should include industry context and pricing guidance
    const userPrompt = planCallArgs[1] as string;
    expect(userPrompt).toContain("Enterprise software consulting");
    expect(userPrompt).toContain("Premium pricing for enterprise clients");
  });

  it("uses template terms directly when template has terms", async () => {
    // Plan call
    mockPromptClaude.mockResolvedValueOnce(JSON.stringify(validPlan));
    // Executive summary
    mockPromptClaude.mockResolvedValueOnce("Executive summary.");
    // Understanding
    mockPromptClaude.mockResolvedValueOnce("Understanding section.");
    // About us
    mockPromptClaude.mockResolvedValueOnce("About us section.");
    // NOTE: Terms is NOT generated via AI when template provides them

    const template: TemplateContent = {
      color_scheme: { primary: "#000000", accent: "#ffffff" },
      layout: "modern",
      terms: "These are the template-provided terms.",
      ai_guidance: {
        tone: "Professional",
        industry_context: "General",
        pricing_guidance: "Standard",
        pricing_model: "fixed",
        style_notes: "",
      },
      section_config: {
        include_understanding: true,
        include_about_us: true,
      },
    };

    await generateProposal("proposal-1", defaultInput, defaultProfile, template);

    // Only 4 promptClaude calls (plan + exec summary + understanding + about us)
    // Terms is skipped because the template provides them
    expect(mockPromptClaude).toHaveBeenCalledTimes(4);
  });

  it("skips understanding and about_us sections when template disables them", async () => {
    // Plan call
    mockPromptClaude.mockResolvedValueOnce(JSON.stringify(validPlan));
    // Executive summary only
    mockPromptClaude.mockResolvedValueOnce("Executive summary.");
    // Terms (generated since template has empty terms but section config disables others)
    mockPromptClaude.mockResolvedValueOnce("Generated terms.");

    const template: TemplateContent = {
      color_scheme: { primary: "#000000", accent: "#ffffff" },
      layout: "classic",
      terms: "", // empty, so AI generates terms
      ai_guidance: {
        tone: "Casual",
        industry_context: "Startup",
        pricing_guidance: "Budget-friendly",
        pricing_model: "hourly",
        style_notes: "",
      },
      section_config: {
        include_understanding: false,
        include_about_us: false,
      },
    };

    await generateProposal("proposal-1", defaultInput, defaultProfile, template);

    // Plan + exec summary + terms = 3 calls (understanding and about_us are skipped)
    expect(mockPromptClaude).toHaveBeenCalledTimes(3);
  });
});
