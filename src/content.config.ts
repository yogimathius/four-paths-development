import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { PATHS, STATUSES } from "./lib/paths";

const stripMd = (entry: string) => entry.replace(/\.md$/, "");

const apps = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: "./src/content/apps",
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string(),
      path: z.enum(PATHS),
      status: z.enum(STATUSES),
      storeTracked: z.boolean().optional(),
      platforms: z.array(z.enum(["android", "ios"])).default([]),
      stores: z.object({ play: z.url().optional(), appStore: z.url().optional() }).default({}),
      icon: image().optional(),
      screenshots: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      hasAccounts: z.boolean(),
      deleteAccountUrl: z.url().optional(),
      deleteSteps: z.array(z.string()).optional(),
      order: z.number(),
      /** Three or four short feature highlights for the app page. */
      highlights: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
      /** Plain-language privacy facts for the "at a glance" panel. */
      glance: z.array(z.string()).default([]),
      audience: z.string().optional(),
      /** Show the "help us test" invitation while the app is in closed testing. */
      recruitingTesters: z.boolean().default(false),
    }),
});

const legal = defineCollection({
  loader: glob({
    pattern: "*/{privacy,support,terms}.md",
    base: "./src/content/apps",
    generateId: ({ entry }) => stripMd(entry),
  }),
  schema: z.object({
    title: z.string(),
    lastUpdated: z.coerce.date(),
    summary: z.string().optional(),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/journal" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    app: z.string().optional(),
    /** Tiebreak for same-day posts; app intros default to after studio posts, in gallery order. */
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { apps, legal, journal };
