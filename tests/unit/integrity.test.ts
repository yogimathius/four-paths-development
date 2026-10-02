import { describe, expect, it } from "vitest";
import { catalogProblems, type CatalogApp } from "../../src/lib/integrity";

const app = (overrides: Partial<CatalogApp> = {}): CatalogApp => ({
  slug: "chore-credits",
  status: "testing",
  hasAccounts: false,
  ...overrides,
});

describe("catalogProblems", () => {
  it("accepts a store-tracked app with privacy and support pages", () => {
    expect(catalogProblems([app()], ["chore-credits/privacy", "chore-credits/support"])).toEqual([]);
  });

  it.each(["live", "testing"] as const)("requires a privacy policy for %s apps", (status) => {
    expect(catalogProblems([app({ status })], ["chore-credits/support"])).toEqual([
      "chore-credits is listed as " + status + " but has no privacy.md",
    ]);
  });

  it("requires a support page for store-tracked apps", () => {
    expect(catalogProblems([app()], ["chore-credits/privacy"])).toEqual([
      "chore-credits is listed as testing but has no support.md",
    ]);
  });

  it("does not require legal pages for coming-soon apps", () => {
    expect(catalogProblems([app({ status: "coming-soon" })], [])).toEqual([]);
  });

  it("still requires legal pages for hidden apps that are on a store track", () => {
    // hidden only removes an app from galleries; its URLs may still be in a store listing
    expect(catalogProblems([app({ status: "hidden", storeTracked: true })], [])).toHaveLength(2);
  });

  it("requires a deletion route for apps with accounts", () => {
    expect(
      catalogProblems([app({ hasAccounts: true })], ["chore-credits/privacy", "chore-credits/support"]),
    ).toEqual(["chore-credits has accounts but neither deleteAccountUrl nor deleteSteps"]);
  });

  it("accepts in-app deletion steps instead of a deletion URL", () => {
    const steps = ["Open the account menu.", "Choose Delete account and data."];
    expect(
      catalogProblems([app({ hasAccounts: true, deleteSteps: steps })], ["chore-credits/privacy", "chore-credits/support"]),
    ).toEqual([]);
  });

  it("rejects legal files that belong to no app", () => {
    expect(catalogProblems([], ["ghost-app/privacy"])).toEqual([
      "legal file ghost-app/privacy has no matching app",
    ]);
  });

  it("reports duplicate slugs", () => {
    const ids = ["chore-credits/privacy", "chore-credits/support"];
    expect(catalogProblems([app(), app()], ids)).toContain("duplicate app slug chore-credits");
  });
});
