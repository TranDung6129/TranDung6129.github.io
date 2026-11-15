# P1-06 — content metadata conventions and technical SEO

Claude Code, 2026-11-15. Branch `feat/p1-06-metadata-seo`, stacked on `chore/p1-05-css-config-cleanup` (PR #20, itself on PR #19). Baseline for comparisons is the P1-05 build; defect counts are compared with the committed P1-02 baseline.

No article text, translation, permalink, navigation, layout or visual style changes. FixIt stays (P1-07). No database files (P1-09).

## What changed

| Area | Change | Files |
|---|---|---|
| Canonical | Exactly one canonical per page (archives/offline pages carried two). An English file whose Markdown body is byte-identical to the Vietnamese original names the original as canonical | `layouts/_partials/head/link.html` (site-owned copy of the FixIt partial), `layouts/_partials/site/translation.html` |
| Hreflang | Emitted only between language versions whose text actually differs, with `x-default` on the default language. Today that is one article pair. Detection is automatic: translating a copied file makes it independent | same |
| Icons | Favicon path `static/images/logoted.png` (404 on nested pages) → `/images/logoted.png`; `apple-touch-icon.png` generated from the existing logo; mask-icon link no longer emitted (no such asset) | `config/_default/params.toml`, `static/apple-touch-icon.png` |
| Nash poster | `static/images/game_theory_nash_poster.png` is the title frame (t = 3 s) of the published video, not a new illustration | `static/images/` |
| Social / structured data | Default `og:image`/`twitter:image` (site logo) when a page has no featured image; article JSON-LD publisher is the publication | `config/_default/params.toml` |
| Site defaults | Keywords `Hugo, FixIt` replaced; app title; en/ja/zh-cn taglines were FixIt slogans, now translations of the Vietnamese tagline | `params.toml`, `languages.toml` |
| Robots | Site-owned template; `/css/`, `/js/`, `/images/` are crawlable again so pages can be rendered and figures indexed. Crawler block list unchanged | `layouts/robots.txt` |
| Front matter | `lastmod` source typo `:defalut` → `:default` (no date changed); archetype documents optional `contentType`, `topics`, `authors`, `access` | `config/_default/frontmatter.toml`, `archetypes/default.md` |

## Front matter conventions (adopted, backward compatible)

Required today: `title`, `date`. Recommended: `description` (falls back to the summary), `categories`, `tags`, `collections` for chapters (order follows `date`). Optional, read by nothing yet and safe to add per article: `contentType`, `topics`, `authors`, `access` as in `docs/CONTENT_MODEL.md`. Featured image: `featuredImage` / `featuredImagePreview`; without one the site logo is the social image. Translations: `name.md` (vi) and `name.en.md`; a translation is announced to search engines only once its text differs from the original. Do not set a canonical in front matter. No existing Markdown file was edited.

## Verification

Hugo Extended 0.149.0, headless Chromium 153.0.8010.12, certificate validation on. Tools in [`tools/`](tools/) and `docs/audits/p1-05/tools/`.

| Check | Result |
|---|---|
| Production and development builds | pass, zero warnings in production ([`evidence/build-production.log`](evidence/build-production.log)) |
| Routes vs P1-05 | none removed; added `apple-touch-icon.png`, `images/game_theory_nash_poster.png` ([`evidence/output-diff-production.json`](evidence/output-diff-production.json)) |
| HTML differences | 201 pages differ only in the intended `<head>` metadata, 146 aliases identical, 0 unexplained (`tools/explain-html-diff.py`, [`evidence/html-diff-explained.json`](evidence/html-diff-explained.json)). 79 feeds differ only in the channel description |
| Broken internal references (P1-02 analyzer) | **745 → 140** occurrences, 210 → 10 unique targets; zero missing fragments ([`evidence/static-summary.json`](evidence/static-summary.json)) |
| SEO invariants on all 201 pages (`tools/seo-check.py`) | pass: one canonical each, all canonical/hreflang targets exist, hreflang reciprocal with `x-default`, 12 copied articles point at their original and carry no hreflang, title/description/og:image present, icons and posters resolve, 38 JSON-LD blocks parse (26 BlogPosting with headline, dates, author, publisher, URL, language; 12 WebSite), 5 sitemaps with 193 URLs, search indexes vi 20 / en 20 ([`evidence/seo-check.json`](evidence/seo-check.json)) |
| Same checker on the P1-05 build (negative control) | fails with 792 violations |
| Pixel comparison vs P1-05, 355 states | 339 identical; the 16 others are the two Nash pages, where the video now shows its poster ([`evidence/visual-results.json`](evidence/visual-results.json)). Run before the social-image and publisher values were added; those touch `<head>` only, which the HTML check above confirms |
| MathJax and heatmap runtime | all checks pass; only difference from P1-05 is two fewer console 404s ([`evidence/runtime-comparison.json`](evidence/runtime-comparison.json)) |
| Interaction harness | 8/8 (Nash, TOC, theme, search, code copy), 16 screenshots, no overflow, no page errors ([`evidence/interaction-results.json`](evidence/interaction-results.json)) |

Not tested: Google Rich Results / social-card validators and a live deployment (no access from this environment); structured data was checked for parseability and required fields only.

## Follow-up backlog (not fixed here, by design)

| Issue | Where | Recommended owner |
|---|---|---|
| 23 of 24 `.en.md` files are verbatim copies of the Vietnamese file (two of the "Vietnamese" originals are in fact English). Listed in `evidence/seo-check.json` | `content/**` | Editorial translation; no code change needed afterwards |
| ja/zh-cn have no articles; their menus link to 10 missing pages (140 references) | `config/_default/menus.toml`, `languages.toml` | Maintainer decision: drop the two languages (removes `/ja/`, `/zh-cn/`) or give them their own menus. The taglines added here are translations and need a native check |
| Section and collection index copies under `/en/` still self-canonicalise | list pages | With the translation work |
| 24 duplicate-title groups across languages | content | Editorial |
| Article JSON-LD has an empty `description` and no `image`; `og:title` on archives is the site title | FixIt `head/seo.html`, `head/meta.html` | P1-07, when those partials become site-owned |
| Social image is the square logo with `summary_large_image` | params | Phase 2 asset work (a real 1200×630 card) |
| Heatmap colour defect, Gravatar avatar | recorded in P1-04 | later task |

## Hand-off to P1-07

- Site-owned SEO templates: `layouts/_partials/head/link.html`, `layouts/_partials/site/translation.html`, `layouts/robots.txt`. Keep them when the theme goes; do not restore the theme versions.
- Still from FixIt: `head/meta.html`, `head/seo.html`, `head/script.html`, header, footer, widgets, assets pipeline, taxonomy/term/archives/offline/404/RSS/search templates, render hooks, i18n, SCSS and JS, and the theme's default configuration (output formats, media types, params).
- Configuration to preserve: everything in `config/_default/`; compare `hugo config` with `docs/audits/p1-05/tools/config-diff.py` before and after removing the theme config.
- Regression tests to run: `compare-output.py`, `seo-check.py`, `explain-html-diff.py` (expect zero unexplained), P1-02 `analyze.py` (expect 140 missing references, all ja/zh-cn menu links), `visual-compare.cjs`, P1-04 `runtime.cjs` + `compare.cjs`, P1-02 `baseline.cjs`.
- Do not attribute to the migration: the backlog above.

## Rollback

Revert the merge of this PR, or the single functional commit; no content or URL depends on it.
