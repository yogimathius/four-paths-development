# Four Paths

The static site for **https://fourpaths.ca**: the public home of an independent product studio. Its main routes are Home, Work, Notes, Now and About. Existing app privacy, support and data-deletion URLs remain available for store compliance.

Built with Astro (static output) and deployed by Netlify from `main`. Current rebuild plan: `docs/superpowers/plans/2026-10-03-four-paths-rebuild.md`.

## Commands

```sh
pnpm install
pnpm dev        # local dev server
pnpm check      # astro check → unit tests → build → link check → Playwright (e2e + axe)
```

## Store URLs

Paste these into Play Console / App Store Connect:

| Purpose | URL |
| --- | --- |
| Privacy policy | `https://fourpaths.ca/apps/<slug>/privacy` |
| Support | `https://fourpaths.ca/apps/<slug>/support` |
| Account / data deletion | `https://fourpaths.ca/apps/<slug>/delete-account` |
| Website | `https://fourpaths.ca/apps/<slug>` |

## Updating the studio site

- `src/lib/studio.ts` holds the public Work case studies, status, lenses and project imagery.
- `src/content/notes/*.md` holds Notes; each entry gets an article page and appears in RSS.
- `src/pages/now.astro` is a dated snapshot and should be reviewed whenever work materially changes.
- The default theme is warm charcoal. An explicit light/dark choice is saved locally.

## Adding an app on a store track

1. Create `src/content/apps/<slug>/index.md` (see an existing app for the frontmatter; the schema is in `src/content.config.ts`).
2. Put its icon and screenshots in `src/assets/apps/<slug>/`.
3. When it heads to a store track, set `status: testing` and add `privacy.md` and `support.md` next to `index.md`. The build fails if a `live`/`testing` app is missing either.
4. Apps with accounts need `hasAccounts: true` plus a `deleteAccountUrl` (the backend's own deletion flow) and/or `deleteSteps` (in-app steps). The deletion page is generated from these.

## Studio identity

`src/site.config.ts` holds the studio name, legal name, founder line, and contact addresses. Markdown content uses `{{legalName}}`, `{{privacyEmail}}`, `{{email}}`, and `{{name}}` tokens, filled in at build time (unknown tokens fail the build), so a rename is a one-line change.

The press-kit wordmark PNGs are rendered with the real font by `node scripts/render-wordmark.mjs`.
