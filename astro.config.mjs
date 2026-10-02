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
  integrations: [sitemap()],
  markdown: { processor: unified({ remarkPlugins: [remarkSiteTokens] }) },
});
