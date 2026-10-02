import { describe, expect, it } from "vitest";
import { fillTokens } from "../../src/lib/site-tokens";

const values = { legalName: "Four Paths", privacyEmail: "privacy@fourpaths.ca" };

describe("fillTokens", () => {
  it("replaces known tokens", () => {
    expect(fillTokens("Operated by {{legalName}}.", values)).toBe("Operated by Four Paths.");
  });

  it("replaces several tokens, including inside URLs", () => {
    expect(fillTokens("mailto:{{privacyEmail}}?subject={{legalName}}", values)).toBe(
      "mailto:privacy@fourpaths.ca?subject=Four Paths",
    );
  });

  it("throws on unknown tokens so a typo cannot ship as literal braces", () => {
    expect(() => fillTokens("Write to {{privacyEmial}}", values)).toThrow(/privacyEmial/);
  });

  it("leaves text without tokens untouched", () => {
    expect(fillTokens("No tokens {here}", values)).toBe("No tokens {here}");
  });
});
