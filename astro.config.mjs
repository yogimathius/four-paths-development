// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import { remarkSiteTokens } from "./src/lib/site-tokens.ts";

export default defineConfig({
  site: "https://fourpaths.ca",
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  // Paused apps keep their store-facing legal pages, but their app page stays out of search.
  integrations: [sitemap({ filter: (page) => !page.endsWith("/apps/forge-5x5") })],
  markdown: { processor: unified({ remarkPlugins: [remarkSiteTokens] }) },
});
