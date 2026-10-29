// Single source of truth for studio identity. Policies, footers, About and the
// press kit all read from here, so a rename or contact change is one edit.
export const site = {
  name: "Four Paths",
  /** Must match the developer name shown in Play Console / App Store Connect. */
  legalName: "Four Paths",
  /** Set to null to remove the founder line everywhere. */
  founderName: "Mathius Johnson" as string | null,
  country: "Canada",
  email: "info@fourpaths.ca",
  privacyEmail: "info@fourpaths.ca",
  url: "https://fourpaths.ca",
  tagline: "Independent Product Studio",
  description:
    "Four Paths is an independent product studio building thoughtful software, games and experiments across technology, creativity and everyday human life.",
  /** Leave username empty until the Buttondown account exists; the form hides itself. */
  newsletter: { provider: "buttondown" as const, username: "" },
};

export type Site = typeof site;
