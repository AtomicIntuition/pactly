import { test, expect } from "@playwright/test";

test.describe("PDF Export", () => {
  test("PDF API endpoint exists", async ({ page }) => {
    const response = await page.request.get("/api/proposals/00000000-0000-0000-0000-000000000000/pdf");
    // Should return 401 (unauthorized) or 404 (not found), not 500
    expect(response.status()).toBeLessThan(500);
  });

  test("PDF endpoint requires valid proposal ID", async ({ page }) => {
    const response = await page.request.get("/api/proposals/invalid-id/pdf");
    expect(response.status()).toBeLessThan(500);
  });
});
