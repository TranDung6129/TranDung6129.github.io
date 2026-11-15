# P3-07 — Phase 3 quality assurance and regression report

Claude Code, 2026-11-15. Build under test: the combined state of PR A (`feat/p3-foundation-home-journal`), PR B (`feat/p3-sections-navigation`) and this branch (`feat/p3-qa`), local production build with Hugo Extended 0.149.0. Behavioural baseline: P1-08 (production `3569afe`, identical to `0045a4c`). Browser: headless Chromium 153.0.8010.12 via Playwright 1.63.0, default options, certificate validation on. **Result: PASS — no critical or high regression open.**

## A. Hugo build and routes

| Check | Result |
|---|---|
| `hugo --gc --minify --logLevel info` | passes, 0 warnings ([log](evidence/build-production.log)); development build passes |
| Content routes vs P1-08 (647 → 688 files) | **0 HTML, XML, JSON or Markdown routes removed** ([diff](evidence/routes-vs-p1-08.json)) |
| Removed files | 21 FixIt stylesheets, scripts, bundled-library and icon files under `/css/`, `/js/`, `/lib/`, `/images/*.min.svg` that no page loads any more. No content URL; `static/lib/` (KaTeX, lightGallery, webfonts) is still published |
| Added routes | `/journal/`, `/volumes/`, `/volumes/volume-i/`, `/films/`, `/labs/`, `/discover/` in vi and en with feeds; `page/1` aliases for two empty categories and the ja/zh-cn archives; editorial CSS/JS, fonts and artwork |
| Broken internal references (P1-02 analyzer) | **140 → 0**; zero missing fragments ([summary](evidence/static-summary.json)). The ja/zh-cn menus no longer link to missing pages |
| SEO invariants (`docs/audits/p1-06/tools/seo-check.py`) | PASS on 213 pages: one canonical each, valid reciprocal hreflang with x-default, untranslated copies canonicalised, title/description/og:image, icons, JSON-LD parse; 5 sitemaps with 205 URLs; search index vi 22 / en 22 ([result](evidence/seo-check.json)) |
| Unused templates | 31 FixIt-derived templates no build executes were removed ([list](evidence/removed-templates.txt)); the specimen templates stay for the Phase 2 review route |
| Removal safety | build after removing those templates and the unused FixIt SCSS/JS/library sources is byte-identical to the build before |

## B–D. Browser matrix, functional regression and accessibility

Tool: [`tools/p3-smoke.cjs`](tools/p3-smoke.cjs) (reused live in P3-08). Raw results: [`evidence/p3-results.json`](evidence/p3-results.json). **31/31 checks pass.**

- **Matrix:** 8 pages (home, journal, article, volume, films, labs, Nash, discover) × 360/390/768/1024/1440 px × light/dark = **80 states**: all HTTP 200, theme follows the colour scheme, no horizontal overflow, no page errors, no failed own-site request, one `h1` per page, Newsreader and Source Serif 4 loaded, masthead controls ≥ 44 × 44 px, paper `#F7F5F0` (light) and **`#1A1816` (dark — the P1-08 `#292A2E` defect is fixed)**.
- **Functional:** masthead, language and footer links resolve in vi/en/ja/zh-cn; five sections in the navigation; search returns resolving results for "nash" (vi, en) and the unaccented "toi uu" (Vietnamese diacritics folded); Escape closes search and restores focus; theme toggle persists across pages; TOC scrolls to its heading; code copy writes code without line numbers; **MathJax typesets 674 formulas on 16 pages with zero errors** (same count as P1-04/P1-08); heatmap renders six months on `/journal/` and `/en/journal/`, highlights active days and recolours on theme change (P1-04 colour defect fixed); Nash preset (Matching Pennies → p* = q* = 0.500), keyboard slider, poster, video and 390 px fallback; Films poster and source; Labs link opens the live simulation; Volume I's six chapter links resolve and chapter pages show their position; no price/purchase/sponsored/affiliate wording or links; mobile menu opens with sections and languages and Escape restores focus; keyboard order starts with the skip link and every stop has a visible outline; reduced motion disables smooth scrolling.
- **axe-core 4.10.2**, WCAG 2.1 A/AA, 8 pages × 390/1440 × light/dark: **0 violations**. Found and fixed during QA: heading permalink icons without accessible names (inherited from FixIt), the heatmap's scroll region not focusable, two Nash sliders without labels, and Nash label colours below 4.5:1 on light paper (now theme-aware tokens; behaviour unchanged). Remaining *incomplete* items needing human judgement: 22 colour-contrast cases over images/gradients and 8 `video-caption` notices (the Manim animation has no captions; it has no speech).
- Automated checks are not a WCAG conformance claim; screen-reader testing was not performed.

Screenshots (WebP, viewport): [`evidence/screenshots/`](evidence/screenshots/) — every page at 390 and 1440 px in both themes, home and article also at 360/768/1024, and the open mobile menu.

## E. Performance (local, unthrottled, single run; not field Core Web Vitals)

[`tools/perf.cjs`](tools/perf.cjs), [`evidence/performance.json`](evidence/performance.json). Before = P1-08 build, after = Phase 3.

| Page | Width | Transfer before → after | Requests | LCP before → after | CLS before → after |
|---|---|---|---|---|---|
| Home | 390 | 1,135 KB → 589 KB | 26 → 17 | 368 → 124 ms | 0.006 → 0 |
| Home | 1440 | 1,290 KB → 742 KB | 27 → 17 | 324 → 104 ms | 0.002 → 0 |
| Nash essay | 390 | 3,873 KB → 3,060 KB | 36 → 26 | 152 → 120 ms | 0.155 → 0 |
| Math essay | 390 | 1,452 KB → 526 KB | 28 → 15 | 124 → 84 ms | 0.067 → 0 |

One stylesheet (36 KB) replaces four, one 5 KB script replaces the FixIt bundle, Google Fonts are no longer requested, hero art is served as responsive WebP. Remaining weight: variable fonts (264–463 KB depending on glyphs used), the React bundle on the Nash page (≈780 KB uncompressed) and the essay's `<video>` without `preload` (1.7 MB, content markup left unchanged).

## F. Visual review against the approved specimen

Compared production screenshots with `docs/design/review-v2/full/`. Kept as approved: masthead and rules, hero composition and art, featured-essay cards, journal list, current-volume card, palette, Newsreader/Source Serif 4, dark mode without image inversion. Intentional differences: the "Design specimen" banner, the type-study "reading room" and the "Beyond the page" panel were review-only and are replaced by real pages (article, films, labs, discover); masthead meta line shows the publication tagline instead of "Issue 01 · A design study"; language links replace the static "EN"; featured/journal entries are real essays. No component was restyled beyond the production layer in `assets/css/editorial/site.css`.

## Known limitations (not regressions)

- 23 of 24 English essays are copies of the Vietnamese text (placeholder content; canonicalised to the original).
- ja/zh-cn have no articles; their pages state this and link to English sections. Their interface strings are English.
- Featured-essay artwork is illustrative; the probability illustration is paired with the Riemann essay by editorial choice (`data/home.yaml`).
- Discover lists citations only; no outbound links until each URL is verified.
- Only one short film exists; longer films are announced as not yet published.
- Search matches titles and the indexed article text client-side; ranking is simple.

## Rollback

Production before Phase 3 is `0045a4c` (content identical to `3569afe`). Phase 3 lands as merges of PRs A, B and C; revert the merge commits newest first on a new branch (`git revert -m 1 <sha>`), build, run `p3-smoke.cjs`/`seo-check.py`, merge. Never reset `main`. Public content URLs are unchanged, so a rollback needs no redirects.
