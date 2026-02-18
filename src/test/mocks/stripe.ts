import { vi } from "vitest";

export function createMockStripeClient() {
  return {
    customers: {
      create: vi.fn().mockResolvedValue({ id: "cus_test123" }),
      retrieve: vi.fn().mockResolvedValue({ id: "cus_test123", email: "test@example.com" }),
    },
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ id: "cs_test123", url: "https://checkout.stripe.com/test" }),
      },
    },
    billingPortal: {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: "https://billing.stripe.com/test" }),
      },
    },
    subscriptions: {
      retrieve: vi.fn().mockResolvedValue({
        id: "sub_test123",
        status: "active",
        items: { data: [{ price: { id: "price_pro" } }] },
      }),
      update: vi.fn().mockResolvedValue({ id: "sub_test123" }),
    },
    webhooks: {
      constructEvent: vi.fn().mockReturnValue({
        type: "checkout.session.completed",
        data: { object: { customer: "cus_test123" } },
      }),
    },
  };
}

export function mockStripeModule() {
  const client = createMockStripeClient();
  vi.mock("stripe", () => ({
    default: vi.fn(() => client),
  }));
  return client;
}
