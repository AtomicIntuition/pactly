import { test, expect } from "@playwright/test";

test.describe("Stripe & Billing", () => {
  test("settings billing page exists", async ({ page }) => {
    const response = await page.goto("/settings/billing");
    // Should redirect to login if unauthenticated, not crash
    expect(response?.status()).toBeLessThan(500);
  });

  test("pricing page CTA links to signup", async ({ page }) => {
    await page.goto("/pricing");
    const links = await page.getByRole("link", { name: /get started|start with/i }).all();
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      await expect(link).toHaveAttribute("href", "/signup");
    }
  });

  test("stripe webhook endpoint exists", async ({ page }) => {
    const response = await page.request.post("/api/webhooks/stripe", {
      data: "{}",
      headers: { "Content-Type": "application/json" },
    });
    // Should return 400 (bad request) not 404 (not found)
    expect(response.status()).not.toBe(404);
  });
});
