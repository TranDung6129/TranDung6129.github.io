# P1-07 — FixIt retirement

Claude Code, 2026-11-15. Branch `feat/p1-07-retire-fixit` from `main` `4d97a92` (P1-04/05/06/09 merged). The site now builds with no theme, submodule or Hugo module. Appearance and behaviour are unchanged; nothing was redesigned and no content was edited.

## Checkpoints

| Checkpoint | Commit | Result |
|---|---|---|
| A. Dependency map | (evidence in E) | `strace` of production and development builds: Hugo opened 309 of the 3,334 theme files ([`evidence/theme-files-opened.txt`](evidence/theme-files-opened.txt)) |
| B. Templates | `e8c5d44`| 72 FixIt templates the build executes are site-owned; 52 never executed were not kept ([`evidence/templates-not-migrated.txt`](evidence/templates-not-migrated.txt)); the six files the site already overrode are unchanged |
| C. CSS, JS, assets, i18n, config | `e8c5d44`| 92 asset files, 3 i18n files, 74 static files; output formats, outputs and the theme param defaults the templates read moved to `config/_default/` |
| D. Removal | `a0167aa` | Both submodules, `.gitmodules`, `update-theme.yml`, deploy coupling, Dependabot submodule entry, starter `package.json` metadata and READMEs removed |
| E. Regression and docs | this commit | below |

## Dependency map (what came from FixIt and where it lives now)

| Function | Site-owned location |
|---|---|
| Document shell, head (meta, SEO/JSON-LD, links, scripts) | `layouts/_default/baseof.html`, `layouts/_partials/head/`|
| Header, navigation, language/theme switch, search box, footer, widgets | `layouts/_partials/header.html`, `footer.html`, `widgets.html`, `layouts/_partials/site/` adapters |
| Article, section, taxonomy, term, tags, archives, offline, 404 | `layouts/posts/single.html`, `section.html`, `taxonomy.html`, `term.html`, `tags.html`, `taxonomies.html`, `home.archives.html`, `home.offline.html`, `404.html`, `layouts/_partials/single/`, `recently-updated.html`, `paginator.html`|
| RSS, sitemap, search index, Markdown output | `layouts/home.rss.xml`, `section.rss.xml`, `term.rss.xml`, `sitemap.xml`, `home.search.json`, `page.md`|
| Markdown render hooks (headings, links, images, code blocks, passthrough math) | `layouts/_markup/`|
| Initialisation, params, icons, script/style pipeline | `layouts/_partials/init/`, `function/`, `plugin/`, `store/`, `assets.html`|
| Styles | `assets/css/` (`style.scss` entry; `_custom.scss`, `home.scss` are the site's own) |
| Behaviour (menu, search, theme switch, TOC, code copy, lightgallery hooks) | `assets/js/theme.js`, `util.js`, `head/color-scheme.js`, `lib/mathjax.js`|
| Bundled libraries | `assets/lib/`, `static/lib/` — see `THIRD_PARTY_NOTICES.md`|
| Interface strings | `i18n/en.toml`, `vi.toml`, `zh-CN.toml` (ja falls back to English, as before) |
| Config defaults | `config/_default/outputs.toml`, `outputFormats.toml`, additions in `params.toml`|

The bookmark module contributed nothing to the output: its head injector only emitted CSS for a shortcode no page uses.

## Verification (theme-free build vs merged `main` with FixIt)

Hugo Extended 0.149.0, headless Chromium 153.0.8010.12, certificate validation on.

| Check | Result |
|---|---|
| Build without any theme | A fresh clone of this branch (no submodules, `npm ci`) builds production with zero warnings ([`evidence/build-production-fresh-clone.log`](evidence/build-production-fresh-clone.log)); development build passes |
| Production output | 647/647 files, none added or removed; byte-identical except two Sass source maps that differ only in the embedded source path (`tools/compare-normalised.py`, [`evidence/output-production.json`](evidence/output-production.json)) |
| Development output | 650/650 files; six files differ only in embedded source paths ([`evidence/output-development.json`](evidence/output-development.json)) |
| Effective configuration | 584 keys identical in all 4 languages × 2 environments; the 37 keys no longer present are the theme list/module import, the bookmark injector, two unused output formats and defaults of features with no template left (analytics providers, CSE, mermaid, postChat, postSummary, KaTeX) — [`evidence/config-effective-diff.txt`](evidence/config-effective-diff.txt). Output identity shows none is read |
| Routes, links, feeds, search (P1-02 analyzer) | `summary.json` byte-identical to the pre-migration run: 201 pages, 146 aliases, 156 XML, 140 known broken references (ja/zh-cn menus) |
| SEO invariants (`docs/audits/p1-06/tools/seo-check.py`) | pass on 201 pages |
| Pixel comparison | **355/355 states identical** (201 pages at 1440 px light; 22 routes at 360/768/1024/1440 px, light and dark) — [`evidence/visual-results.json`](evidence/visual-results.json) |
| MathJax and Cal-Heatmap runtime | all checks pass, no difference from the pre-migration run ([`evidence/runtime-comparison.json`](evidence/runtime-comparison.json)) |
| Interaction | 8/8: Nash preset and keyboard slider, TOC, theme toggle and persistence, search, code rendering and copy; 16 screenshots, no horizontal overflow, no page errors |
| Keyboard / reduced motion sample | focus order and visible outline as before at 360 and 1440 px; mobile fallback for the Nash simulation shown at 360 px |

Not tested here: a live GitHub Pages deployment and an end-user browser on the public internet (P1-08). Accessibility conformance is not certified.

## Intentional changes

None in the published site. Repository-level: no daily theme auto-update, deploy no longer triggered by it, npm added to Dependabot.

## Left as is (not regressions)

- Footer credit and the home-page `<meta name="theme">` still name FixIt and its version; the code is derived from it, and changing visible text is a Phase 2 decision.
- `static/lib/katex/` and `static/lib/lightgallery/` are published but unused by current pages; kept so no public URL disappears. Candidate cleanup in P1-08/Phase 2.
- 52 FixIt templates were not migrated (admonition, details, mermaid, echarts, music, mapbox and similar shortcodes, alert blockquotes, encryption, friends page). No content uses them; an article that calls one fails the build with a clear error and the file can be restored from FixIt `f5fb989`.
- 128 Manim intermediates under `media/`: untouched.
- Defects recorded earlier: ja/zh-cn menus, untranslated English copies, heatmap colours, empty JSON-LD description, Gravatar host in the test environment.

## Rollback

Revert the merge of this PR: the submodule pins, workflow and theme config return and the migrated files disappear. `main` before the merge is the last FixIt-based state.

## Hand-off to P1-08

- Run after merge: the deploy workflow on `main` (first run without submodules), then a live smoke test of home (4 languages), one math article, the Nash page, search, RSS, sitemap, robots from a normal browser.
- Regression tools: `docs/audits/p1-05/tools/` (`compare-output.py`, `config-diff.py`, `visual-compare.cjs`), `docs/audits/p1-06/tools/seo-check.py`, `docs/audits/p1-04/runtime/`, `docs/audits/p1-02/` harnesses, `docs/audits/p1-07/tools/compare-normalised.py`.
- Build both trees from the same checkout path, with full Git history (`enableGitInfo` feeds `lastmod`; a shallow clone changes dates).
- Decisions still open for the maintainer: ja/zh-cn languages, Manim intermediates, unused `static/lib` files, FixIt credit in the footer.
