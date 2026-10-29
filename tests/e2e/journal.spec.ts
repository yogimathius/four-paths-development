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

test("journal lists studio posts first, then app intros in gallery order", async ({ page }) => {
  await page.goto("/journal");
  const titles = await page.locator("main li h2").allInnerTexts();
  expect(titles.slice(0, 2)).toEqual(["Welcome to Four Paths", "Why Four Paths"]);
  expect(titles.slice(2).map((t) => t.split(":")[0])).toEqual([
    "Introducing Chore Credits",
    "Introducing Pillars",
    "Introducing Life Atlas",
    "Introducing Forge 5x5",
    "Introducing ClearLedger",
  ]);
});

test("Sadhana open-test invite leads to Play opt-in while unrelated apps do not invite testers", async ({ page }) => {
  await page.goto("/apps/pillars");
  await expect(page.locator("header.app-head").getByRole("link", { name: "Join the Android open test" })).toHaveAttribute(
    "href", "https://play.google.com/apps/testing/com.pillars.mobile",
  );
  const invite = page.locator("#test");
  await expect(invite).toContainText("Android open testing");
  await expect(invite).not.toContainText("closed testing");
  await expect(invite.getByRole("link", { name: "Join the Android open test" })).toHaveAttribute(
    "href", "https://play.google.com/apps/testing/com.pillars.mobile",
  );
  await page.goto("/apps/clearledger");
  await expect(page.locator("#test")).toHaveCount(0);
});

test("legal pages offer an on-this-page index that jumps to sections", async ({ page }) => {
  await page.goto("/apps/pillars/privacy");
  const toc = page.getByRole("navigation", { name: "On this page" });
  await expect(toc.getByRole("link")).not.toHaveCount(0);
  const first = toc.getByRole("link").first();
  const target = (await first.getAttribute("href"))!;
  await expect(page.locator(target)).toHaveCount(1);
});

test("home presents the four paths as lenses after the work", async ({ page }) => {
  await page.goto("/");
  const paths = page.locator("#four-paths");
  for (const name of ["Build", "Create", "Question", "Ground"]) {
    await expect(paths.getByText(name, { exact: true })).toBeVisible();
  }
  expect(await paths.evaluate((el) => el.compareDocumentPosition(document.querySelector("#featured-work")!) & Node.DOCUMENT_POSITION_PRECEDING)).toBeTruthy();
});

test("app pages show their path's yoga and aim", async ({ page }) => {
  await page.goto("/apps/clearledger");
  await expect(page.getByText("(Karma · Artha)")).toBeVisible();
});

test("About explains the overlapping practice in first person", async ({ page }) => {
  await page.goto("/about");
  const text = await page.locator("main").innerText();
  for (const phrase of ["I’m Mathius Johnson", "Build, Create, Question and Ground", "Sadhana asks"]) {
    expect(text).toContain(phrase);
  }
});
