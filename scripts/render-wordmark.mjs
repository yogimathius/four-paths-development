// Renders the press-kit wordmark PNGs with the real Bricolage Grotesque font.
// Run after changing the wordmark: node scripts/render-wordmark.mjs
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";

const font = readFileSync(
  new URL("../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2", import.meta.url),
).toString("base64");

const html = (ink) => `<!doctype html><style>
@font-face { font-family: B; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 200 800; }
body { margin: 0; background: transparent; }
#m { display: inline-flex; align-items: center; gap: 0.45em; padding: 0.35em 0.5em; font: 800 120px/1 B; letter-spacing: -0.04em; color: ${ink}; }
.d { display: grid; grid-template-columns: repeat(2, 0.42em); gap: 0.1em; }
.d i { width: 0.42em; height: 0.42em; border-radius: 50%; }
</style><div id="m"><span class="d">
<i style="background:linear-gradient(135deg,#ffb5c9,#ffd6a5)"></i><i style="background:linear-gradient(135deg,#b5ead7,#c7f0ff)"></i>
<i style="background:linear-gradient(135deg,#cdb4ff,#ffc8dd)"></i><i style="background:linear-gradient(135deg,#ffe8a3,#b5ead7)"></i>
</span><span>four paths</span></div>`;

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [file, ink] of [["four-paths-wordmark.png", "#1f1b2e"], ["four-paths-wordmark-light.png", "#ffffff"]]) {
  await page.setContent(html(ink));
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#m").screenshot({ path: `public/press/${file}`, omitBackground: true });
  console.log(`wrote public/press/${file}`);
}
await browser.close();
