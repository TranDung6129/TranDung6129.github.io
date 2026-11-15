# P1-05 — configuration and CSS consolidation, unused-file removal

Claude Code, 2026-11-15. Branch `chore/p1-05-css-config-cleanup`, stacked on `feat/p1-04-hugo-templates` (PR #19) because P1-04 is verified but not yet merged. Baseline for every comparison is the P1-04 branch state, whose production output is byte-identical to `main` `0eb0450`.

Nothing here changes a public page URL, content, translation, navigation, interaction or the visual result. No theme is removed (P1-07), no metadata is corrected (P1-06) and no database file is touched (P1-09).

## What changed

| Area | Change | Proof |
|---|---|---|
| Configuration | Root `hugo.toml` (1,414 lines, FixIt starter copy) deleted. The seven key groups it alone contributed moved into `config/_default/`: `pagination.pagerSize` and the subject-section `cascade` → `hugo.toml`; `module.hugoVersion` → new `module.toml`; Goldmark `extras` and math `passthrough` → `markup.toml`; `page.math.type = "mathjax"` → `params.toml` | [`evidence/config-root-contribution.txt`](evidence/config-root-contribution.txt), [`evidence/config-effective-diff.txt`](evidence/config-effective-diff.txt); output byte-identical after this step |
| Configuration | Deprecated `privacy.twitter.enableDNT` dropped; `privacy.x.enableDNT` in `privacy.toml` already covers it | Only effective-config difference; the Hugo deprecation warning is gone |
| Site CSS | `assets/css/_custom.scss`: second, identical `.single .content, .post-content` rule removed; dead `.collection-navigation` block and its media query removed; class names emitted nowhere (`.site-title`, `.post-content`, `.post-card`) dropped from selector lists | [`evidence/css-rule-diff.txt`](evidence/css-rule-diff.txt), [`evidence/dead-selectors.json`](evidence/dead-selectors.json) |
| Site CSS | `assets/css/_override.scss` (comments only) deleted; the theme imports its own identical fallback | compiled CSS unaffected by this file |
| Home CSS | 290-line inline `<style>` in `layouts/index.html` moved to `assets/css/home.scss`, linked from `<head>` through the `custom-head` block; 15 rules of a removed three-column layout dropped; leftover `DEBUG` template comment removed | [`evidence/home-css-rules.json`](evidence/home-css-rules.json) |
| Unused files | `assets/js/custom.js` (starter greeting), `assets/js/components/KalmanFilterSim.jsx` (mock, no consumer), repository-root `robots.txt` (not mounted, pointed at `example.org`), `manim/__pycache__/*.pyc`, `media/videos/game_theory_nash/720p30/game_theory_nash.mp4` (byte-identical to the published `static/videos/` copy) | below |

## Intentional output differences (complete list)

Production, 645 files before and after ([`evidence/output-diff-production.json`](evidence/output-diff-production.json)); development is the same set over 648 files ([`evidence/output-diff-development.json`](evidence/output-diff-development.json)).

- **Removed:** `js/custom.min.js`. It only logged `custom.js: Hello FixIt!`; nothing reads `window.fixitBlog`.
- **Added:** `css/home.min.css` (2,654 bytes).
- **Changed:** `css/style.min.css` and its source map (172,558 → 170,511 bytes, 1,563 → 1,547 rules); all 201 HTML pages lose the `<script src=/js/custom.min.js defer>` tag, and that tag is the *only* difference in 197 of them ([`evidence/html-diff-explained.json`](evidence/html-diff-explained.json)); the four home pages additionally swap the inline block for the `<head>` link and shrink by about 4.3 kB each.
- Feeds, sitemaps, search indexes, aliases, images, fonts and every other asset are byte-identical.

## Verification

Environment: Hugo Extended 0.149.0, Node 22.23.4, Playwright 1.63.0, headless Chromium 153.0.8010.12, default launch options (certificate validation on). Tools are in [`tools/`](tools/); each exits nonzero on failure.

1. **Effective configuration** — `hugo config --format json --lang <vi|en|ja|zh-cn> --environment <production|development>` before and after, compared with `tools/config-diff.py`: 619 keys each, identical except the deprecated `privacy.twitter` key, in all eight combinations.
2. **Config step in isolation** — after deleting the root file and before any CSS change, `tools/compare-output.py` reported production (645) and development (648) output byte-identical to the baseline.
3. **Static baseline analyzer** — `python3 docs/audits/p1-02/static/analyze.py <build> <out> docs/audits/p1-02/static/routes.txt docs/audits/p1-01/content-pages.csv`: 83 of 86 summary metrics equal the committed P1-02 values, including 645 emitted files, 347 HTML, 745 missing-reference occurrences and 210 unique missing targets. The three differences are the two intended route changes and the resulting internal-reference count (11,202 → 11,005). The analyzer exits 1 by design when routes change; see [`evidence/static-summary-diff.json`](evidence/static-summary-diff.json). `test_analyzer.py` passes.
4. **Dead selectors** — `tools/dead-selectors.cjs` loads all 201 non-alias pages in Chromium and counts matches: zero for every removed class sitewide, and zero on the four home pages for the three home-only class names that the theme still uses on chapter pages.
5. **Home rules through the CSSOM** — `tools/home-css-rules.cjs`: the browser parses 39 rules from the old inline block and 24 from `css/home.min.css`; the 24 are the same rules in the same order, the other 15 are the dead ones. The link sits after the theme stylesheets as before. It now precedes the Cal-Heatmap stylesheet and the heatmap partial's inline style instead of following them; the tool shows those two sheets share **zero** (element, property) pairs with the home rules, so the reordering cannot change a computed style.
6. **Pixel comparison** — `tools/visual-compare.cjs` takes full-page screenshots of the baseline and the new build: all 201 pages at 1440 px light plus 22 representative routes at 360/768/1024/1440 px in light and dark, 355 states. **355/355 identical** (same size, zero differing pixels); see [`evidence/visual-results.json`](evidence/visual-results.json).
   - Self-test: the same build on two ports gives 176/176 identical ([`evidence/visual-selftest.json`](evidence/visual-selftest.json)).
   - Negative control: appending `.single-title{letter-spacing:.011em}` to one build is detected on the article page (9,457 differing pixels, exit 1) and not on the home page ([`evidence/visual-negative-control.json`](evidence/visual-negative-control.json)).
   - Noise handling, stated plainly: two captures of the *same* build occasionally differ by one pixel at one colour level on image-heavy pages, so a mismatch is retried and finally rechecked serially. In the final run two About-page dark states showed exactly that under parallel load and were identical on the serial recheck; three separate focused runs of the About pages were 16/16 identical. A real difference never becomes identical on retry, as the negative control shows.
   - Determinism aids applied equally to both builds: fixed `Math.random` (the 404 page picks a random kaomoji), a scroll pass and eager image loading, reduced motion.
7. **Runtime and interaction** — `docs/audits/p1-04/runtime/runtime.cjs` on the new build: all checks pass and `compare.cjs` finds no difference from the P1-04 results (MathJax 674/674 on 16 pages, heatmap on four home languages in both themes) — [`evidence/runtime-comparison.json`](evidence/runtime-comparison.json). The P1-02 interaction harness: 8/8 checks, 16 screenshots, no horizontal overflow — [`evidence/interaction-results.json`](evidence/interaction-results.json). `compare.cjs` now compares response hashes only for URLs captured in both runs, because a font body is occasionally unavailable after navigation.
8. **Unused files** — `git grep` finds no reference to `KalmanFilter`, `fixitBlog` or the root `robots.txt` outside the removed files; `sha256sum` of the two Nash videos is `10a2da74…145b` for both; none of these paths is a Hugo mount. Build logs: [`evidence/build-production.log`](evidence/build-production.log), [`evidence/build-development.log`](evidence/build-development.log) (zero warnings in production; the one development warning is the theme's version banner).

Reproduce:

```sh
npm ci
hugo --gc --minify --destination /tmp/p105-prod            # this branch
git stash -u; git checkout feat/p1-04-hugo-templates       # or a second worktree at the same path depth
hugo --gc --minify --destination /tmp/p104-prod; git checkout -; git stash pop
python3 docs/audits/p1-05/tools/compare-output.py /tmp/p104-prod /tmp/p105-prod --show 20
python3 -m http.server 1314 --bind 127.0.0.1 --directory /tmp/p104-prod &
python3 -m http.server 1315 --bind 127.0.0.1 --directory /tmp/p105-prod &
python3 docs/audits/p1-05/tools/make-routes.py /tmp/p104-prod /tmp/routes.json
BASE_A=http://127.0.0.1:1314 BASE_B=http://127.0.0.1:1315 OUT=/tmp/visual node docs/audits/p1-05/tools/visual-compare.cjs /tmp/routes.json
BASE=http://127.0.0.1:1314 node docs/audits/p1-05/tools/dead-selectors.cjs /tmp/routes.json /tmp/dead.json
BASE_A=http://127.0.0.1:1314 BASE_B=http://127.0.0.1:1315 node docs/audits/p1-05/tools/home-css-rules.cjs /tmp/home-css.json
```

Build both trees from the same checkout path: Sass source maps embed the absolute path.

## Deliberately not done here

| Item | Why it waits |
|---|---|
| `config/_default/params.toml` still repeats many theme defaults | Once FixIt's own `hugo.toml` disappears in P1-07 these values must come from the site, so trimming them now would be undone there |
| The other 128 tracked Manim intermediates under `media/` | The P1-01 ledger asks the author to confirm no authoring hand-off is needed. They are not mounted or published; only the byte-identical duplicate video was removed. **Maintainer decision requested** |
| Inline `<style>` in `layouts/partials/heatmap.html` | It must follow the Cal-Heatmap stylesheet loaded by the same partial; the widget also has the colour defect recorded in P1-04 and is better handled as one unit |
| `package.json` starter metadata and `update:theme`, `assets/jsconfig.json` theme path, stale `hugo.toml` entry in the `deploy.yml` path filter, Dependabot assignee, starter READMEs | Tied to the theme retirement; handled in P1-07 |
| `frontmatter.toml` `:defalut` typo, starter taglines in `languages.toml`, robots policy | Metadata and SEO defaults; handled in P1-06 |
| npm dependencies | None is unused: React, ReactDOM and Recharts build the Nash simulation |

## Rollback

Four independent commits after the claim: config (`4d82bd4`), CSS (`0b575ae`), unused files (`7d83d78`), evidence/docs. Reverting the merge of this PR restores the P1-04 state exactly; reverting a single commit restores that area. The deleted files remain in Git history.

## Unchanged known defects

The P1-02 link/metadata/asset defects, the missing Nash poster, the relative favicon path and the heatmap colour behaviour recorded in P1-04 are untouched. The Gravatar avatar host is not allow-listed in the verification environment. This report does not certify accessibility conformance, production Core Web Vitals or a live deployment.
