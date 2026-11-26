# Four Paths site audit — November 26, 2026

## Repository and deployment findings

Both shared folders point at `yogimathius/four-paths-development`.

| Checkout | Last local commit | Date |
| --- | --- | --- |
| `projects/91-professional/four-paths-development` | `f28ffbf` | October 3, 2026 |
| `projects/01-verified-flagships/four-paths-development` | `dd3d713` | November 19, 2026 |

GitHub main and the current Netlify production deployment both point at `751d93a103321f17aa23359a0f1c561dbfdaa95d` (PR #15). Netlify deployment `6b07c4f31958f61e2e9db955` published successfully at 2026-11-26 05:34:59 UTC, which is **November 25, 9:34:59 p.m. in Vancouver**.

That release added the founder profile and portrait, Sadhana pricing, search titles and descriptions, and a shorter footer identity. The newer local checkout was one commit behind. Its upstream text changes and the exact founder image (Git blob `28fd1812d5f48fea001160cb0fecfe0927faec0e`) have been included in this working copy before the redesign. Git metadata remains at the original local revision because this environment does not permit writes to `.git`.

## Findings and changes

| Finding | Change |
| --- | --- |
| Similar oversized introductions on almost every page delay the useful content. | Each primary page now has its own composition: illustrated homepage, product gallery, concise client introduction, portrait-led About, compact notebook and dated studio update. |
| Header looks generic; mobile links wrap into multiple rows. | Stronger wordmark treatment, clear active navigation, consistent Contact action, accessible mobile disclosure with Escape handling and keyboard focus return. Navigation remains available without JavaScript. |
| Homepage repeats its positioning and hides real work below large text sections. | Actual Sadhana practice artwork leads the opening view. Product and client previews have clear actions and shorter descriptions. |
| Internal “Work” terminology obscures the distinction between products and client work. | Public product navigation now says “Products”; existing `/work` URLs remain stable. |
| Project presentation mixes large icons, tiny screenshots and placeholder lines. | Shared artwork treatments provide consistent framing. ClearLedger is explicitly labelled as a concept preview, with no invented customer or financial results. |
| Repeated numbered labels add clutter without explaining a sequence. | Removed redundant section numbering and most catalogue-style labels; retained real dates, project states and useful metadata. |
| Case studies use too much vertical space before readers see the product. | Product introductions pair copy with artwork. Client introductions use a smaller title scale and lead directly into screenshots. |
| Founder profile is buried. | Portrait and name anchor About, with direct links to the studio, founder, four paths and approach. |
| Footer repeats the homepage headline and offers little contact hierarchy. | Dedicated contact treatment, concise studio positioning and quieter secondary navigation. |
| Some older navigation leads to a secondary app catalogue. | The 404 page now leads to the main product gallery; Notes offers a direct RSS subscription link. |

The existing Sadhana launch links, pricing, legal pages, account-deletion pages, structured data, canonical URLs, RSS and legacy redirect configuration are preserved.

## Validation

- Astro check: no errors, warnings or hints.
- Unit tests: 14 passing.
- Static build: 44 pages generated.
- Internal link check: 96 generated files checked, all internal links resolve.
- Added browser regression coverage for mobile menu interaction, Escape/focus behavior, navigation without JavaScript, and the homepage inquiry anchor. Updated existing expectations for the redesigned homepage.
- Reviewed the hosted preview in the browser at 320px, 360px, 768px and desktop widths, including the light theme. The five primary interior pages have no horizontal overflow at the checked mobile/tablet widths; the mobile menu opens and Escape closes it with focus restored. Founder image loading and Sadhana pricing were verified. The review caught illustration sizing and product-artwork width issues, which were corrected.
- Local browser execution is blocked by the managed environment, so the full suite runs in GitHub Actions. The first CI run passed 147 of 149 browser tests and identified two real issues: active navigation on Astro’s generated index URLs and artwork collapsing inside the case-study grid. Both were corrected; require the final CI run to pass before merging.

## Release status

The redesign is proposed on `design/studio-polish-2026-11-26`, based on upstream main at `751d93a`. The same changes are available in the newer local checkout. Yesterday's production release remains live; the redesign has not been merged or deployed to production.

Before publishing: require the pull request’s `pnpm check` CI job to pass and review the desktop/mobile pages in both themes. The local checkout still needs its Git metadata reconciled with upstream before a local merge.
