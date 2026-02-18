import { test, expect } from "@playwright/test";

test.describe("Proposal Editor", () => {
  test("proposal preview page exists", async ({ page }) => {
    const response = await page.goto("/proposals/00000000-0000-0000-0000-000000000000/preview");
    expect(response?.status()).toBeLessThan(500);
  });

  test("proposals list page exists", async ({ page }) => {
    const response = await page.goto("/proposals");
    expect(response?.status()).toBeLessThan(500);
  });

  test("settings brand page exists", async ({ page }) => {
    const response = await page.goto("/settings/brand");
    expect(response?.status()).toBeLessThan(500);
  });

  test("settings team page exists", async ({ page }) => {
    const response = await page.goto("/settings/team");
    expect(response?.status()).toBeLessThan(500);
  });

  test("error page renders gracefully", async ({ page }) => {
    // Navigate to a route that might error
    const response = await page.goto("/proposals/not-a-uuid");
    expect(response?.status()).toBeLessThan(500);
  });
});
