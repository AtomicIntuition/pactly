import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockClient } from "@/test/fixtures";

// ---- Hoisted mocks (created before vi.mock factories execute) ----

const { mockSupabase, mockQueries, mockRevalidatePath } = vi.hoisted(() => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
  };

  const mockQueries = {
    createClient: vi.fn(),
    updateClient: vi.fn(),
    deleteClient: vi.fn(),
    logActivity: vi.fn(),
  };

  const mockRevalidatePath = vi.fn();

  return { mockSupabase, mockQueries, mockRevalidatePath };
});

// ---- Module mocks ----

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}));

vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

vi.mock("@/lib/supabase/queries", () => mockQueries);

// ---- Imports (after mocks) ----

import {
  createClientAction,
  updateClientAction,
  deleteClientAction,
} from "@/actions/clients";

// ---- Helpers ----

const defaultUser = { id: "user-1", email: "test@example.com", user_metadata: { full_name: "Test User" } };

// ---- Tests ----

describe("createClientAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: defaultUser },
      error: null,
    });
    mockQueries.createClient.mockResolvedValue(mockClient());
    mockQueries.logActivity.mockResolvedValue(undefined);
  });

  it("should return validation error when name is missing", async () => {
    const result = await createClientAction({ name: "" });
    expect(result).toEqual({ error: "Name is required" });
  });

  it("should return error when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await createClientAction({ name: "New Client" });
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("should create client, log activity, and revalidate on success", async () => {
    const result = await createClientAction({
      name: "New Client",
      email: "newclient@example.com",
      company: "New Corp",
    });

    expect(mockQueries.createClient).toHaveBeenCalledWith(
      mockSupabase,
      expect.objectContaining({
        user_id: "user-1",
        name: "New Client",
        email: "newclient@example.com",
        company: "New Corp",
      }),
    );

    expect(mockQueries.logActivity).toHaveBeenCalledWith(
      mockSupabase,
      expect.objectContaining({
        user_id: "user-1",
        proposal_id: null,
        action: 'Added client "New Client"',
      }),
    );

    expect(mockRevalidatePath).toHaveBeenCalledWith("/clients");
    expect(result).toEqual({ success: true });
  });

  it("should set optional fields to null when not provided", async () => {
    await createClientAction({ name: "Minimal Client" });

    expect(mockQueries.createClient).toHaveBeenCalledWith(
      mockSupabase,
      expect.objectContaining({
        name: "Minimal Client",
        email: null,
        company: null,
        website: null,
        industry: null,
        phone: null,
        notes: null,
      }),
    );
  });
});

describe("updateClientAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: defaultUser },
      error: null,
    });
    mockQueries.updateClient.mockResolvedValue(mockClient());
  });

  it("should return error when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await updateClientAction("client-1", { name: "Updated Client" });
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("should update client and revalidate both paths on success", async () => {
    const result = await updateClientAction("client-1", { name: "Updated Name" });

    expect(mockQueries.updateClient).toHaveBeenCalledWith(
      mockSupabase,
      "client-1",
      { name: "Updated Name" },
    );

    expect(mockRevalidatePath).toHaveBeenCalledWith("/clients");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/clients/client-1");
    expect(result).toEqual({ success: true });
  });

  it("should return validation error for invalid email", async () => {
    const result = await updateClientAction("client-1", { email: "not-valid-email" });
    expect(result).toEqual(expect.objectContaining({ error: expect.any(String) }));
  });
});

describe("deleteClientAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: defaultUser },
      error: null,
    });
    mockQueries.deleteClient.mockResolvedValue(undefined);
  });

  it("should return error when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await deleteClientAction("client-1");
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("should delete client and revalidate on success", async () => {
    const result = await deleteClientAction("client-1");

    expect(mockQueries.deleteClient).toHaveBeenCalledWith(mockSupabase, "client-1");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/clients");
    expect(result).toEqual({ success: true });
  });
});
