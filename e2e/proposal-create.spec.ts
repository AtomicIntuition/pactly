import { test, expect } from "@playwright/test";

test.describe("Proposal Creation", () => {
  test("new proposal page exists", async ({ page }) => {
    const response = await page.goto("/proposals/new");
    // Should either load or redirect to login
    expect(response?.status()).toBeLessThan(500);
  });

  test("404 page renders correctly", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page.getByText("Page not found")).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
  });

  test("proposal editor page exists for valid UUID format", async ({ page }) => {
    const response = await page.goto("/proposals/00000000-0000-0000-0000-000000000000");
    // Should redirect to login or show not found (not crash)
    expect(response?.status()).toBeLessThan(500);
  });

  test("share page handles invalid token gracefully", async ({ page }) => {
    const response = await page.goto("/share/invalid-token");
    expect(response?.status()).toBeLessThan(500);
  });
});
