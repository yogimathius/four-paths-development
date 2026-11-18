import { expect, test } from "@playwright/test";

test("home introduces the studio through real work before the four lenses", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Thoughtful software");
  await expect(page.getByRole("link", { name: /Explore Sadhana/ })).toHaveAttribute("href", "/work/pillars");
  await expect(page.getByRole("link", { name: "Get early access on Android" })).toHaveAttribute("href", "https://play.google.com/apps/testing/com.pillars.mobile");
  await expect(page.getByRole("img", { name: "Sadhana portal artwork" })).toBeVisible();
  const positions = await page.evaluate(() => ({
    work: document.querySelector("#featured-work")?.getBoundingClientRect().top,
    paths: document.querySelector("#four-paths")?.getBoundingClientRect().top,
  }));
  expect(positions.work).toBeLessThan(positions.paths!);
});

test("work index and case study show project state and evolution", async ({ page }) => {
  await page.goto("/work");
  await page.getByRole("link", { name: /Sadhana/ }).first().click();
  await expect(page).toHaveURL(/\/work\/pillars$/);
  await expect(page.getByRole("heading", { name: "Why it exists" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How it evolved" })).toBeVisible();
  await expect(page.getByText("Early access", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("img", { name: "Sadhana portal artwork" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Join the Android open test" })).toHaveAttribute("href", "https://play.google.com/apps/testing/com.pillars.mobile");
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

test("Sadhana links to its own website from home, its case study and its app page", async ({ page }) => {
  for (const url of ["/", "/work/pillars", "/apps/pillars"]) {
    await page.goto(url);
    await expect(page.locator('a[href="https://sadhanawithin.com"]').first(), url).toBeVisible();
  }
});

test("client work lists both projects and links to each live site", async ({ page }) => {
  await page.goto("/client-work");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Sites that people");
  await expect(page.getByRole("link", { name: /Visit allmountain\.ca/ })).toHaveAttribute("href", "https://allmountain.ca");
  await expect(page.getByRole("link", { name: /Visit crabapplecafe\.ca/ })).toHaveAttribute("href", "https://crabapplecafe.ca");
  await expect(page.getByRole("link", { name: /Start a conversation/ })).toHaveAttribute("href", /^mailto:hello@fourpaths\.ca\?subject=Project%20inquiry/);
});

test("client case studies tell the story and cite their sources", async ({ page }) => {
  await page.goto("/client-work/all-mountain-contracting");
  await expect(page.getByRole("heading", { name: "What it needed" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What the team can do now" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Early search signal" })).toBeVisible();
  await expect(page.getByText("Google Search Console")).toBeVisible();
  await expect(page.getByRole("img", { name: /All Mountain Contracting home page/ }).first()).toBeVisible();
  await page.goto("/client-work/crabapple-cafe");
  await expect(page.getByRole("heading", { name: "What we built" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Early search signal" })).toHaveCount(0);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
});

test("home and nav lead to client work", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Client work" })).toHaveAttribute("href", "/client-work");
  await expect(page.locator("#client-work").getByRole("link", { name: /All Mountain Contracting/ }).first()).toHaveAttribute("href", "/client-work/all-mountain-contracting");
});

test("Forge 5x5 is out of the listings but its store-facing pages still work", async ({ page, request }) => {
  for (const url of ["/", "/work", "/apps", "/now", "/notes"]) {
    await page.goto(url);
    expect(await page.locator("main").innerText(), url).not.toContain("Forge");
  }
  expect((await request.get("/work/forge-5x5")).status()).toBe(404);
  for (const doc of ["privacy", "support"]) expect((await request.get(`/apps/forge-5x5/${doc}`)).status()).toBe(200);
  await page.goto("/apps/forge-5x5");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  await expect(page.getByText("Forge 5x5 is paused")).toBeVisible();
  expect(await (await request.get("/sitemap-0.xml")).text()).not.toContain("/apps/forge-5x5<");
  expect((await request.get("/journal/introducing-forge-5x5")).status()).toBe(404);
});

test("the Sadhana rename note is published and points to the new site", async ({ page, request }) => {
  await page.goto("/notes/pillars-is-now-sadhana");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pillars is now Sadhana");
  await expect(page.getByRole("link", { name: "sadhanawithin.com" })).toHaveAttribute("href", "https://sadhanawithin.com");
  expect(await (await request.get("/rss.xml")).text()).toContain("Pillars is now Sadhana");
});
