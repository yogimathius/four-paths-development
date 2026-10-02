# Four Paths studio site — design

Date: 2026-10-02
Status: awaiting owner review
Repo: `four-paths-development` (deploys to https://fourpaths.ca via Netlify)

## 1. Purpose

Replace the "Coming Soon" page at fourpaths.ca with a real studio site for the Four Paths mobile-app lane. Its non-negotiable job is to be the stable, public, branded home for every app's privacy policy, support page, and data-deletion page, so store listings never depend on yogimathius.dev or on an app's own server staying up.

Secondary jobs: present the apps, host a journal (blog), a press kit, and a newsletter signup.

### Success criteria

- Every app listed on the site has a public privacy URL at `fourpaths.ca/apps/<slug>/privacy` suitable for Google Play and App Store Connect (public, no login, HTML, names the operator, has a working contact).
- The build fails if an app with status `live` or `testing` is missing its privacy policy, support page, or deletion page.
- Existing store-listed URLs on yogimathius.dev keep resolving (301 to the new URL).
- The site has no runtime server. A Netlify outage aside, policy pages cannot go down because a backend did.
- Renaming the studio, the founder line, or a contact address is a one-line config change.

### Non-goals

- No accounts, CMS, comments, or analytics on the site at launch.
- No shared code, links, or styling with yogimathius.dev.
- No legal review is performed by this work. Policies are migrated or drafted for the owner to review.

## 2. Decisions already made

| Topic | Decision |
| --- | --- |
| Brand | "Four Paths". The Play developer name may change from "Four Paths Development" to "Four Paths"; the site uses a single `legalName` config value so policies match whatever Play shows. |
| Identity | Studio-forward everywhere. The founder is named once, on About and in the press kit: "founded by Mathius Johnson", driven by one config value. No links to yogimathius.dev. |
| Contacts | `hello@fourpaths.ca` (general/support) and `privacy@fourpaths.ca` (alias). No more `info@yogimathius.dev` on app-facing pages. |
| Scope | Option C: app gallery + per-app legal pages + journal + press kit + newsletter. |
| Visual | "Sorbet Gradient": pastel mesh gradients, frosted cards, Bricolage Grotesque. Legal pages use a calm variant. Light and dark modes. |
| Stack | Astro, static output, Netlify. Newsletter via Buttondown's hosted form (no backend). |
| Policy home rule | Static legal text lives on fourpaths.ca for every app. Actions that need an account (actually deleting an account, password reset) stay on the app's own backend; the fourpaths.ca page links to them. |

## 3. Pages and URLs

| Route | Content |
| --- | --- |
| `/` | Hero, app gallery, latest 3 journal posts, newsletter signup |
| `/apps` | All non-hidden apps with path colour and status badge |
| `/apps/<slug>` | Tagline, description, screenshots, store badges, links to legal pages |
| `/apps/<slug>/privacy` | App privacy policy (the store URL) |
| `/apps/<slug>/support` | FAQ, contact, platform notes |
| `/apps/<slug>/delete-account` | Deletion instructions. Local-only apps: "uninstall or clear app data". Backend apps: link to the backend's deletion flow plus email fallback |
| `/apps/<slug>/terms` | Only when the app's content folder contains `terms.md` |
| `/journal`, `/journal/<slug>` | Posts; `/rss.xml` feed |
| `/press` | Studio boilerplate, founder line, logo/wordmark downloads, per-app icons and screenshots |
| `/about` | Studio story built around the four paths; founder line |
| `/privacy` | Privacy policy for the website itself (Netlify hosting logs, Buttondown newsletter) |
| `/404` | Branded not-found page |

## 4. Content model

All content lives in Astro content collections under `src/content/` and is validated with Zod schemas at build time.

### `src/site.config.ts`

```ts
export const site = {
  name: "Four Paths",
  legalName: "Four Paths",          // must match the Play Console developer name
  founderName: "Mathius Johnson",   // set to null to remove the founder line everywhere
  country: "Canada",
  email: "hello@fourpaths.ca",
  privacyEmail: "privacy@fourpaths.ca",
  url: "https://fourpaths.ca",
  newsletter: { provider: "buttondown", username: "<set at setup>" },
};
```

### `src/content/apps/<slug>/index.md` (frontmatter)

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Display name |
| `tagline` | string | One line |
| `path` | `family` \| `technology` \| `philosophy` \| `creativity` | Drives colour |
| `status` | `live` \| `testing` \| `coming-soon` \| `hidden` | `hidden` builds legal pages but omits the app from galleries |
| `platforms` | `("android" \| "ios")[]` | |
| `stores` | `{ play?: url, appStore?: url }` | Badges render only when present |
| `icon` | image | Optional; falls back to a path-gradient tile |
| `screenshots` | image[] | Optional |
| `hasAccounts` | boolean | |
| `deleteAccountUrl` | url? | Required when `hasAccounts` is true |
| `order` | number | Gallery order |

Sibling files in the same folder: `privacy.md` (required when status is `live` or `testing`), `support.md` (same), optional `terms.md`. Legal frontmatter: `title`, `lastUpdated` (date), `summary` (the "short version" box).

The deletion page is generated from `hasAccounts` / `deleteAccountUrl`, so it never needs its own file.

### `src/content/journal/<slug>.md`

`title`, `description`, `date`, optional `app` (slug, for cross-linking), `draft`. Byline is always "Four Paths".

## 5. Visual system

- **Path colours** (gradient pairs; each has a dark-mode counterpart):
  - Family `#FFB5C9 → #FFD6A5`
  - Technology `#B5EAD7 → #C7F0FF`
  - Philosophy `#CDB4FF → #FFC8DD`
  - Creativity `#FFE8A3 → #B5EAD7`
- **Base**: ink `#1F1B2E`, paper `#FFF8F2` with three soft radial blooms (pink, sky, mint). Dark: deep plum base, same pastels slightly desaturated.
- **Type**: Bricolage Grotesque (display, 500/700/800), Inter (body). Self-hosted via `@fontsource` packages, so no third-party font requests (keeps the site's own privacy policy simple).
- **Components**: `Nav`, `Footer`, `AppCard`, `PathBadge`, `StatusBadge`, `StoreBadges`, `GlassCard`, `NewsletterForm`, `LegalLayout`, `PageLayout`.
- **Legal variant** (`LegalLayout`): plain warm-white (`#FFFCF8`) background, Inter body at a 65ch measure, Bricolage headings only, a 6px path-colour bar at the top, the `summary` rendered as a path-tinted "short version" box, a "Last updated" line, and a footer stating "Operated by {legalName} · {privacyEmail}".
- **Wordmark**: lowercase "four paths" set in Bricolage 800 as text and SVG. The existing `logo.png` is retired from the site (kept in git history).
- Light/dark follows `prefers-color-scheme` with a manual toggle stored in `localStorage`.
- Accessibility: WCAG AA contrast for all text on pastels (ink text on pastel, never white); visible focus rings; `prefers-reduced-motion` disables any gradient animation.

## 6. Launch app inventory and migration

| App | Path | Status at launch | Accounts | Policy source | Work |
| --- | --- | --- | --- | --- | --- |
| Chore Credits | Family | testing (Play closed test) | No | `remix-portfolio/app/routes/chore-credits.privacy.tsx` | Port text; **fix "birthdate" → "birth month and year"**; operator → `legalName`; contact → `privacyEmail`; new `lastUpdated` |
| Life Atlas | Philosophy | testing | Yes | `remix-portfolio/app/routes/life-atlas.privacy.tsx`, `life-atlas.delete-account.tsx` | Port policy text; deletion page links to the existing request flow; contact → `privacyEmail` |
| Pillars | Philosophy | testing (Play closed test) | Yes | `pillars/apps/web/src/shell/legal/PrivacyPage.tsx` (live at `pillars.fly.dev/privacy`) | Copy text to fourpaths.ca; deletion page links to `pillars.fly.dev` delete flow. Pillars' own pages stay up; switching its Play URL is optional and done by the owner later |
| Forge 5x5 | Creativity (owner to confirm) | testing or coming-soon (owner to confirm) | No | `breakout-5x5/play-store/privacy-policy.md` | Port; **"published by yogimathius.dev" → `legalName`**; contact → `privacyEmail` |
| ClearLedger | Technology | coming-soon | n/a | none | App page only, no legal pages yet. Its data flows (YNAB server, encrypted store, Fly deployment) are still changing; a policy is written when it heads to a store track |

Policy text is ported as-is apart from the listed corrections. Each ported policy keeps its substantive claims; any claim the port cannot verify is left unchanged and listed for owner review rather than rewritten.

### Redirects (change in `remix-portfolio`, separate commit/PR)

- `/chore-credits/privacy` → `https://fourpaths.ca/apps/chore-credits/privacy` (301)
- `/life-atlas/privacy` → `https://fourpaths.ca/apps/life-atlas/privacy` (301)
- `/life-atlas/delete-account` → `https://fourpaths.ca/apps/life-atlas/delete-account` (301)

The redirects ship only after the new pages are live and verified. Store listings are then updated by the owner; redirects stay indefinitely.

## 7. Newsletter

Buttondown hosted embed: a plain HTML form that POSTs to Buttondown's subscribe endpoint with double opt-in, plus a `<noscript>`-safe fallback link. No JavaScript is required to subscribe. The site's `/privacy` page names Buttondown as the processor. If no Buttondown username is configured, the form is not rendered (the build does not fail), so the site can launch before the account exists.

## 8. Build, deploy, and verification

- Astro (latest), TypeScript strict, `output: "static"`, `@astrojs/sitemap`, `@astrojs/rss`. pnpm.
- `netlify.toml`: `pnpm build`, publish `dist/`, security headers (CSP without third-party script/font origins except Buttondown's form action, `Referrer-Policy`, `X-Content-Type-Options`), and long cache for hashed assets.
- The old static `index.html`, `styles.css` are replaced in the same branch.
- Checks (all run in CI via a GitHub Action and locally with `pnpm check`):
  1. `astro check` (types + content schemas).
  2. Content integrity: a build-time assertion that every `live`/`testing` app has `privacy.md` and `support.md`, every `hasAccounts` app has `deleteAccountUrl`, and every legal file has a `lastUpdated`.
  3. `astro build`.
  4. Internal link check over `dist/`.
  5. Playwright smoke tests against `astro preview`: each app's privacy page returns 200, renders its heading, operator line and contact email, and works without JavaScript; home and app pages render in light and dark.
  6. axe accessibility scan on home, one app page, and one privacy page (no serious/critical violations).
- Deploy: Netlify builds from `main`. Work happens on a feature branch with a Netlify deploy preview; the owner checks the preview before merging.

## 9. Owner actions (outside the code)

1. Confirm in Netlify that the fourpaths.ca site is connected to this GitHub repo (or connect it).
2. Set up email for fourpaths.ca. The domain has no MX records today; it uses Netlify DNS (NS1). Add a forwarding service (e.g. ImprovMX or Forward Email) for `hello@` and `privacy@`.
3. Create the Buttondown account and put the username in `site.config.ts`.
4. Decide on renaming the Play developer to "Four Paths"; set `legalName` to match.
5. After deploy: update privacy/support URLs and contact email in each Play listing (Chore Credits, Life Atlas, Forge 5x5; Pillars optional).
6. Review all ported policies before relying on them; legal review before any public production release.
7. Check employment agreement/policies on outside work (discussed separately; no effect on the build).

## 10. Open questions

- Forge 5x5: confirm the Creativity path and whether it shows as `testing` or `coming-soon`.
- Initial journal content: launch with one welcome post, or with the journal hidden until the first real post?
