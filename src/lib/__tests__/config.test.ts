import { describe, it, expect, beforeEach, vi } from "vitest";

describe("config", () => {
  beforeEach(() => {
    vi.resetModules();
    // Clear all relevant env vars before each test
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_PRO_PRICE_ID;
    delete process.env.STRIPE_AGENCY_PRICE_ID;
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_APP_URL;
  });

  describe("serverEnv", () => {
    it("throws when missing required keys", async () => {
      const { serverEnv } = await import("@/lib/config");
      expect(() => serverEnv()).toThrow("Invalid server environment variables");
    });

    it("throws when SUPABASE_SERVICE_ROLE_KEY is missing", async () => {
      process.env.ANTHROPIC_API_KEY = "sk-ant-test";
      process.env.STRIPE_SECRET_KEY = "sk_test_123";
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const { serverEnv } = await import("@/lib/config");
      expect(() => serverEnv()).toThrow("Invalid server environment variables");
    });

    it("throws when ANTHROPIC_API_KEY is missing", async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = "sbp_test";
      process.env.STRIPE_SECRET_KEY = "sk_test_123";
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const { serverEnv } = await import("@/lib/config");
      expect(() => serverEnv()).toThrow("Invalid server environment variables");
    });

    it("throws when STRIPE_SECRET_KEY is missing", async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = "sbp_test";
      process.env.ANTHROPIC_API_KEY = "sk-ant-test";
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const { serverEnv } = await import("@/lib/config");
      expect(() => serverEnv()).toThrow("Invalid server environment variables");
    });

    it("throws when STRIPE_WEBHOOK_SECRET is missing", async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = "sbp_test";
      process.env.ANTHROPIC_API_KEY = "sk-ant-test";
      process.env.STRIPE_SECRET_KEY = "sk_test_123";

      const { serverEnv } = await import("@/lib/config");
      expect(() => serverEnv()).toThrow("Invalid server environment variables");
    });

    it("returns valid config when all required keys are present", async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = "sbp_test";
      process.env.ANTHROPIC_API_KEY = "sk-ant-test";
      process.env.STRIPE_SECRET_KEY = "sk_test_123";
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const { serverEnv } = await import("@/lib/config");
      const env = serverEnv();

      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe("sbp_test");
      expect(env.ANTHROPIC_API_KEY).toBe("sk-ant-test");
      expect(env.STRIPE_SECRET_KEY).toBe("sk_test_123");
      expect(env.STRIPE_WEBHOOK_SECRET).toBe("whsec_test");
    });

    it("EMAIL_FROM has correct default value", async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = "sbp_test";
      process.env.ANTHROPIC_API_KEY = "sk-ant-test";
      process.env.STRIPE_SECRET_KEY = "sk_test_123";
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const { serverEnv } = await import("@/lib/config");
      const env = serverEnv();

      expect(env.EMAIL_FROM).toBe("Overture <noreply@useoverture.com>");
    });

    it("optional fields default to empty string", async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = "sbp_test";
      process.env.ANTHROPIC_API_KEY = "sk-ant-test";
      process.env.STRIPE_SECRET_KEY = "sk_test_123";
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

      const { serverEnv } = await import("@/lib/config");
      const env = serverEnv();

      expect(env.STRIPE_PRO_PRICE_ID).toBe("");
      expect(env.STRIPE_AGENCY_PRICE_ID).toBe("");
      expect(env.RESEND_API_KEY).toBe("");
    });
  });

  describe("clientEnv", () => {
    it("throws when missing required keys", async () => {
      const { clientEnv } = await import("@/lib/config");
      expect(() => clientEnv()).toThrow("Invalid client environment variables");
    });

    it("throws when NEXT_PUBLIC_SUPABASE_URL is not a valid URL", async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "not-a-url";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon_key_test";
      process.env.NEXT_PUBLIC_APP_URL = "https://app.example.com";

      const { clientEnv } = await import("@/lib/config");
      expect(() => clientEnv()).toThrow("Invalid client environment variables");
    });

    it("throws when NEXT_PUBLIC_APP_URL is not a valid URL", async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://supabase.example.com";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon_key_test";
      process.env.NEXT_PUBLIC_APP_URL = "not-a-url";

      const { clientEnv } = await import("@/lib/config");
      expect(() => clientEnv()).toThrow("Invalid client environment variables");
    });

    it("throws when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing", async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://supabase.example.com";
      process.env.NEXT_PUBLIC_APP_URL = "https://app.example.com";

      const { clientEnv } = await import("@/lib/config");
      expect(() => clientEnv()).toThrow("Invalid client environment variables");
    });

    it("returns valid config when all required keys are present", async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://supabase.example.com";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon_key_test";
      process.env.NEXT_PUBLIC_APP_URL = "https://app.example.com";

      const { clientEnv } = await import("@/lib/config");
      const env = clientEnv();

      expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://supabase.example.com");
      expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe("anon_key_test");
      expect(env.NEXT_PUBLIC_APP_URL).toBe("https://app.example.com");
    });

    it("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY defaults to empty string", async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://supabase.example.com";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon_key_test";
      process.env.NEXT_PUBLIC_APP_URL = "https://app.example.com";

      const { clientEnv } = await import("@/lib/config");
      const env = clientEnv();

      expect(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).toBe("");
    });
  });
});
