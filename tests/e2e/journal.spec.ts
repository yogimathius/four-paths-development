import { expect, test } from "@playwright/test";

const apps = ["chore-credits", "pillars", "life-atlas", "forge-5x5", "clearledger"];

for (const slug of apps) {
  test(`${slug} has an introduction post linked both ways`, async ({ page }) => {
    await page.goto(`/apps/${slug}`);
    const link = page.getByRole("link", { name: /^Read the introduction:/ });
    await expect(link).toHaveAttribute("href", `/journal/introducing-${slug}`);
    await link.click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Introducing");
    // The post's side panel links back to the app.
    await expect(page.locator("aside").getByRole("link", { name: /./ }).first()).toHaveAttribute("href", `/apps/${slug}`);
  });
}

test("journal lists the welcome post first, then app intros in gallery order", async ({ page }) => {
  await page.goto("/journal");
  const titles = await page.locator("main li h2").allInnerTexts();
  expect(titles[0]).toBe("Welcome to Four Paths");
  expect(titles.slice(1).map((t) => t.split(":")[0])).toEqual([
    "Introducing Chore Credits",
    "Introducing Pillars",
    "Introducing Life Atlas",
    "Introducing Forge 5x5",
    "Introducing ClearLedger",
  ]);
});

test("tester invites appear only for apps recruiting testers", async ({ page }) => {
  await page.goto("/apps/pillars");
  await expect(page.getByRole("link", { name: "Ask to join the test" })).toHaveAttribute(
    "href",
    /^mailto:hello@fourpaths\.ca\?subject=I%E2%80%99d%20like%20to%20test%20Pillars/,
  );
  await page.goto("/apps/clearledger");
  await expect(page.getByRole("link", { name: "Ask to join the test" })).toHaveCount(0);
});

test("legal pages offer an on-this-page index that jumps to sections", async ({ page }) => {
  await page.goto("/apps/pillars/privacy");
  const toc = page.getByRole("navigation", { name: "On this page" });
  await expect(toc.getByRole("link")).not.toHaveCount(0);
  const first = toc.getByRole("link").first();
  const target = (await first.getAttribute("href"))!;
  await expect(page.locator(target)).toHaveCount(1);
});
