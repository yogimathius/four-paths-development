import { getCollection, type CollectionEntry } from "astro:content";
import { catalogProblems } from "./integrity";

export type AppEntry = CollectionEntry<"apps">;
export type LegalEntry = CollectionEntry<"legal">;
export type LegalDoc = "privacy" | "support" | "terms";

let cached: Promise<{ apps: AppEntry[]; legal: LegalEntry[] }> | undefined;

/** Loads apps + legal docs once per build and fails the build if the catalog is incomplete. */
export function loadCatalog() {
  cached ??= (async () => {
    const apps = (await getCollection("apps")).sort((a, b) => a.data.order - b.data.order);
    const legal = await getCollection("legal");
    const problems = catalogProblems(
      apps.map((a) => ({ slug: a.id, ...a.data })),
      legal.map((l) => l.id),
    );
    if (problems.length) throw new Error(`App catalog is incomplete:\n- ${problems.join("\n- ")}`);
    return { apps, legal };
  })();
  return cached;
}

export async function listedApps() {
  return (await loadCatalog()).apps.filter((a) => a.data.status !== "hidden");
}

export async function legalDoc(slug: string, doc: LegalDoc) {
  return (await loadCatalog()).legal.find((l) => l.id === `${slug}/${doc}`);
}
