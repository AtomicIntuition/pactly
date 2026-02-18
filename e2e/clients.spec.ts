import { test, expect } from "@playwright/test";

test.describe("Clients", () => {
  test("clients page exists", async ({ page }) => {
    const response = await page.goto("/clients");
    expect(response?.status()).toBeLessThan(500);
  });

  test("client detail page handles invalid ID", async ({ page }) => {
    const response = await page.goto("/clients/00000000-0000-0000-0000-000000000000");
    expect(response?.status()).toBeLessThan(500);
  });

  test("settings page exists", async ({ page }) => {
    const response = await page.goto("/settings");
    expect(response?.status()).toBeLessThan(500);
  });
});
