import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  // These tests require authentication setup
  // In a real CI, you'd seed a test user and login before each test

  test("dashboard page exists", async ({ page }) => {
    const response = await page.goto("/dashboard");
    // Should either load or redirect to login
    expect(response?.status()).toBeLessThan(500);
  });

  test("proposals page exists", async ({ page }) => {
    const response = await page.goto("/proposals");
    expect(response?.status()).toBeLessThan(500);
  });

  test("clients page exists", async ({ page }) => {
    const response = await page.goto("/clients");
    expect(response?.status()).toBeLessThan(500);
  });
});
