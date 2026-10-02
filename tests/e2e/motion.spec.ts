import { expect, test } from "@playwright/test";

const opacity = (sel: string) => (el: Element) => Number(getComputedStyle(el).opacity);

test("content below the fold flows in when scrolled into view", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion/);
  const paths = page.getByRole("region", { name: "Four paths", exact: true }).locator(".paths > li").first();
  await expect.poll(() => paths.evaluate(opacity("li"))).toBeLessThan(0.5);
  await paths.scrollIntoViewIfNeeded();
  await expect(paths).toHaveClass(/is-in/);
  await expect.poll(() => paths.evaluate(opacity("li"))).toBe(1);
});

test("content above the fold is revealed without scrolling", async ({ page }) => {
  await page.goto("/about");
  const h1 = page.locator("main h1");
  await expect.poll(() => h1.evaluate(opacity("h1"))).toBe(1);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing is hidden or animated", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/motion/);
    const last = page.locator("main .paths > li").last();
    expect(await last.evaluate(opacity("li"))).toBe(1);
    const animation = await page.locator(".hero .dots i").first().evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe("none");
  });
});

test("legal pages never use scroll motion", async ({ page }) => {
  await page.goto("/apps/pillars/privacy");
  await expect(page.locator("html")).not.toHaveClass(/motion/);
});

test("if the motion script fails to load, content still appears", async ({ page }) => {
  // Strip the motion module from the page so it never runs.
  await page.route("**/", async (route) => {
    const response = await route.fetch();
    const html = (await response.text()).replace(/<script type="module"[^>]*>[^<]*__fpMotion[\s\S]*?<\/script>/, "");
    await route.fulfill({ response, body: html });
  });
  await page.goto("/");
  expect(await page.evaluate(() => "__fpMotion" in window)).toBe(false);
  const last = page.locator("main .paths > li").last();
  await expect(page.locator("html")).not.toHaveClass(/motion/, { timeout: 5000 });
  expect(await last.evaluate(opacity("li"))).toBe(1);
});
