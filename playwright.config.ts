import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:4329" },
  webServer: {
    command: "pnpm astro preview --port 4329 --ignore-lock",
    url: "http://localhost:4329",
    reuseExistingServer: !process.env.CI,
  },
});
