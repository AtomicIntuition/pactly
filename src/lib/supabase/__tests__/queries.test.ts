import { describe, it, expect, vi } from "vitest";
import { mockProfile, mockProposal, mockClient } from "@/test/fixtures";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  getProfile,
  updateProfile,
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  findClientByEmailOrCompany,
  getProposals,
  getProposal,
  getProposalsByClient,
  getProposalByShareToken,
  createProposal,
  updateProposal,
  deleteProposal,
  incrementProposalViewCount,
  getActivityLog,
  logActivity,
  getDashboardStats,
} from "@/lib/supabase/queries";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a chainable mock where every method returns the chain itself (for
 * method-chaining calls like `.from().select().eq().single()`) and the chain
 * resolves (is thenable) to the provided result.
 */
function chainable(result: { data: unknown; error: unknown; count?: number }) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  const methods = [
    "select", "insert", "update", "delete", "upsert",
    "eq", "neq", "gt", "gte", "lt", "lte", "in",
    "or", "and", "not", "is", "like", "ilike",
    "order", "limit", "range", "single", "maybeSingle",
    "textSearch", "filter", "match", "contains",
  ];

  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain);
  }

  // single / maybeSingle resolve directly
  chain.single = vi.fn().mockResolvedValue(result);
  chain.maybeSingle = vi.fn().mockResolvedValue(result);

  // Make the chain thenable so `await query` works
  Object.defineProperty(chain, "then", {
    value: (resolve: (v: typeof result) => void) =>
      Promise.resolve(result).then(resolve),
    enumerable: false,
    configurable: true,
  });

  return chain;
}

/**
 * Return a minimal mock Supabase client where `from()` returns the provided
 * chain (or a default one).
 */
function supabaseWith(chain: ReturnType<typeof chainable>) {
  return {
    from: vi.fn().mockReturnValue(chain),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  } as unknown as SupabaseClient;
}

// ---------------------------------------------------------------------------
// Profile Queries
// ---------------------------------------------------------------------------

describe("Profile Queries", () => {
  describe("getProfile", () => {
    it("returns a profile when found", async () => {
      const profile = mockProfile();
      const chain = chainable({ data: profile, error: null });
      const supabase = supabaseWith(chain);

      const result = await getProfile(supabase, "user-1");

      expect(supabase.from).toHaveBeenCalledWith("profiles");
      expect(chain.select).toHaveBeenCalledWith("*");
      expect(chain.eq).toHaveBeenCalledWith("id", "user-1");
      expect(chain.single).toHaveBeenCalled();
      expect(result).toEqual(profile);
    });

    it("returns null when there is an error", async () => {
      const chain = chainable({ data: null, error: { message: "Not found" } });
      const supabase = supabaseWith(chain);

      const result = await getProfile(supabase, "nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("updates and returns the profile", async () => {
      const updated = mockProfile({ full_name: "Updated Name" });
      const chain = chainable({ data: updated, error: null });
      const supabase = supabaseWith(chain);

      const result = await updateProfile(supabase, "user-1", {
        full_name: "Updated Name",
      });

      expect(supabase.from).toHaveBeenCalledWith("profiles");
      expect(chain.update).toHaveBeenCalledWith({ full_name: "Updated Name" });
      expect(chain.eq).toHaveBeenCalledWith("id", "user-1");
      expect(result).toEqual(updated);
    });

    it("throws on error", async () => {
      const chain = chainable({
        data: null,
        error: { message: "Update failed" },
      });
      const supabase = supabaseWith(chain);

      await expect(
        updateProfile(supabase, "user-1", { full_name: "X" })
      ).rejects.toThrow("Update failed");
    });
  });
});

// ---------------------------------------------------------------------------
// Client Queries
// ---------------------------------------------------------------------------

describe("Client Queries", () => {
  describe("getClients", () => {
    it("returns an array of clients", async () => {
      const clients = [mockClient(), mockClient({ id: "client-2" })];
      const chain = chainable({ data: clients, error: null });
      const supabase = supabaseWith(chain);

      const result = await getClients(supabase, "user-1");

      expect(supabase.from).toHaveBeenCalledWith("clients");
      expect(chain.select).toHaveBeenCalledWith("*");
      expect(chain.eq).toHaveBeenCalledWith("user_id", "user-1");
      expect(chain.order).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
      expect(result).toEqual(clients);
    });

    it("throws when there is an error", async () => {
      const chain = chainable({ data: null, error: { message: "DB error" } });
      const supabase = supabaseWith(chain);

      await expect(getClients(supabase, "user-1")).rejects.toThrow("DB error");
    });

    it("returns empty array when data is null", async () => {
      const chain = chainable({ data: null, error: null });
      const supabase = supabaseWith(chain);

      const result = await getClients(supabase, "user-1");
      expect(result).toEqual([]);
    });
  });

  describe("getClient", () => {
    it("returns a single client", async () => {
      const client = mockClient();
      const chain = chainable({ data: client, error: null });
      const supabase = supabaseWith(chain);

      const result = await getClient(supabase, "client-1");

      expect(chain.eq).toHaveBeenCalledWith("id", "client-1");
      expect(result).toEqual(client);
    });

    it("returns null on error", async () => {
      const chain = chainable({ data: null, error: { message: "Not found" } });
      const supabase = supabaseWith(chain);

      const result = await getClient(supabase, "missing");
      expect(result).toBeNull();
    });
  });

  describe("createClient", () => {
    it("inserts and returns the new client", async () => {
      const newClient = mockClient();
      const chain = chainable({ data: newClient, error: null });
      const supabase = supabaseWith(chain);

      const input = {
        user_id: "user-1",
        name: "John Smith",
        email: "john@acme.com" as string | null,
        company: "Acme Corp" as string | null,
        website: null as string | null,
        industry: null as string | null,
        phone: null as string | null,
        notes: null as string | null,
      };

      const result = await createClient(supabase, input);

      expect(chain.insert).toHaveBeenCalledWith(input);
      expect(chain.select).toHaveBeenCalled();
      expect(result).toEqual(newClient);
    });

    it("throws when insert fails", async () => {
      const chain = chainable({
        data: null,
        error: { message: "Duplicate email" },
      });
      const supabase = supabaseWith(chain);

      await expect(
        createClient(supabase, {
          user_id: "user-1",
          name: "John Smith",
          email: null,
          company: null,
          website: null,
          industry: null,
          phone: null,
          notes: null,
        })
      ).rejects.toThrow("Duplicate email");
    });
  });

  describe("updateClient", () => {
    it("updates and returns the client", async () => {
      const updated = mockClient({ name: "Jane Doe" });
      const chain = chainable({ data: updated, error: null });
      const supabase = supabaseWith(chain);

      const result = await updateClient(supabase, "client-1", {
        name: "Jane Doe",
      });

      expect(chain.update).toHaveBeenCalledWith({ name: "Jane Doe" });
      expect(chain.eq).toHaveBeenCalledWith("id", "client-1");
      expect(result).toEqual(updated);
    });

    it("throws on error", async () => {
      const chain = chainable({
        data: null,
        error: { message: "Not found" },
      });
      const supabase = supabaseWith(chain);

      await expect(
        updateClient(supabase, "client-1", { name: "X" })
      ).rejects.toThrow("Not found");
    });
  });

  describe("deleteClient", () => {
    it("deletes without throwing on success", async () => {
      const chain = chainable({ data: null, error: null });
      const supabase = supabaseWith(chain);

      await expect(deleteClient(supabase, "client-1")).resolves.toBeUndefined();
      expect(supabase.from).toHaveBeenCalledWith("clients");
      expect(chain.delete).toHaveBeenCalled();
      expect(chain.eq).toHaveBeenCalledWith("id", "client-1");
    });

    it("throws on error", async () => {
      const chain = chainable({
        data: null,
        error: { message: "Constraint violation" },
      });
      const supabase = supabaseWith(chain);

      await expect(deleteClient(supabase, "client-1")).rejects.toThrow(
        "Constraint violation"
      );
    });
  });

  describe("findClientByEmailOrCompany", () => {
    it("finds client by email first", async () => {
      const client = mockClient();
      const chain = chainable({ data: client, error: null });
      const supabase = supabaseWith(chain);

      const result = await findClientByEmailOrCompany(
        supabase,
        "user-1",
        "john@acme.com",
        "Acme Corp"
      );

      expect(result).toEqual(client);
      // Should have called eq with email
      expect(chain.eq).toHaveBeenCalledWith("email", "john@acme.com");
    });

    it("falls back to company when email returns null", async () => {
      // First call (email) returns null, second call (company) returns data
      const client = mockClient();
      let callCount = 0;
      const fromMock = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount <= 1) {
          return chainable({ data: null, error: null });
        }
        return chainable({ data: client, error: null });
      });

      const supabase = { from: fromMock } as unknown as SupabaseClient;

      const result = await findClientByEmailOrCompany(
        supabase,
        "user-1",
        "missing@test.com",
        "Acme Corp"
      );

      expect(result).toEqual(client);
    });

    it("returns null when neither email nor company match", async () => {
      const chain = chainable({ data: null, error: null });
      const supabase = supabaseWith(chain);

      const result = await findClientByEmailOrCompany(
        supabase,
        "user-1",
        null,
        null
      );

      expect(result).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// Proposal Queries
// ---------------------------------------------------------------------------

describe("Proposal Queries", () => {
  describe("getProposals", () => {
    it("returns proposals with count", async () => {
      const proposals = [mockProposal()];
      const chain = chainable({ data: proposals, error: null, count: 1 });
      const supabase = supabaseWith(chain);

      const result = await getProposals(supabase, "user-1");

      expect(supabase.from).toHaveBeenCalledWith("proposals");
      expect(chain.select).toHaveBeenCalledWith("*", { count: "exact" });
      expect(chain.eq).toHaveBeenCalledWith("user_id", "user-1");
      expect(chain.order).toHaveBeenCalledWith("updated_at", {
        ascending: false,
      });
      expect(result.proposals).toEqual(proposals);
      expect(result.count).toBe(1);
    });

    it("applies status filter when provided", async () => {
      const chain = chainable({ data: [], error: null, count: 0 });
      const supabase = supabaseWith(chain);

      await getProposals(supabase, "user-1", { status: "draft" });

      expect(chain.eq).toHaveBeenCalledWith("status", "draft");
    });

    it("applies search filter with or clause", async () => {
      const chain = chainable({ data: [], error: null, count: 0 });
      const supabase = supabaseWith(chain);

      await getProposals(supabase, "user-1", { search: "acme" });

      expect(chain.or).toHaveBeenCalledWith(
        "title.ilike.%acme%,client_name.ilike.%acme%,client_company.ilike.%acme%"
      );
    });

    it("sanitizes special characters from search", async () => {
      const chain = chainable({ data: [], error: null, count: 0 });
      const supabase = supabaseWith(chain);

      await getProposals(supabase, "user-1", { search: "acme%corp_" });

      // % and _ are stripped from the sanitized string
      expect(chain.or).toHaveBeenCalledWith(
        "title.ilike.%acmecorp%,client_name.ilike.%acmecorp%,client_company.ilike.%acmecorp%"
      );
    });

    it("uses range when offset is provided", async () => {
      const chain = chainable({ data: [], error: null, count: 0 });
      const supabase = supabaseWith(chain);

      await getProposals(supabase, "user-1", { offset: 10, limit: 5 });

      expect(chain.range).toHaveBeenCalledWith(10, 14);
    });

    it("defaults to limit 10 when no limit specified", async () => {
      const chain = chainable({ data: [], error: null, count: 0 });
      const supabase = supabaseWith(chain);

      await getProposals(supabase, "user-1");

      expect(chain.limit).toHaveBeenCalledWith(10);
    });

    it("throws on error", async () => {
      const chain = chainable({
        data: null,
        error: { message: "Query failed" },
      });
      const supabase = supabaseWith(chain);

      await expect(getProposals(supabase, "user-1")).rejects.toThrow(
        "Query failed"
      );
    });
  });

  describe("getProposal", () => {
    it("returns a proposal by id", async () => {
      const proposal = mockProposal();
      const chain = chainable({ data: proposal, error: null });
      const supabase = supabaseWith(chain);

      const result = await getProposal(supabase, "proposal-1");

      expect(chain.eq).toHaveBeenCalledWith("id", "proposal-1");
      expect(result).toEqual(proposal);
    });

    it("returns null on error", async () => {
      const chain = chainable({ data: null, error: { message: "Not found" } });
      const supabase = supabaseWith(chain);

      const result = await getProposal(supabase, "missing");
      expect(result).toBeNull();
    });
  });

  describe("getProposalsByClient", () => {
    it("returns proposals for a client", async () => {
      const proposals = [
        mockProposal({ client_id: "client-1" }),
        mockProposal({ id: "proposal-2", client_id: "client-1" }),
      ];
      const chain = chainable({ data: proposals, error: null });
      const supabase = supabaseWith(chain);

      const result = await getProposalsByClient(supabase, "client-1");

      expect(chain.eq).toHaveBeenCalledWith("client_id", "client-1");
      expect(chain.order).toHaveBeenCalledWith("updated_at", {
        ascending: false,
      });
      expect(result).toEqual(proposals);
    });

    it("throws on error", async () => {
      const chain = chainable({
        data: null,
        error: { message: "DB error" },
      });
      const supabase = supabaseWith(chain);

      await expect(
        getProposalsByClient(supabase, "client-1")
      ).rejects.toThrow("DB error");
    });
  });

  describe("getProposalByShareToken", () => {
    it("returns a proposal with valid share token and share_enabled", async () => {
      const proposal = mockProposal({
        share_token: "abc123",
        share_enabled: true,
      });
      const chain = chainable({ data: proposal, error: null });
      const supabase = supabaseWith(chain);

      const result = await getProposalByShareToken(supabase, "abc123");

      expect(chain.eq).toHaveBeenCalledWith("share_token", "abc123");
      expect(chain.eq).toHaveBeenCalledWith("share_enabled", true);
      expect(result).toEqual(proposal);
    });

    it("returns null when not found", async () => {
      const chain = chainable({ data: null, error: { message: "Not found" } });
      const supabase = supabaseWith(chain);

      const result = await getProposalByShareToken(supabase, "invalid");
      expect(result).toBeNull();
    });
  });

  describe("createProposal", () => {
    it("inserts and returns the new proposal", async () => {
      const proposal = mockProposal();
      const chain = chainable({ data: proposal, error: null });
      const supabase = supabaseWith(chain);

      const input = {
        user_id: "user-1",
        title: "Website Redesign Proposal",
        status: "generating" as const,
        client_brief: "We need a website redesign.",
        client_name: "John Smith",
        client_email: "john@acme.com",
        client_company: "Acme Corp",
        client_id: null,
        template_id: null,
        valid_until: "2025-03-01",
      };

      const result = await createProposal(supabase, input);

      expect(chain.insert).toHaveBeenCalledWith(input);
      expect(result).toEqual(proposal);
    });

    it("throws when insert fails", async () => {
      const chain = chainable({
        data: null,
        error: { message: "Insert failed" },
      });
      const supabase = supabaseWith(chain);

      await expect(
        createProposal(supabase, {
          user_id: "user-1",
          title: "Test",
          status: "draft",
          client_brief: "Brief",
          client_name: null,
          client_email: null,
          client_company: null,
          client_id: null,
          template_id: null,
          valid_until: null,
        })
      ).rejects.toThrow("Insert failed");
    });
  });

  describe("updateProposal", () => {
    it("updates and returns the proposal", async () => {
      const updated = mockProposal({ title: "Updated Title" });
      const chain = chainable({ data: updated, error: null });
      const supabase = supabaseWith(chain);

      const result = await updateProposal(supabase, "proposal-1", {
        title: "Updated Title",
      });

      expect(chain.update).toHaveBeenCalledWith({ title: "Updated Title" });
      expect(chain.eq).toHaveBeenCalledWith("id", "proposal-1");
      expect(result).toEqual(updated);
    });

    it("throws on error", async () => {
      const chain = chainable({
        data: null,
        error: { message: "Update failed" },
      });
      const supabase = supabaseWith(chain);

      await expect(
        updateProposal(supabase, "proposal-1", { title: "X" })
      ).rejects.toThrow("Update failed");
    });
  });

  describe("deleteProposal", () => {
    it("deletes without throwing on success", async () => {
      const chain = chainable({ data: null, error: null });
      const supabase = supabaseWith(chain);

      await expect(
        deleteProposal(supabase, "proposal-1")
      ).resolves.toBeUndefined();
      expect(supabase.from).toHaveBeenCalledWith("proposals");
      expect(chain.delete).toHaveBeenCalled();
    });

    it("throws on error", async () => {
      const chain = chainable({
        data: null,
        error: { message: "Delete failed" },
      });
      const supabase = supabaseWith(chain);

      await expect(
        deleteProposal(supabase, "proposal-1")
      ).rejects.toThrow("Delete failed");
    });
  });

  describe("incrementProposalViewCount", () => {
    it("calls rpc to increment view count", async () => {
      const rpcMock = vi.fn().mockResolvedValue({ data: null, error: null });
      const supabase = {
        from: vi.fn(),
        rpc: rpcMock,
      } as unknown as SupabaseClient;

      await incrementProposalViewCount(supabase, "proposal-1");

      expect(rpcMock).toHaveBeenCalledWith("increment_view_count", {
        proposal_id: "proposal-1",
      });
    });

    it("falls back to manual increment when rpc fails", async () => {
      const viewChain = chainable({
        data: { view_count: 5 },
        error: null,
      });
      const updateChain = chainable({ data: null, error: null });

      let callCount = 0;
      const fromMock = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) return viewChain;
        return updateChain;
      });

      const supabase = {
        from: fromMock,
        rpc: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "RPC not found" },
        }),
      } as unknown as SupabaseClient;

      await incrementProposalViewCount(supabase, "proposal-1");

      // Should have queried for current view_count then updated
      expect(fromMock).toHaveBeenCalledWith("proposals");
      expect(viewChain.select).toHaveBeenCalledWith("view_count");
    });
  });
});

// ---------------------------------------------------------------------------
// Activity Log Queries
// ---------------------------------------------------------------------------

describe("Activity Log Queries", () => {
  describe("getActivityLog", () => {
    it("returns activity log entries", async () => {
      const activities = [
        {
          id: "act-1",
          user_id: "user-1",
          proposal_id: "proposal-1",
          action: "created",
          metadata: {},
          created_at: "2025-01-15T10:00:00.000Z",
        },
      ];
      const chain = chainable({ data: activities, error: null });
      const supabase = supabaseWith(chain);

      const result = await getActivityLog(supabase, "user-1");

      expect(supabase.from).toHaveBeenCalledWith("activity_log");
      expect(chain.order).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
      expect(chain.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual(activities);
    });

    it("uses custom limit", async () => {
      const chain = chainable({ data: [], error: null });
      const supabase = supabaseWith(chain);

      await getActivityLog(supabase, "user-1", 5);

      expect(chain.limit).toHaveBeenCalledWith(5);
    });

    it("throws on error", async () => {
      const chain = chainable({
        data: null,
        error: { message: "Query failed" },
      });
      const supabase = supabaseWith(chain);

      await expect(getActivityLog(supabase, "user-1")).rejects.toThrow(
        "Query failed"
      );
    });
  });

  describe("logActivity", () => {
    it("inserts an activity entry", async () => {
      const chain = chainable({ data: null, error: null });
      const supabase = supabaseWith(chain);

      const activity = {
        user_id: "user-1",
        proposal_id: "proposal-1",
        action: "created",
        metadata: { title: "Test Proposal" },
      };

      await logActivity(supabase, activity);

      expect(supabase.from).toHaveBeenCalledWith("activity_log");
      expect(chain.insert).toHaveBeenCalledWith(activity);
    });

    it("throws on insert error", async () => {
      const chain = chainable({
        data: null,
        error: { message: "Insert failed" },
      });
      const supabase = supabaseWith(chain);

      await expect(
        logActivity(supabase, {
          user_id: "user-1",
          proposal_id: null,
          action: "login",
          metadata: {},
        })
      ).rejects.toThrow("Insert failed");
    });
  });
});

// ---------------------------------------------------------------------------
// Dashboard Stats
// ---------------------------------------------------------------------------

describe("getDashboardStats", () => {
  it("computes dashboard stats from parallel queries", async () => {
    // getDashboardStats calls supabase.from("proposals") six times via
    // Promise.all. We set up the mock so each call returns a distinct result.
    const callResults = [
      // 1. totalRes: count of all proposals
      { data: [{ id: "p1" }, { id: "p2" }, { id: "p3" }], error: null, count: 3 },
      // 2. pendingRes: count of review/sent
      { data: [{ id: "p2" }], error: null, count: 1 },
      // 3. acceptedRes: accepted this month with investment
      {
        data: [
          { investment: { total_cents: 500000 } },
          { investment: { total_cents: 300000 } },
        ],
        error: null,
      },
      // 4. weekRes: proposals this week
      { data: [{ id: "p3" }], error: null, count: 1 },
      // 5. lastMonthAccepted: investment from last month
      { data: [{ investment: { total_cents: 200000 } }], error: null },
      // 6. allTimeAcceptedRes: count of all accepted
      { data: [{ id: "p1" }], error: null, count: 1 },
    ];

    let callIndex = 0;
    const fromMock = vi.fn().mockImplementation(() => {
      const result = callResults[callIndex] ?? { data: null, error: null };
      callIndex++;
      return chainable(result);
    });

    const supabase = {
      from: fromMock,
    } as unknown as SupabaseClient;

    const stats = await getDashboardStats(supabase, "user-1");

    expect(stats.totalProposals).toBe(3);
    expect(stats.pendingReview).toBe(1);
    expect(stats.acceptedThisMonth).toBe(2);
    expect(stats.revenueThisMonth).toBe(800000);
    expect(stats.proposalsThisWeek).toBe(1);
    expect(stats.acceptanceRate).toBe(33); // 1/3 = 33%
    expect(stats.revenueChange).toBe(600000); // 800000 - 200000
  });

  it("returns zeros when no proposals exist", async () => {
    const fromMock = vi.fn().mockImplementation(() => {
      return chainable({ data: [], error: null, count: 0 });
    });

    const supabase = { from: fromMock } as unknown as SupabaseClient;

    const stats = await getDashboardStats(supabase, "user-1");

    expect(stats.totalProposals).toBe(0);
    expect(stats.pendingReview).toBe(0);
    expect(stats.acceptedThisMonth).toBe(0);
    expect(stats.revenueThisMonth).toBe(0);
    expect(stats.proposalsThisWeek).toBe(0);
    expect(stats.acceptanceRate).toBe(0);
    expect(stats.revenueChange).toBe(0);
  });
});
