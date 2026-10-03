import { expect, test } from "@playwright/test";

const pages = ["/", "/work", "/work/pillars", "/notes", "/notes/from-platform-to-practice", "/now", "/about", "/apps/chore-credits/privacy"];

for (const width of [360, 390, 1280, 1600]) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    for (const url of pages) {
      test(`${url}: content stays within the viewport`, async ({ page }) => {
        await page.goto(url);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}
