import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockProfile } from "@/test/fixtures";

// ---- Hoisted mocks (created before vi.mock factories execute) ----

const { mockSupabase, mockQueries, mockRevalidatePath } = vi.hoisted(() => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
  };

  const mockQueries = {
    updateProfile: vi.fn(),
    getProfile: vi.fn(),
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
  updateProfileAction,
  updateBrandAction,
} from "@/actions/settings";

// ---- Helpers ----

const defaultUser = { id: "user-1", email: "test@example.com", user_metadata: { full_name: "Test User" } };

// ---- Tests ----

describe("updateProfileAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: defaultUser },
      error: null,
    });
    mockQueries.updateProfile.mockResolvedValue(mockProfile());
  });

  it("should return validation error when full_name is missing", async () => {
    const result = await updateProfileAction({ full_name: "" });
    expect(result).toEqual({ error: "Name is required" });
  });

  it("should return error when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await updateProfileAction({ full_name: "Test User" });
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("should update profile and revalidate settings path on success", async () => {
    const result = await updateProfileAction({
      full_name: "Updated User",
      company_name: "New Agency",
      phone: "+9876543210",
      address: "456 New St",
      bio: "Updated bio.",
      website: "https://newagency.com",
    });

    expect(mockQueries.updateProfile).toHaveBeenCalledWith(
      mockSupabase,
      "user-1",
      {
        full_name: "Updated User",
        company_name: "New Agency",
        phone: "+9876543210",
        address: "456 New St",
        bio: "Updated bio.",
        website: "https://newagency.com",
      },
    );

    expect(mockRevalidatePath).toHaveBeenCalledWith("/settings");
    expect(result).toEqual({ success: true });
  });

  it("should set optional fields to null when not provided", async () => {
    await updateProfileAction({ full_name: "Minimal User" });

    expect(mockQueries.updateProfile).toHaveBeenCalledWith(
      mockSupabase,
      "user-1",
      {
        full_name: "Minimal User",
        company_name: null,
        phone: null,
        address: null,
        bio: null,
        website: null,
      },
    );
  });

  it("should return validation error for invalid website URL", async () => {
    const result = await updateProfileAction({
      full_name: "Test User",
      website: "not-a-url",
    });
    expect(result).toEqual({ error: "Invalid URL" });
  });
});

describe("updateBrandAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: defaultUser },
      error: null,
    });
    mockQueries.updateProfile.mockResolvedValue(mockProfile());
  });

  it("should return validation error for invalid hex color", async () => {
    const result = await updateBrandAction({
      brand_color: "not-a-color",
      brand_accent: "#e5b868",
    });
    expect(result).toEqual({ error: "Must be a valid hex color" });
  });

  it("should return error when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await updateBrandAction({
      brand_color: "#d4a853",
      brand_accent: "#e5b868",
    });
    expect(result).toEqual({ error: "Not authenticated" });
  });

  it("should update brand colors and revalidate brand settings path", async () => {
    const result = await updateBrandAction({
      brand_color: "#ff0000",
      brand_accent: "#00ff00",
    });

    expect(mockQueries.updateProfile).toHaveBeenCalledWith(
      mockSupabase,
      "user-1",
      {
        brand_color: "#ff0000",
        brand_accent: "#00ff00",
      },
    );

    expect(mockRevalidatePath).toHaveBeenCalledWith("/settings/brand");
    expect(result).toEqual({ success: true });
  });
});
