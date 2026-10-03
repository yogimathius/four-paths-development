// Renders the press-kit wordmark PNGs from the current route-mark identity.
// Run after changing the wordmark: node scripts/render-wordmark.mjs
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";

const font = readFileSync(
  new URL("../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", import.meta.url),
).toString("base64");

const html = (ink) => `<!doctype html><style>
@font-face { font-family: Inter; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 100 900; }
body { margin: 0; background: transparent; }
#m { display: inline-flex; align-items: center; gap: 0.5em; padding: 0.35em 0.5em; font: 650 120px/1 Inter; letter-spacing: -0.045em; color: ${ink}; white-space: nowrap; }
#m svg { width: 1.25em; height: 1.25em; color: ${ink}; flex: none; }
</style><div id="m"><svg viewBox="0 0 46 60" fill="none" aria-hidden="true"><path d="M4 30c9 0 12-19 22-19m-22 19c9 0 12 19 22 19M26 11c7 0 9 8 16 8M26 49c7 0 9-8 16-8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="4" cy="30" r="2" fill="currentColor"/></svg><span>Four Paths</span></div>`;

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [file, ink] of [["four-paths-wordmark.png", "#161a18"], ["four-paths-wordmark-light.png", "#f1efe7"]]) {
  await page.setContent(html(ink));
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#m").screenshot({ path: `public/press/${file}`, omitBackground: true });
  console.log(`wrote public/press/${file}`);
}
await browser.close();
