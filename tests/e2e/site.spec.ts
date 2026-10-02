import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home shows every listed app and links to its page", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Chore Credits", "Pillars", "Life Atlas", "Forge 5x5", "ClearLedger"]) {
    await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
  }
  await page.getByRole("link", { name: "Chore Credits", exact: true }).click();
  await expect(page).toHaveURL(/\/apps\/chore-credits$/);
  await expect(page.getByRole("link", { name: "Privacy policy" })).toHaveAttribute("href", "/apps/chore-credits/privacy");
});

test("about page names the founder once", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText("founded by Mathius Johnson")).toHaveCount(1);
});

test("theme toggle switches to dark and persists across pages", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.goto("/apps");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("unknown URLs get the branded 404", async ({ page }) => {
  const res = await page.goto("/no-such-path");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This path doesn't go anywhere.");
});

test("the RSS feed lists the welcome post", async ({ request }) => {
  const res = await request.get("/rss.xml");
  expect(res.ok()).toBe(true);
  expect(await res.text()).toContain("Welcome to Four Paths");
});

const pages = ["/", "/apps/chore-credits", "/apps/chore-credits/privacy", "/apps/life-atlas/delete-account", "/press"];

for (const scheme of ["light", "dark"] as const) {
  for (const url of pages) {
    test(`${url} has no serious accessibility violations (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(url);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
}

test.describe("phone width", () => {
  test.use({ viewport: { width: 360, height: 780 } });
  for (const url of ["/", "/apps/forge-5x5", "/apps/pillars/privacy", "/press"]) {
    test(`${url} has no horizontal scroll`, async ({ page }) => {
      await page.goto(url);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
