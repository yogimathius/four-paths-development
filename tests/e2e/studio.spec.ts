import { expect, test } from "@playwright/test";

test("home introduces the studio through real work before the four lenses", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Thoughtful software");
  await expect(page.getByRole("link", { name: /Explore Pillars/ })).toHaveAttribute("href", "/work/pillars");
  const positions = await page.evaluate(() => ({
    work: document.querySelector("#featured-work")?.getBoundingClientRect().top,
    paths: document.querySelector("#four-paths")?.getBoundingClientRect().top,
  }));
  expect(positions.work).toBeLessThan(positions.paths!);
});

test("work index and case study show project state and evolution", async ({ page }) => {
  await page.goto("/work");
  await page.getByRole("link", { name: /Pillars/ }).first().click();
  await expect(page).toHaveURL(/\/work\/pillars$/);
  await expect(page.getByRole("heading", { name: "Why it exists" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How it evolved" })).toBeVisible();
  await expect(page.getByText("Early access", { exact: true }).first()).toBeVisible();
});

test("notes have individual articles and RSS entries", async ({ page, request }) => {
  await page.goto("/notes");
  await page.getByRole("link", { name: "From platform to practice" }).click();
  await expect(page).toHaveURL(/\/notes\/from-platform-to-practice$/);
  await expect(page.locator("article time")).toHaveText("October 2, 2026");
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  const feed = await request.get("/rss.xml");
  expect(await feed.text()).toContain("From platform to practice");
});

test("dark is default and an explicit light choice persists", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: /light theme/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.goto("/now");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("press kit uses the current studio positioning and visual identity", async ({ page }) => {
  await page.goto("/press");
  await expect(page.getByText(/independent product studio in Canada/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Wordmark, for light backgrounds/ })).toHaveAttribute("href", "/press/four-paths-wordmark.png");
  await expect(page.getByRole("heading", { name: "Work" })).toBeVisible();
});

test("archived Journal directs readers to the current Notes feed", async ({ page }) => {
  await page.goto("/journal");
  await expect(page.getByRole("link", { name: "Current Notes" })).toHaveAttribute("href", "/notes");
  await expect(page.getByText("RSS includes new Notes, not this archive.")).toBeVisible();
});
