import { getCollection, type CollectionEntry } from "astro:content";
import { loadCatalog } from "./catalog";

export type Post = CollectionEntry<"journal">;

/** Published posts, newest first. Same-day posts: studio posts first, then app intros in gallery order. */
export async function publishedPosts(): Promise<Post[]> {
  const { apps } = await loadCatalog();
  const order = new Map(apps.map((a) => [a.id, a.data.order]));
  const posts = await getCollection("journal", (p) => !p.data.draft);
  for (const p of posts) {
    if (p.data.app && !order.has(p.data.app)) throw new Error(`Journal post ${p.id} names unknown app "${p.data.app}"`);
  }
  const rank = (p: Post) => p.data.order ?? (p.data.app ? 10 + (order.get(p.data.app) ?? 89) : 0);
  return posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || rank(a) - rank(b),
  );
}

export async function introFor(slug: string): Promise<Post | undefined> {
  return (await publishedPosts()).find((p) => p.data.app === slug);
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
