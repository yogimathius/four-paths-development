import { expect, test } from "@playwright/test";

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test("menu opens, closes with Escape, and links to a product", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main", exact: true });
    const menu = nav.getByRole("button", { name: "Menu" });
    await expect(nav.getByRole("link", { name: "Contact" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Products" })).toBeHidden();
    await menu.click();
    await expect(nav.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
    await nav.getByRole("link", { name: "Products" }).focus();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await menu.click();
    await nav.getByRole("link", { name: "Products" }).click();
    await expect(page).toHaveURL(/\/work$/);
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("navigation", { name: "Main", exact: true }).getByRole("link", { name: "Products" })).toHaveAttribute("aria-current", "page");
  });

  test("links remain accessible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
    const page = await context.newPage();
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main", exact: true });
    await expect(nav.getByRole("link", { name: "Products" })).toBeVisible();
    await nav.getByRole("link", { name: "Products" }).click();
    await expect(page).toHaveURL(/\/work$/);
    await context.close();
  });
});

test("homepage inquiry link reaches the contact instructions", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Talk about your project" }).click();
  await expect(page).toHaveURL(/\/client-work#start$/);
  await expect(page.getByRole("heading", { name: "A short email is enough." })).toBeInViewport();
});
