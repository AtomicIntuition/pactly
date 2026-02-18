import { vi } from "vitest";

interface MockQueryResult {
  data: unknown;
  error: null | { message: string };
  count?: number;
}

function createChainableQuery(result: MockQueryResult = { data: null, error: null }) {
  const chain: Record<string, unknown> = {};
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

  // Terminal methods return the result
  chain.single = vi.fn().mockResolvedValue(result);
  chain.maybeSingle = vi.fn().mockResolvedValue(result);
  chain.then = vi.fn((resolve: (v: MockQueryResult) => void) => resolve(result));

  // Make the chain itself thenable
  Object.defineProperty(chain, "then", {
    value: (resolve: (v: MockQueryResult) => void) => Promise.resolve(result).then(resolve),
    enumerable: false,
  });

  return chain;
}

export function createMockSupabaseClient(overrides: Record<string, MockQueryResult> = {}) {
  const defaultResult: MockQueryResult = { data: null, error: null };

  return {
    from: vi.fn((table: string) => {
      const result = overrides[table] ?? defaultResult;
      return createChainableQuery(result);
    }),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-1", email: "test@example.com", user_metadata: { full_name: "Test User" } } },
        error: null,
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: "token" } },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
    },
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: { path: "logos/test.png" }, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "https://example.com/logo.png" } }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    },
  };
}

// Mock the server/client creation
export function mockSupabaseModule() {
  const client = createMockSupabaseClient();
  vi.mock("@/lib/supabase/server", () => ({
    createClient: vi.fn().mockResolvedValue(client),
  }));
  vi.mock("@/lib/supabase/client", () => ({
    createClient: vi.fn(() => client),
  }));
  vi.mock("@/lib/supabase/admin", () => ({
    createAdminClient: vi.fn(() => client),
  }));
  return client;
}
