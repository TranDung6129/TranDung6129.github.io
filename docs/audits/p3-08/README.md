# P3-08 — Phase 3 production deployment and live sign-off

**Status: DONE.** Verified 2026-11-15 by Claude Code directly against `https://trandung6129.github.io/`.

## Deployment

| Item | Value |
|---|---|
| Known-good production before Phase 3 | `0045a4c` (content identical to `3569afe`, P1-08) |
| Merges | #36 (P3-07) → `feat/p3-sections-navigation`, #35 (P3-04..06) → `feat/p3-foundation-home-journal`, **#34 → `main` = `5cfcec93ee10317d77aff9c24cddd9c3be0bd7ed`**. The stacked PRs were merged into their bases first so production received a single deploy of the fully QA'd tree; the merged branch tree was checked identical to the QA'd commit `16fbb9c` before #34 |
| Workflow | `.github/workflows/deploy.yml` (unchanged), [run 43739094847](https://github.com/TranDung6129/TranDung6129.github.io/actions/runs/43739094847), push, **success** |
| Live | `last-modified: Sun, 15 Nov 2026 17:05:52 GMT`; served about a minute after the merge |

## Live verification

Environment: allow-listed egress to `trandung6129.github.io` (and the two CDNs), certificate validation on, headless Chromium 153.0.8010.12.

| Check | Result |
|---|---|
| Live = deployed commit | every one of the 687 files of a local build of `5cfcec9` fetched from the site: **687 × HTTP 200, 687 byte-identical** ([live-mirror.json](evidence/live-mirror.json)) |
| SEO on the live tree | PASS, 213 pages ([seo-check-live.json](evidence/seo-check-live.json)) |
| Links on the live tree | **0** broken internal references, 0 missing fragments ([static-summary-live.json](evidence/static-summary-live.json)) |
| Browser matrix on the live site | 8 pages × 360/390/768/1024/1440 × light/dark = **80 states pass** |
| Functional checks on the live site | **31/31**: navigation in four languages, search (vi/en, diacritic-insensitive) + Escape, theme persistence, TOC, code copy, MathJax 674 formulas on 16 pages, heatmap and its theme colours, Nash preset/keyboard/poster/video/mobile fallback, Films, Labs, Volume chapters, no commerce links, mobile menu + Escape, keyboard focus, reduced motion ([p3-results-live.json](evidence/p3-results-live.json)) |
| axe-core WCAG 2.1 A/AA on the live site | **0 violations** (8 pages × 390/1440 × light/dark) |
| Console / network | no page errors; no failed request to the site; no failed third-party request |

Screenshots of the real production site: [evidence/screenshots/](evidence/screenshots/) (every tested page at 390 and 1440 px, light and dark, plus the open mobile menu).

Comparison with the last tested local build: identical bytes (above), so the P3-07 results ([report](../p3-07/README.md)) — performance, visual review, route comparison with P1-08 — apply to production unchanged.

## Rollback

Revert `5cfcec9` on a new branch (`git revert -m 1 5cfcec9`), build, run `docs/audits/p3-07/tools/p3-smoke.cjs` against the local build, merge by PR; `deploy.yml` publishes it. The result is the `0045a4c` site. Content URLs are unchanged by Phase 3, so no redirects are needed either way. Never reset `main`. The database (P1-09) is not involved.

## Not verified

Real phones and non-Chromium browsers, screen readers, field Core Web Vitals, external rich-result validators.
