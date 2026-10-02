import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/apps",
  "/apps/chore-credits",
  "/apps/clearledger",
  "/apps/chore-credits/privacy",
  "/apps/life-atlas/delete-account",
  "/journal",
  "/journal/introducing-pillars",
  "/press",
  "/about",
  "/privacy",
  "/no-such-page",
];

for (const width of [1280, 1600, 390]) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const url of pages) {
      test(`${url}: heading starts on the same edge as the site header`, async ({ page }) => {
        await page.goto(url);
        const header = await page.locator("body > header a, body > div ~ header a").first().boundingBox();
        // The first thing in the page header (an eyebrow, icon, or the h1 itself).
        const first = await page.locator("main :is(.page-head, .hero) > :first-child").first().boundingBox();
        const left = first!.x;
        expect(Math.abs(left - header!.x)).toBeLessThanOrEqual(1);
      });
    }

    if (width >= 1280) {
      // The 404 page is a single short message; it has nothing wide to lay out.
      for (const url of pages.filter((u) => u !== "/no-such-page")) {
        test(`${url}: content spans the shared container`, async ({ page }) => {
          await page.goto(url);
          const right = await page.evaluate(() => {
            const nav = document.querySelector("body > header, body > div ~ header")!.getBoundingClientRect();
            const blocks = [...document.querySelectorAll("main .page-head ~ *, main section, main .split")];
            const maxRight = Math.max(...blocks.map((b) => b.getBoundingClientRect().right));
            return { nav: nav.right, content: maxRight };
          });
          // Every page should use the full container width (a rail or grid reaching the right edge).
          expect(Math.abs(right.content - right.nav)).toBeLessThanOrEqual(50);
        });
      }
    }
  });
}
