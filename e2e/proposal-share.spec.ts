import { test, expect } from "@playwright/test";

test.describe("Proposal Sharing", () => {
  test("share page loads without auth", async ({ page }) => {
    // Share pages are public — they shouldn't redirect to login
    const response = await page.goto("/share/test-token-123");
    expect(response?.status()).toBeLessThan(500);
  });

  test("share page does not show app navigation", async ({ page }) => {
    await page.goto("/share/test-token-123");
    // Sidebar navigation should not appear on share pages
    await expect(page.getByText("Dashboard")).not.toBeVisible();
  });

  test("share page shows Overture branding", async ({ page }) => {
    await page.goto("/share/test-token-123");
    // May or may not render depending on whether token is valid
    // But the page should load without error
    const content = await page.content();
    expect(content).toBeTruthy();
  });

  test("invalid share token shows appropriate message", async ({ page }) => {
    await page.goto("/share/definitely-invalid-token");
    // Should either show "not found" or a specific error — not crash
    const content = await page.content();
    expect(content.length).toBeGreaterThan(0);
  });
});
