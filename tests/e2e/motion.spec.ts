import { expect, test } from "@playwright/test";

test("content is available without animation or scrolling", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Four paths/ })).toBeVisible();
  await expect(page.locator("#four-paths")).toHaveCSS("opacity", "1");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("scrolling is not animated", async ({ page }) => {
    await page.goto("/");
    const behavior = await page.locator("html").evaluate((el) => getComputedStyle(el).scrollBehavior);
    expect(behavior).toBe("auto");
  });
});

test("legal pages remain readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/apps/pillars/privacy");
  await expect(page.getByRole("heading", { name: "Privacy policy" })).toBeVisible();
  await context.close();
});
