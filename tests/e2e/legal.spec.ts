import { expect, test } from "@playwright/test";

// Apps on a store track: their URLs can be pasted into Play Console / App Store Connect.
const storeApps = [
  { slug: "chore-credits", name: "Chore Credits" },
  { slug: "pillars", name: "Pillars" },
  { slug: "life-atlas", name: "Life Atlas" },
  { slug: "forge-5x5", name: "Forge 5x5" },
];

for (const app of storeApps) {
  test.describe(app.name, () => {
    test.use({ javaScriptEnabled: false }); // store reviewers' crawlers may not run JS

    test("privacy policy is public, names the operator, and has a working contact", async ({ page }) => {
      const res = await page.goto(`/apps/${app.slug}/privacy`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy policy");
      await expect(page.getByText("Operated by Four Paths").first()).toBeVisible();
      await expect(page.locator('a[href^="mailto:privacy@fourpaths.ca"]').first()).toBeVisible();
      await expect(page.getByText("The short version:")).toBeVisible();
      await expect(page).toHaveTitle(`${app.name} privacy policy · Four Paths`);
    });

    test("support and delete-account pages exist", async ({ page }) => {
      for (const doc of ["support", "delete-account"]) {
        const res = await page.goto(`/apps/${app.slug}/${doc}`);
        expect(res?.status(), doc).toBe(200);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      }
    });
  });
}

test("Chore Credits policy says birth month and year, never birthdate", async ({ page }) => {
  await page.goto("/apps/chore-credits/privacy");
  const text = await page.locator("article").innerText();
  expect(text).toContain("birth month and year");
  expect(text.toLowerCase()).not.toContain("birthdate");
});

test("Pillars deletion page links to the Pillars service's own deletion flow", async ({ page }) => {
  await page.goto("/apps/pillars/delete-account");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Delete your account");
  await expect(page.locator('a[href="https://pillars.fly.dev/delete-account"]')).toBeVisible();
});

test("Life Atlas deletion page lists the in-app steps and an email fallback", async ({ page }) => {
  await page.goto("/apps/life-atlas/delete-account");
  await expect(page.getByRole("listitem").filter({ hasText: "Delete account and data" })).toBeVisible();
  const mail = page.getByRole("link", { name: "Email a deletion request" });
  await expect(mail).toHaveAttribute("href", /^mailto:privacy@fourpaths\.ca\?subject=Life%20Atlas%20account%20deletion%20request/);
});

test("local-only apps explain there is no server copy to delete", async ({ page }) => {
  await page.goto("/apps/chore-credits/delete-account");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Delete your data");
  await expect(page.getByText("has no copy on a server")).toBeVisible();
});

test("a coming-soon app has an app page but no legal pages yet", async ({ page }) => {
  await page.goto("/apps/clearledger");
  await expect(page.getByText("will be published here before ClearLedger reaches a store")).toBeVisible();
  const res = await page.goto("/apps/clearledger/privacy");
  expect(res?.status()).toBe(404);
});

test("no page mentions the personal domain", async ({ page }) => {
  for (const url of ["/", "/about", "/press", "/apps/pillars/privacy", "/apps/life-atlas/privacy"]) {
    await page.goto(url);
    expect(await page.content(), url).not.toContain("yogimathius");
  }
});
