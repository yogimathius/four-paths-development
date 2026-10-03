# Four Paths Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Four Paths as a dark-first independent product studio site with real work, notes, and current activity.

**Architecture:** Keep Astro static rendering. Share project facts through `src/lib/studio.ts`, use content collections for Notes, and preserve old app/legal routes while introducing the new public information architecture.

**Tech Stack:** Astro 7, CSS, TypeScript, Playwright, Vitest.

**Spec:** User's “Four Paths Website Rebuild” brief in this conversation.

## Global Constraints

- Four Paths is the dominant brand; no “Coming Soon” in visible copy.
- Work precedes taxonomy on Home.
- Default dark with saved explicit theme choice respected.
- Real product artifacts; no fabricated store links or metrics.
- Preserve `/apps/[slug]/privacy`, support and delete-account URLs.
- Static and light; reduced motion and mobile layouts.

## Review Focus

- Direct entry to a case study or note must include a meaningful next link.
- A saved light theme must survive navigation even when OS preference is dark.
- A 360px viewport must not scroll horizontally.
- Existing app policy and support URLs must still respond.
- RSS and structured metadata must use the new Notes URLs.

---

### Task 1: Site shell and content model

**Files:** `src/lib/studio.ts`, `src/styles/global.css`, `src/components/{Head,Nav,Footer,ThemeToggle}.astro`, `src/site.config.ts`, `tests/e2e/studio.spec.ts`

- [x] Write route/theme behavioral tests and observe the old experience fail.
- [x] Establish studio project facts, lenses, visual tokens and navigation.
- [x] Verify theme behavior and existing legal routes with Playwright.

### Task 2: Home and Work

**Files:** `src/pages/index.astro`, `src/pages/work/index.astro`, `src/pages/work/[slug].astro`, `tests/e2e/studio.spec.ts`

- [x] Implement narrative Home with Pillars featured before paths.
- [x] Implement Work index and deep project case studies from `studio.ts`.
- [x] Run focused Playwright tests and repair layout.

### Task 3: Notes, Now and About

**Files:** `src/content.config.ts`, `src/content/notes/*.md`, `src/pages/notes/*`, `src/pages/now.astro`, `src/pages/about.astro`, `src/pages/rss.xml.ts`

- [x] Add source-grounded notes and article metadata.
- [x] Add dated Now page and first-person About page.
- [x] Verify direct routes and RSS.

### Task 4: Compatibility and quality

**Files:** `src/lib/paths.ts`, old app content, tests, metadata asset, `README.md`

- [x] Remove visible “Coming Soon”, preserve legacy policy URLs.
- [x] Run typecheck, tests, build, links, accessibility and mobile checks.
- [x] Visually inspect desktop/mobile and refine.
