import { test, expect } from "@playwright/test";

test.describe("Marketing Pages", () => {
  test("landing page renders hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("sixty seconds");
    await expect(page.getByText("Get Started Free").first()).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Pricing" }).first().click();
    await expect(page).toHaveURL("/pricing");
    await expect(page.getByText("Simple, transparent pricing")).toBeVisible();
  });

  test("pricing page shows all plans", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText("Free")).toBeVisible();
    await expect(page.getByText("Pro")).toBeVisible();
    await expect(page.getByText("Agency")).toBeVisible();
    await expect(page.getByText("Most Popular")).toBeVisible();
  });
});
