import { expect, test } from "@playwright/test";

test("home introduces the studio through real work before the four lenses", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Thoughtful software");
  await expect(page.locator("#featured-work").getByRole("link", { name: "Explore Sadhana" })).toHaveAttribute("href", "/work/sadhana");
  await expect(page.getByRole("link", { name: "Get it on Google Play" })).toHaveAttribute("href", "https://play.google.com/store/apps/details?id=com.pillars.mobile");
  await expect(page.getByRole("img", { name: "The Sadhana mark: a golden flame above a copper oil lamp" })).toBeVisible();
  const positions = await page.evaluate(() => ({
    work: document.querySelector("#featured-work")?.getBoundingClientRect().top,
    paths: document.querySelector("#four-paths")?.getBoundingClientRect().top,
  }));
  expect(positions.work).toBeLessThan(positions.paths!);
});

test("work index and case study show project state and evolution", async ({ page }) => {
  await page.goto("/work");
  await page.getByRole("link", { name: /Sadhana/ }).first().click();
  await expect(page).toHaveURL(/\/work\/sadhana$/);
  await expect(page.getByRole("heading", { name: "Why it exists" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How it evolved" })).toBeVisible();
  await expect(page.getByText("Live on Google Play", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("img", { name: "The Sadhana mark: a golden flame above a copper oil lamp" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Get it on Google Play" })).toHaveAttribute("href", "https://play.google.com/store/apps/details?id=com.pillars.mobile");
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
  for (const url of ["/", "/work/sadhana", "/apps/sadhana"]) {
    await page.goto(url);
    await expect(page.locator('a[href="https://sadhanawithin.com"]').first(), url).toBeVisible();
  }
});

test("client work lists both projects and links to each live site", async ({ page }) => {
  await page.goto("/client-work");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Sites that people");
  await expect(page.getByRole("link", { name: /Visit allmountain\.ca/ })).toHaveAttribute("href", "https://allmountain.ca");
  await expect(page.getByRole("link", { name: /Visit crabapplecafe\.ca/ })).toHaveAttribute("href", "https://crabapplecafe.ca");
  await expect(page.getByRole("link", { name: /Start a conversation/ })).toHaveAttribute("href", /^mailto:info@fourpaths\.ca\?subject=Project%20inquiry/);
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

test("About explains that products lead and client collaboration is genuine", async ({ page }) => {
  await page.goto("/about");
  const text = await page.locator("main").innerText();
  expect(text).toContain("first a product studio");
  expect(text).toContain("client collaborations");
  expect(text).not.toContain("consultancy disguised");
});

test("home puts the client-work invitation straight after the hero", async ({ page }) => {
  await page.goto("/");
  const invite = page.locator("#work-with-us");
  await expect(invite).toContainText("partners with thoughtful organizations");
  await expect(invite.getByRole("link", { name: "Talk about your project" })).toHaveAttribute("href", "/client-work#start");
  const order = await page.evaluate(() => {
    const top = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().top;
    return { invite: top("#work-with-us"), featured: top("#featured-work") };
  });
  expect(order.invite).toBeLessThan(order.featured);
});

test("Contact stays visible in the mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Contact" })).toBeVisible();
});

test("client work names who it is for and how to begin, with a copyable address", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/client-work");
  await expect(page.getByText("wellbeing, education, creativity, community and contemplative practice")).toBeVisible();
  await expect(page.getByRole("heading", { name: "A short email is enough." })).toBeVisible();
  await page.getByRole("button", { name: "Copy address" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("info@fourpaths.ca");
});

test("project statuses say whether each is live or which kind of Android testing it is in", async ({ page }) => {
  await page.goto("/work");
  const text = (await page.locator("main").innerText()).toLowerCase();
  expect(text).toContain("live on google play");
  expect(text).not.toContain("android open testing");
  expect(text).toContain("android closed testing");
  expect(text).not.toContain("early access");
  expect(text).not.toMatch(/\bI (built|am)\b/);
});

test("case studies lead with a short version and qualify their evidence", async ({ page }) => {
  await page.goto("/client-work/all-mountain-contracting");
  await expect(page.getByText("The short version")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Before and after" })).toBeVisible();
  await expect(page.getByText("do not prove that the rebuild alone caused them")).toBeVisible();
  await page.goto("/client-work/crabapple-cafe");
  await expect(page.getByText("The short version")).toBeVisible();
});
