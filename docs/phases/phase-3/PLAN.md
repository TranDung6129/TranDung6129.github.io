# Phase 3 — End-to-end production integration

**Owner authorization:** 2026-11-15, autonomous implementation through deployment and live verification. **Baseline:** `main` `0045a4c` (P1-08 sign-off; production content identical to `3569afe`). **Design source of truth:** the owner-accepted Phase 2 specimen (`layouts/specimen/`, `assets/css/specimen/` → moved to `assets/css/editorial/`, `docs/design/REVIEW.md`), Newsreader for display, Source Serif 4 for reading.

## Architecture (D-014)

One site-owned editorial shell replaces the FixIt-derived shell on every page: masthead and navigation, footer, theme, search and code-copy script, and the Phase 2 component styles. Content rendering (Markdown, render hooks, MathJax passthrough, React shortcode), SEO head partials, feeds, sitemaps, search index and all public content URLs are kept. New sections are ordinary Hugo content sections; curated relationships (featured essays, volume chapters, films, labs, discover entries) live in front matter and `data/`, never in a database. FixIt-derived templates and styles that no page uses afterwards are removed with proof in P3-07.

## Delivery

| PR | Tasks | Merge order |
|---|---|---|
| A `feat/p3-foundation-home-journal` | plan, P3-01, P3-02, P3-03 | 1 |
| B `feat/p3-sections-navigation` (on A) | P3-04, P3-05, P3-06 | 2 |
| C `feat/p3-qa` (on B) | P3-07 | 3 |
| D `docs/p3-08-signoff` (on `main` after deploy) | P3-08 | 4 |

QA (P3-07) runs on the combined state of A+B before anything is merged; merging deploys. Navigation renders only sections that exist, so the brief deploy between merges of A and B is coherent.

## Tasks

### P3-01 Production design system foundation
- **Scope:** tokens for both themes (`[data-theme="dark"]` keeps the existing theme switch and storage key), dark paper `#1A1816` replacing the legacy `#292A2E`, self-hosted Newsreader/Source Serif 4, Phase 2 component CSS shared by specimen and production, one minified fingerprinted stylesheet, editorial shell (`baseof`, masthead, footer, `editorial.js`).
- **Depends:** Phase 2 accepted.
- **Files:** `assets/css/editorial/`, `layouts/_default/baseof.html`, `layouts/_partials/site/`, `assets/js/editorial.js`, `layouts/_partials/head/link.html`.
- **Acceptance:** production build passes; fonts load (vi/en glyphs); both themes and persistence work; no new runtime dependency; contrast of text tokens ≥ 4.5:1.
- **Tests:** build; font-resolution and contrast checks in the browser; token contrast script.

### P3-02 Homepage integration
- **Scope:** approved composition (masthead, hero + art, featured essays, journal, current volume) from real Hugo data; `data/home.yaml` picks featured essays.
- **Depends:** P3-01. **Files:** `layouts/index.html`, `layouts/_partials/editorial/`, `data/home.yaml`.
- **Acceptance:** working links only; responsive images; light/dark; no overflow at 360–1440 px.

### P3-03 Journal and article experience
- **Scope:** `/journal/` landing (all essays, category navigation, activity heatmap), section/taxonomy/term/archives/404/offline lists, article reading page (title, description, metadata, TOC, prose, math, code with copy, tables, images, footnotes, chapter/collection navigation, related reading, previous/next).
- **Depends:** P3-01. **Files:** `layouts/posts/single.html`, `layouts/section.html`, `layouts/taxonomy.html`, `layouts/term.html`, `layouts/home.archives.html`, `layouts/home.offline.html`, `layouts/404.html`, `content/journal/`.
- **Acceptance:** all existing article URLs and outputs kept; MathJax, code copy, TOC, React shortcode, images, tables, footnotes render; SEO checker passes.

### P3-04 Volumes and chapters
- **Scope:** `/volumes/` and volume pages; volume front matter lists chapter pages by path; chapters show their volume position and navigation. Volume I uses the approved cover and existing articles, labelled as a preview.
- **Depends:** P3-03. **Acceptance:** chapter links resolve; no purchase/membership links.

### P3-05 Films and Labs
- **Scope:** `/films/` from `data/films.yaml` (only the published Nash animation; honest empty state for future episodes), `/labs/` from `data/labs.yaml` (Nash explorer). Nash article untouched.
- **Depends:** P3-03. **Acceptance:** routes render; Nash baseline behaviour unchanged.

### P3-06 Discover and global navigation
- **Scope:** navigation to Journal, Volumes, Films, Labs, Discover with current-page state; `/discover/` from `data/discover.yaml` limited to works cited by existing articles, no affiliate links; search panel restyled over the existing per-language index; ja/zh-cn link to English sections instead of missing pages.
- **Depends:** P3-04, P3-05. **Acceptance:** every navigation link resolves in all four languages; search works vi/en; canonical/hreflang valid.

### P3-07 Quality assurance and regression
- **Scope:** route/output diff against P1-08, SEO checker, P1-02 analyzer, MathJax/heatmap runtime, browser matrix 360/390/768/1024/1440 × light/dark over home, journal, article, volume, films, labs, Nash, discover, axe accessibility, performance observations, visual comparison with the specimen; removal of FixIt-derived files left unused, with proof.
- **Depends:** P3-01…P3-06. **Acceptance:** QA report with no unresolved critical/high regression.

### P3-08 Production deployment and sign-off
- **Scope:** merge A→B→C, watch `deploy.yml`, verify the public site with the P1-08 live tools extended to the new routes, screenshots, rollback note.
- **Depends:** P3-07. **Acceptance:** public site verified directly.

Status, PRs and commits are tracked in `docs/TASK_BOARD.md`.

## Outcome (2026-11-15)

All eight tasks DONE. PRs #34 (A), #35 (B), #36 (C) merged; production `main` `5cfcec9`, deploy run 43739094847, verified live ([P3-08](../../audits/p3-08/README.md)). QA: [P3-07](../../audits/p3-07/README.md).
