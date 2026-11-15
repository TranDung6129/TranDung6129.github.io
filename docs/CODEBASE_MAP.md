# Codebase Map — Where to change what

**Purpose:** Fast, evidence-based navigation for Codex, Claude Code and other agents. Read this before exploring the repository. For durable findings from every file already inspected, see [INSPECTED_FILES.md](INSPECTED_FILES.md). This map is **not** a claim that every future file path is already implemented. Update the map in the same PR whenever files, responsibilities or entry points change.

**Verified baseline:** P1-01 audit merged; initial FixIt architecture, Hugo Extended 0.149.0. See [P1-01 audit](audits/P1-01.md). After migration, do not preserve stale paths: update the **Current path** and status below.

P1-04 introduces site-owned Hugo compatibility templates under `layouts/_default/`, `layouts/posts/`, and `layouts/section.html`; [D-012](DECISIONS.md#d-012--owned-hugo-templates-and-incremental-compatibility) still governs migration and P1-09. These adapters retain FixIt partial dependencies until parity and retirement gates pass.

## State after P1-07 — no theme

FixIt and the bookmark module are gone. Everything the site renders with is in this repository; there is no `themes/` directory, submodule or Hugo module. **Wherever a row below says "FixIt" or "theme", read it as the site-owned file at the same relative path** (`themes/FixIt/layouts/X` → `layouts/X`, `themes/FixIt/assets/X` → `assets/X`). Provenance and licenses: `THIRD_PARTY_NOTICES.md`, `LICENSE-FixIt.txt`.

| Need to change | Entry point | Notes |
|---|---|---|
| Page shell and `<head>` | `layouts/_default/baseof.html`, `layouts/_partials/head/{meta,seo,link,script}.html` | `seo.html` builds JSON-LD; `meta.html` Open Graph/Twitter |
| Header, menus, search box, language and theme switches | `layouts/_partials/header.html` (via `site/header.html`) | Menu data in `config/_default/menus*.toml` |
| Footer, back-to-top and other widgets, cookie notice | `layouts/_partials/footer.html`, `widgets.html`, `assets.html` | |
| Script and stylesheet pipeline, per-page libraries | `layouts/_partials/assets.html`, `plugin/{script,style}.html`, `store/`, `init/` | `init/index.html` sets version/CDN/fingerprint state used everywhere |
| Lists: taxonomy, term, tags, archives; 404; offline | `layouts/taxonomy.html`, `term.html`, `tags.html`, `taxonomies.html`, `home.archives.html`, `404.html`, `home.offline.html` | Output formats in `config/_default/outputFormats.toml`, `outputs.toml` |
| Feeds, sitemap, search index, Markdown twin of a page | `layouts/home.rss.xml`, `section.rss.xml`, `term.rss.xml`, `sitemap.xml`, `home.search.json`, `page.md`, `_partials/feed/` | |
| Markdown rendering (headings, links, images, code blocks, math passthrough) | `layouts/_markup/` | Code-block wrapper and copy button markup come from here plus `assets/js/theme.js` |
| Global styles | `assets/css/style.scss` → `_variables`, `_core/`, `_page/`, `_partials/`, `_shortcodes/`, then `_custom.scss` | Site palette/typography stay in `_custom.scss`; home in `home.scss` |
| Client behaviour (mobile menu, search with Fuse, theme persistence, TOC, code copy) | `assets/js/theme.js`, `assets/js/util.js`, `assets/js/head/color-scheme.js` | Built with Hugo `js.Build`; MathJax loader `assets/js/lib/mathjax.js` |
| Interface strings | `i18n/{vi,en,zh-CN}.toml` | ja has no file and falls back to English |
| Bundled libraries | `assets/lib/`, `static/lib/` | Versions in `THIRD_PARTY_NOTICES.md`; `static/lib/katex` and `lightgallery` are published but unused |
| Shortcodes available to authors | `layouts/shortcodes/react.html` only | FixIt shortcodes were not migrated (list: `docs/audits/p1-07/evidence/templates-not-migrated.txt`) |

## Task routing (read the smallest relevant surface first)

| Need to change | Current entry point(s) | Related files / dependency | Important cautions |
|---|---|---|---|
| Site title, theme, canonical base URL, pagination, section cascade | `config/_default/hugo.toml` | `config/_default/languages.toml`, `params.toml`, `module.toml` | `config/_default/` is the only site configuration since P1-05 (root `hugo.toml` removed); theme defaults still fill gaps until P1-07. Compare `hugo config` with `docs/audits/p1-05/tools/config-diff.py` before and after edits |
| Main navigation | `layouts/_partials/site/header.html`, `config/_default/menus.toml`, `menus.en.toml` | FixIt header partials (delegated) | No finalized V2 menu/homepage; avoid premature overhaul |
| Homepage structure/categories/featured/recent posts | `layouts/index.html` | `assets/css/home.scss` (linked from `<head>` via the `custom-head` block), `layouts/partials/heatmap.html`, site params | Homepage redesign deferred to Phase 3. Home-only CSS lives in `home.scss` since P1-05; the heatmap partial keeps its own inline style |
| Global colors, reading fonts, appearance | `assets/css/_custom.scss` | FixIt `assets/css/style.scss` imports it last; the site `_override.scss` was removed in P1-05 (theme fallback is used) | This is a theme-import layer now; after custom layout migration update this row |
| Long-form article / section rendering | `layouts/posts/single.html`, `layouts/section.html`, `layouts/_default/{single,list}.html` | `layouts/_partials/p1-04/`, FixIt helpers, collection partial; markup/params config | Post and section are active; generic files are fallback. Keep compatibility until feature parity |
| Previous/next chapters or collection labels | `layouts/_partials/single/collection-list.html` | `content/collections/**`, front matter taxonomies | References FixIt helpers; verify both vi/en chapter output |
| Activity heatmap | `layouts/partials/heatmap.html` | `layouts/index.html`, D3/Cal-Heatmap external scripts | Verify browser and theme toggling before modifying |
| Mathematics, code highlight, TOC | `config/_default/markup.toml` (Goldmark extras, math passthrough, highlight, TOC), `params.toml` (`page.math.type = "mathjax"`) | Theme templates, shortcodes, page front matter | Preserve equation and code behavior; rerun `docs/audits/p1-04/runtime/runtime.cjs` after changes |
| English/VI and other language support | `config/_default/languages.toml`, `menus.en.toml` | `content/**/*.en.md`, site language config | Existing four language home outputs do not establish complete translations |
| Blog/chapters text, screenshots, post metadata | `content/<section>/*.md` | section indexes, `static/`, page bundles | Preserve URL/slug; see `docs/audits/p1-01/content-pages.csv` |
| React/interactive Nash visualization | `layouts/shortcodes/react.html` | `assets/js/components/NashEquilibriumSim.jsx`, `package.json`, content Nash articles | React/Recharts **are active**; two shortcode calls; mobile fallback. Never remove dependencies blindly |
| Browser custom JS | none (the starter `assets/js/custom.js` was removed in P1-05) | FixIt asset pipeline builds `assets/js/custom.js` if it exists | Put new behaviour in focused files under `assets/js/`, not a catch-all |
| Logos, avatars, published videos | `static/images/`, `static/videos/` | `content/about/images/`, params, media library | Published URL may exist even when not referenced in Markdown |
| Scientific animation source | `manim/game_theory_nash.py` | `media/` intermediates (128 tracked Manim cache files, not mounted); published MP4 under `static/videos/` | The duplicate MP4 under `media/` and tracked bytecode were removed in P1-05; removing the remaining intermediates needs the author's confirmation. Content poster missing, documented in audit |
| Pre-migration baseline / regression evidence | `docs/audits/P1-02.md`, `docs/audits/p1-02/static/analyze.py`, `test_analyzer.py`, `browser/baseline.cjs` | Frozen P1-01 routes, generated production output, system Chromium + external Playwright install | Capture known defects separately from passing invariants; no runtime source changes; local timings are not field CWV |
| External runtime checks (MathJax, D3/Cal-Heatmap in a real browser) | `docs/audits/p1-04/runtime/runtime.cjs`, `compare.cjs`, `integrity.py` | Environment Playwright/Chromium; network access to `cdn.jsdelivr.net` and `d3js.org`; npm registry tarballs for the integrity cross-check | Never relax certificate validation. Run against baseline and candidate builds and compare; trust-path limits are documented in `docs/audits/p1-04/README.md` |
| Regression tooling for output, config and rendering | `docs/audits/p1-05/tools/`: `compare-output.py` (byte diff of two builds), `config-diff.py` (effective config), `visual-compare.cjs` + `make-routes.py` (pixel comparison), `dead-selectors.cjs`, `home-css-rules.cjs` | Two builds served locally; environment Playwright/Chromium | Build both trees from the same checkout path (source maps embed it). Pixel noise handling and the negative control are described in `docs/audits/p1-05/README.md` |
| Canonical, hreflang, icons, social image, structured-data publisher | `layouts/_partials/head/link.html`, `layouts/_partials/site/translation.html`, `config/_default/params.toml` (`app`, `images`, `page.seo`) | FixIt `head/meta.html` and `head/seo.html` still render description, Open Graph and JSON-LD | Site-owned since P1-06. Untranslated copies canonicalise to the original automatically; run `docs/audits/p1-06/tools/seo-check.py` after any change |
| Search, RSS, sitemap, robots | `config/_default/params.toml`, `outputs.toml`, `sitemap.toml`, `hugo.toml` (`enableRobotsTXT`) | FixIt search/robots templates; the published `robots.txt` comes from site-owned `layouts/robots.txt` since P1-06 | Retain outputs and paths; test generated HTML and index files |
| GitHub Pages builds | `.github/workflows/deploy.yml` | `package.json`, Hugo config, submodules | Action currently pinned Hugo 0.149.0; PR-triggered CI not present at audit |
| Dependency updates | `.github/dependabot.yml` (GitHub Actions and npm, monthly) | `package.json`, workflows | The theme-update workflow and submodules were removed in P1-07; there is no automatic change to site code |
| Local PostgreSQL foundation | `db/README.md`, `compose.yaml`, `db/bin/compose`, `db/bin/migrate` | `db/migrations/`, `db/seed.sql`, `db/tests/integration.sh`; D-010/D-012/D-013 | Demo-only local Postgres; static Hugo does not read it; no hosted provisioning/auth/payments |
| Affiliate, subscriptions, payments (future) | `docs/SEO_AND_MONETIZATION.md`, `docs/CONTENT_MODEL.md` | Future secure service/provider | Not part of P1/P2; no browser secrets or fake secure paywall |
| Visual and editorial assets (new) | `docs/VISUAL_ASSET_GUIDELINES.md` | `docs/ASSET_MANIFEST_TEMPLATE.md` | Rights, factual accuracy, alt, crops and source provenance |

Shell: `layouts/_default/baseof.html` owns the wrapper and delegates `layouts/_partials/site/header.html` and `footer.html` to FixIt. It affects home as well as other page kinds; test all output before changes. Derived FixIt templates retain upstream MIT terms in `layouts/_default/FIXIT-LICENSE.txt`.

P2-01 review-only tokens live at `assets/css/editorial/tokens.css`; [usage and contrast](design/TOKENS.md) and `docs/design/check-token-contrast.py` accompany them. They are not imported in production.

## Current file clusters
- `layouts/`: site-owned Hugo layouts/partials/shortcodes.
- `i18n/`, `assets/lib/`, `static/lib/`: interface strings and bundled libraries (site-owned since P1-07; no `themes/`).
- `assets/css/`, `assets/js/`: authored style, JS and React components.
- `content/`: authored Markdown and page bundle assets (preserve).
- `static/`: files exposed directly as URLs; don't delete based on source-reference search alone.
- `config/_default/`: the only site configuration (root `hugo.toml` was folded in by P1-05).
- `docs/audits/p1-01/`: detailed inventory, shortcode-use manifest, full config matrix, build/route comparison, evidence.
- `manim/`, `media/`: science-video source and generated intermediates; not the Hugo runtime by default.
- `docs/`: product decisions, task board, runbooks and this map.

## Required workflow — avoid whole-codebase rereads
1. Read `AGENTS.md`, `docs/TASK_BOARD.md`, then **this map**. Consult architecture/design and relevant audit subsection, not every file.
2. Identify the narrow responsibility and inspect its listed entry points and direct consumers only. Use `rg`/targeted search if the map lacks information.
3. Verify the exact current code path before editing; if moved/renamed, correct this map **in the same PR**. When opening **any** file, opportunistically record its purpose, important symbols, dependencies and version in INSPECTED_FILES.md (mark PARTIAL if not fully read).
4. Implement and run scoped tests + required quality gates. Update `AGENT_LOG.md` with actual evidence.
5. Add a `Change impact` note in PR: affected feature, owning files, dependencies, test, new location, known caveats.
6. Do **not** create a new comprehensive inventory per task. Compare recorded Git blob SHA with the working version; if unchanged, reuse the file summary, and if changed, review changed hunks plus affected dependencies. Re-audit only when the map becomes stale or a dependency is unverified.
7. If design/architecture changed, update `docs/DECISIONS.md` and relevant documentation as well.

## Modification record template (append short entries here, most recent first)
| Date | PR/commit | Feature area | Former path → current path | Why / tests |
|---|---|---|---|---|
| 2026-11-15 | P1-09 local PostgreSQL | Database reference foundation | New `db/` and `compose.yaml` | Ordered migrations, synthetic seed and isolated restore test; Hugo remains static |
| 2026-11-15 | P1-07 FixIt retirement | Whole rendering stack | `themes/FixIt/{layouts,assets,i18n,static}` → `layouts/`, `assets/`, `i18n/`, `static/`; theme config → `config/_default/{outputs,outputFormats,params}.toml`; submodules, `.gitmodules`, `update-theme.yml` removed | 647/647 output files equivalent, 355/355 pixel states, see `docs/audits/p1-07/` |
| 2026-11-15 | P1-06 metadata/SEO | Head links, robots, icons | FixIt `head/link.html` and `robots.txt` → site-owned `layouts/_partials/head/link.html`, `layouts/robots.txt`; new `site/translation.html` | `docs/audits/p1-06/` |
| 2026-11-15 | P1-05 cleanup | Configuration, site CSS, unused files | root `hugo.toml` → `config/_default/{hugo,module,markup,params}.toml`; inline home CSS → `assets/css/home.scss`; removed `_override.scss`, `custom.js`, `KalmanFilterSim.jsx`, root `robots.txt`, bytecode, duplicate MP4 | Effective config, byte diff, CSSOM and 355-state pixel comparison in `docs/audits/p1-05/` |
| 2026-11-15 | P1-04 runtime gate | Test/evidence entrypoints | New `docs/audits/p1-04/runtime/` | MathJax/Cal-Heatmap browser harness, baseline comparison and npm integrity check; no application owner moved |
| 2026-11-15 | P1-04 compatibility | HTML shell, post and section | FixIt layout entrypoints → `layouts/_default/`, `layouts/posts/`, `layouts/section.html` | Preserve output via theme partials; see P1-04 evidence |
| 2026-11-15 | P1-02 baseline | Test/evidence entrypoints | New `docs/audits/p1-02/` | Static route/link/metadata fixture + Chromium capture; no application owner moved |
| 2026-11-15 | P1-01 audit / PR #13 | Inventory only | No runtime path changed | 645 emitted files unchanged per audit |

**Maintenance rule:** any PR that renames, adds, deletes or changes responsibility of a component MUST update this map. Reviewer should request changes if navigation docs are stale. Keep it concise: this is a routing index, not copied source code.
