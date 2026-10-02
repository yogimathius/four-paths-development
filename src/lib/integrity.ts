import type { Status } from "./paths";

export interface CatalogApp {
  slug: string;
  status: Status;
  hasAccounts: boolean;
  deleteAccountUrl?: string;
  /** In-app steps to delete an account, for apps whose backend has no public deletion page. */
  deleteSteps?: string[];
  /** Set on hidden apps whose legal URLs are still referenced by a store listing. */
  storeTracked?: boolean;
}

const REQUIRED_DOCS = ["privacy", "support"] as const;

/** True when the app's legal pages may be linked from a store listing. */
export function needsLegalPages(app: CatalogApp): boolean {
  return app.status === "live" || app.status === "testing" || app.storeTracked === true;
}

/**
 * Returns human-readable problems with the app catalog. An empty array means
 * every store-facing app has the pages a store listing can point at.
 * `legalIds` are "<slug>/<doc>" identifiers, e.g. "chore-credits/privacy".
 */
export function catalogProblems(apps: CatalogApp[], legalIds: string[]): string[] {
  const problems: string[] = [];
  const slugs = new Set<string>();

  for (const app of apps) {
    if (slugs.has(app.slug)) problems.push(`duplicate app slug ${app.slug}`);
    slugs.add(app.slug);

    if (needsLegalPages(app)) {
      for (const doc of REQUIRED_DOCS) {
        if (!legalIds.includes(`${app.slug}/${doc}`)) {
          problems.push(`${app.slug} is listed as ${app.status} but has no ${doc}.md`);
        }
      }
    }
    if (app.hasAccounts && !app.deleteAccountUrl && !app.deleteSteps?.length) {
      problems.push(`${app.slug} has accounts but neither deleteAccountUrl nor deleteSteps`);
    }
  }

  for (const id of legalIds) {
    if (!slugs.has(id.split("/")[0])) problems.push(`legal file ${id} has no matching app`);
  }
  return problems;
}
