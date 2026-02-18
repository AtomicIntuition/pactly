import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockProfile, mockProposal, mockClient } from "@/test/fixtures";

// ---- Hoisted mocks (created before vi.mock factories execute) ----

const { mockSupabase, mockQueries, mockRedirect, mockRevalidatePath, mockSendEmail } = vi.hoisted(() => {
  const mockSupabase = {
    from: vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }),
    auth: {
      getUser: vi.fn(),
    },
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: { path: "test" }, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "https://example.com/logo.png" } }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    },
  };

  const mockQueries = {
    createProposal: vi.fn(),
    updateProposal: vi.fn(),
    deleteProposal: vi.fn(),
    getProposal: vi.fn(),
    getProfile: vi.fn(),
    logActivity: vi.fn(),
    findClientByEmailOrCompany: vi.fn(),
    createClient: vi.fn(),
  };

  const mockRedirect = vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`);
  });

  const mockRevalidatePath = vi.fn();
  const mockSendEmail = vi.fn();

  return { mockSupabase, mockQueries, mockRedirect, mockRevalidatePath, mockSendEmail };
});

// ---- Module mocks ----

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}));

vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

vi.mock("@/lib/ai/proposal-generator", () => ({
  generateProposal: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/email/send", () => ({
  sendProposalEmail: mockSendEmail,
}));

vi.mock("@/lib/templates", () => ({
  isSystemTemplateId: vi.fn().mockReturnValue(false),
  getSystemTemplate: vi.fn().mockReturnValue(null),
}));

vi.mock("@/lib/supabase/queries", () => mockQueries);

// ---- Imports (after mocks) ----

import {
  createProposalAction,
  updateProposalAction,
  deleteProposalAction,
  updateProposalStatusAction,
  sendProposalAction,
} from "@/actions/proposals";

// ---- Helpers ----

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
  }
  return fd;
}

const defaultUser = { id: "user-1", email: "test@example.com", user_metadata: { full_name: "Test User" } };

// ---- Tests ----

describe("createProposalAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: defaultUser },
      error: null,
    });
    mockSupabase.from.mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });
    mockQueries.getProfile.mockResolvedValue(mockProfile({ proposal_count: 0 }));
    mockQueries.createProposal.mockResolvedValue(mockProposal({ id: "new-proposal" }));
    mockQueries.findClientByEmailOrCompany.mockResolvedValue(null);
    mockQueries.createClient.mockResolvedValue(mockClient({ id: "new-client" }));
    mockQueries.logActivity.mockResolvedValue(undefined);
  });

  it("should return validation error when client_brief is too short", async () => {
    const fd = makeFormData({ client_brief: "short" });
    const result = await createProposalAction(undefined, fd);
    expect(result).toEqual({ error: "Brief must be at least 10 characters" });
  });

  it("should return error when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const fd = makeFormData({ client_brief: "A sufficiently long brief for the proposal" });
    const result = await createProposalAction(undefined, fd);
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("should return error when profile is not found", async () => {
    mockQueries.getProfile.mockResolvedValue(null);

    const fd = makeFormData({ client_brief: "A sufficiently long brief for the proposal" });
    const result = await createProposalAction(undefined, fd);
    expect(result).toEqual({ error: "Profile not found" });
  });

  it("should return error when user has reached monthly proposal limit", async () => {
    mockQueries.getProfile.mockResolvedValue(mockProfile({ plan: "free", proposal_count: 5 }));

    const fd = makeFormData({ client_brief: "A sufficiently long brief for the proposal" });
    const result = await createProposalAction(undefined, fd);
    expect(result).toEqual({
      error: "You've reached your monthly limit of 5 proposals. Upgrade your plan for more.",
    });
  });

  it("should create a proposal and redirect on success", async () => {
    const fd = makeFormData({ client_brief: "A sufficiently long brief for the proposal" });

    await expect(createProposalAction(undefined, fd)).rejects.toThrow("NEXT_REDIRECT");

    expect(mockQueries.createProposal).toHaveBeenCalledWith(
      mockSupabase,
      expect.objectContaining({
        user_id: "user-1",
        status: "generating",
        client_brief: "A sufficiently long brief for the proposal",
        title: "New Proposal",
      }),
    );
  });

  it("should auto-create a client when client info is provided and no match exists", async () => {
    const fd = makeFormData({
      client_brief: "A sufficiently long brief for the proposal",
      client_name: "John Smith",
      client_email: "john@acme.com",
      client_company: "Acme Corp",
    });

    await expect(createProposalAction(undefined, fd)).rejects.toThrow("NEXT_REDIRECT");

    expect(mockQueries.findClientByEmailOrCompany).toHaveBeenCalledWith(
      mockSupabase,
      "user-1",
      "john@acme.com",
      "Acme Corp",
    );
    expect(mockQueries.createClient).toHaveBeenCalledWith(
      mockSupabase,
      expect.objectContaining({
        user_id: "user-1",
        name: "John Smith",
        email: "john@acme.com",
        company: "Acme Corp",
      }),
    );
  });

  it("should link to existing client when a match is found", async () => {
    const existingClient = mockClient({ id: "existing-client-99" });
    mockQueries.findClientByEmailOrCompany.mockResolvedValue(existingClient);

    const fd = makeFormData({
      client_brief: "A sufficiently long brief for the proposal",
      client_name: "John Smith",
      client_email: "john@acme.com",
      client_company: "Acme Corp",
    });

    await expect(createProposalAction(undefined, fd)).rejects.toThrow("NEXT_REDIRECT");

    expect(mockQueries.createClient).not.toHaveBeenCalled();
    expect(mockQueries.createProposal).toHaveBeenCalledWith(
      mockSupabase,
      expect.objectContaining({ client_id: "existing-client-99" }),
    );
  });

  it("should use company name in proposal title when client_company is provided", async () => {
    const fd = makeFormData({
      client_brief: "A sufficiently long brief for the proposal",
      client_company: "Acme Corp",
    });

    await expect(createProposalAction(undefined, fd)).rejects.toThrow("NEXT_REDIRECT");

    expect(mockQueries.createProposal).toHaveBeenCalledWith(
      mockSupabase,
      expect.objectContaining({ title: "Acme Corp Proposal" }),
    );
  });
});

describe("updateProposalAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: defaultUser },
      error: null,
    });
    mockQueries.updateProposal.mockResolvedValue(mockProposal());
  });

  it("should return validation error for invalid data", async () => {
    const result = await updateProposalAction("proposal-1", {
      status: "nonexistent_status",
    });
    expect(result).toEqual(expect.objectContaining({ error: expect.any(String) }));
  });

  it("should return error when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await updateProposalAction("proposal-1", { title: "Updated Title" });
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("should update proposal and revalidate path on success", async () => {
    const result = await updateProposalAction("proposal-1", { title: "Updated Title" });

    expect(mockQueries.updateProposal).toHaveBeenCalledWith(
      mockSupabase,
      "proposal-1",
      { title: "Updated Title" },
    );
    expect(mockRevalidatePath).toHaveBeenCalledWith("/proposals/proposal-1");
    expect(result).toEqual({ success: true });
  });
});

describe("deleteProposalAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: defaultUser },
      error: null,
    });
    mockQueries.deleteProposal.mockResolvedValue(undefined);
    mockQueries.logActivity.mockResolvedValue(undefined);
  });

  it("should return error when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await deleteProposalAction("proposal-1");
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("should delete proposal, log activity, revalidate and redirect", async () => {
    await expect(deleteProposalAction("proposal-1")).rejects.toThrow("NEXT_REDIRECT");

    expect(mockQueries.deleteProposal).toHaveBeenCalledWith(mockSupabase, "proposal-1");
    expect(mockQueries.logActivity).toHaveBeenCalledWith(
      mockSupabase,
      expect.objectContaining({
        user_id: "user-1",
        proposal_id: "proposal-1",
        action: "Deleted a proposal",
      }),
    );
    expect(mockRevalidatePath).toHaveBeenCalledWith("/proposals");
  });
});

describe("updateProposalStatusAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: defaultUser },
      error: null,
    });
    mockQueries.updateProposal.mockResolvedValue(mockProposal());
    mockQueries.logActivity.mockResolvedValue(undefined);
  });

  it("should return error for invalid status", async () => {
    const result = await updateProposalStatusAction("proposal-1", "invalid_status");
    expect(result).toEqual({ error: "Invalid status" });
  });

  it("should return error when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await updateProposalStatusAction("proposal-1", "draft");
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("should update status and set sent_at when status is 'sent'", async () => {
    const result = await updateProposalStatusAction("proposal-1", "sent");

    expect(mockQueries.updateProposal).toHaveBeenCalledWith(
      mockSupabase,
      "proposal-1",
      expect.objectContaining({
        status: "sent",
        sent_at: expect.any(String),
      }),
    );
    expect(mockRevalidatePath).toHaveBeenCalledWith("/proposals/proposal-1");
    expect(result).toEqual({ success: true });
  });

  it("should set responded_at when status is 'accepted'", async () => {
    const result = await updateProposalStatusAction("proposal-1", "accepted");

    expect(mockQueries.updateProposal).toHaveBeenCalledWith(
      mockSupabase,
      "proposal-1",
      expect.objectContaining({
        status: "accepted",
        responded_at: expect.any(String),
      }),
    );
    expect(result).toEqual({ success: true });
  });

  it("should set responded_at when status is 'declined'", async () => {
    await updateProposalStatusAction("proposal-1", "declined");

    expect(mockQueries.updateProposal).toHaveBeenCalledWith(
      mockSupabase,
      "proposal-1",
      expect.objectContaining({
        status: "declined",
        responded_at: expect.any(String),
      }),
    );
  });
});

describe("sendProposalAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: defaultUser },
      error: null,
    });
    mockQueries.getProposal.mockResolvedValue(mockProposal({ share_token: null }));
    mockQueries.getProfile.mockResolvedValue(mockProfile());
    mockQueries.updateProposal.mockResolvedValue(mockProposal());
    mockQueries.logActivity.mockResolvedValue(undefined);
    mockSendEmail.mockResolvedValue(true);
  });

  it("should return validation error for invalid email", async () => {
    const result = await sendProposalAction("proposal-1", { client_email: "not-an-email" });
    expect(result).toEqual({ error: "Invalid email address" });
  });

  it("should return error when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await sendProposalAction("proposal-1", { client_email: "client@example.com" });
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("should return error when proposal is not found", async () => {
    mockQueries.getProposal.mockResolvedValue(null);

    const result = await sendProposalAction("proposal-1", { client_email: "client@example.com" });
    expect(result).toEqual({ error: "Proposal not found" });
  });

  it("should return error when profile is not found", async () => {
    mockQueries.getProfile.mockResolvedValue(null);

    const result = await sendProposalAction("proposal-1", { client_email: "client@example.com" });
    expect(result).toEqual({ error: "Profile not found" });
  });

  it("should send proposal email, update proposal, and return shareUrl", async () => {
    const result = await sendProposalAction("proposal-1", { client_email: "client@example.com" });

    expect(mockQueries.updateProposal).toHaveBeenCalledWith(
      mockSupabase,
      "proposal-1",
      expect.objectContaining({
        share_enabled: true,
        status: "sent",
        sent_at: expect.any(String),
        client_email: "client@example.com",
        share_token: expect.any(String),
      }),
    );

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "client@example.com",
        proposalTitle: "Website Redesign Proposal",
        senderName: "Test User",
      }),
    );

    expect(mockRevalidatePath).toHaveBeenCalledWith("/proposals/proposal-1");
    expect(result).toEqual({ success: true, shareUrl: expect.stringContaining("/share/") });
  });

  it("should return warning when email is not configured", async () => {
    mockSendEmail.mockResolvedValue(false);

    const result = await sendProposalAction("proposal-1", { client_email: "client@example.com" });

    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        shareUrl: expect.any(String),
        warning: "Email not configured. Share link has been enabled — copy it manually.",
      }),
    );
  });
});
