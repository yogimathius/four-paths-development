import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("work index links to the existing support pages", async ({ page }) => {
  await page.goto("/work/chore-credits");
  await expect(page.getByRole("link", { name: /App details & support/ }).first()).toHaveAttribute("href", "/apps/chore-credits");
  await page.goto("/apps/chore-credits");
  await expect(page.getByRole("link", { name: "Privacy policy" })).toHaveAttribute("href", "/apps/chore-credits/privacy");
});

test("About names the builder and offers contact", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText("I’m Mathius Johnson.", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: /Email Mathius/ })).toHaveAttribute("href", "mailto:hello@fourpaths.ca");
});

test("unknown URLs get the branded 404", async ({ page }) => {
  const response = await page.goto("/no-such-path");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This path doesn't go anywhere.");
});

test("the RSS feed lists Notes", async ({ request }) => {
  const response = await request.get("/rss.xml");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain("From platform to practice");
});

const pages = ["/", "/work", "/work/pillars", "/notes", "/notes/from-platform-to-practice", "/now", "/about", "/apps/chore-credits/privacy"];
test.describe("accessibility", () => {
  test.use({ reducedMotion: "reduce" });
  for (const scheme of ["light", "dark"] as const) {
    for (const url of pages) {
      test(`${url} has no serious accessibility violations (${scheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        if (scheme === "light") await page.addInitScript(() => localStorage.setItem("theme", "light"));
        await page.goto(url);
        await page.evaluate(() => document.fonts.ready);
        const { violations } = await new AxeBuilder({ page }).analyze();
        const serious = violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
        expect(serious.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    }
  }
});
