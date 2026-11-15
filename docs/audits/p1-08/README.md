# P1-08 — Phase 1 final regression and deployment sign-off (pending live smoke)

**Reviewed:** 2026-11-15. **Status: BLOCKED** only on independent public-site HTTP/browser smoke and final maintainer sign-off. This report deliberately distinguishes deployment-success evidence from actual end-user verification.

## Scope and baseline
- Last theme-based `main`: `4d97a92ce18d524ffc1de96b69b4d87f24b02cb4`.
- Theme-free P1-07 merged `main`: `e5269a0e5202133d20c4dfcf331c048bd3590401`, PR #23.
- Dependencies: P1-02 baseline, P1-04..P1-07 migration, P1-09 local database foundation are merged and recorded DONE. Public Hugo remains independent of PostgreSQL.

## Verified evidence
1. **Real GitHub Actions production deploy, not an inferred deploy:** [run 43706336488](https://github.com/TranDung6129/TranDung6129.github.io/actions/runs/43706336488), head SHA `e5269a0`, completed `success`. Build job 132788124143: checkout, Hugo 0.149.0 install, Node/npm ci, Hugo build, Pages artifact upload all success. Deploy job 132788200588: Pages deployment success; log says `Reported success!` and evaluates `https://trandung6129.github.io/`.
2. Artifact `github-pages` ID 14157718813 uploaded successfully, 41,838,220 compressed bytes, SHA-256 `a8580124021c1d7104821220b942fb432e557c0f61f628540e5b6ad4b2dd8fd5` reported by GitHub.
3. **Local/offline parity evidence evaluated, not independently rerun in this integration:** [P1-07 report](../p1-07/README.md): 647/647 production output paths identical and only two Sass source maps changed embedded source paths; 650/650 dev outputs (six source-map path differences); 355/355 identical browser screenshot states; MathJax/Cal-Heatmap runtime comparison identical; P1-02 interactions 8/8; SEO invariant checker PASS on 201 pages; route/internal-reference analyzer unchanged vs pre-migration build. Existing known ja/zh-cn menu references and other placeholders are not regressions.
4. **GitHub Pages workflow:** `.github/workflows/deploy.yml` no longer requires submodules; GitHub job completed without them. License and third-party notices remain, and theme submodule pointers were removed (PR #23).

## Outstanding, must verify before P1-08 DONE
Direct public-site requests from this review environment to `https://trandung6129.github.io/`, `/en/`, Nash, `/robots.txt`, and `/sitemap.xml` could not connect (tool access/network DNS failures). These errors do not establish a production outage, but they also cannot be treated as a passing browser smoke test.

In a trusted browser/network, inspect and record HTTP status, response/content type, screenshot and console/network errors for:
- Home `/`, `/en/`, `/ja/`, `/zh-cn/` (distinguish intentionally empty language pages from errors);
- An actual math article with visibly typeset formula;
- `/kinh-te/game_theory_nash/` (and English variant if present), poster, Nash interactions and responsive fallback;
- Site navigation/search, TOC, code-copy, theme toggling and persistence;
- `/robots.txt`, `/sitemap.xml`, RSS and search-index JSON, plus favicon/icon and key script/style assets.
Test both a mobile and desktop viewport in light/dark. Re-run/inspect deployed-site SEO canonical and hreflang, noting placeholder translations and 140 known ja/zh-cn menu references rather than silently waiving new failures.
Capture representative screenshots, browser console and HTTP status evidence and link in this report/AGENT_LOG.

## Known non-blocking technical debt and decisions
- Content is temporary placeholder; owner prioritizes visual/design implementation over translating or polishing articles.
- 23/24 English Markdown copies and ja/zh-cn empty content: editorial backlog, not P1-08 failure; existing menu dead ends should be documented.
- 128 tracked Manim intermediate media files remain; do not delete without authoring verification.
- Unused `static/lib/katex/` and `static/lib/lightgallery/` kept to preserve existing URLs.
- FixIt attribution remains intentionally; derivative MIT attribution is retained.
- Existing heatmap colour and empty JSON-LD description are historical defects, not new regressions.
- GitHub Actions log warns that some Actions target deprecated Node.js 20 and run on Node.js 24; follow up on supported Action versions as maintenance, not a build failure.

## Rollback and reproducibility
- First choice on regression: revert PR #23 merge commit `e5269a0` on `main`, restore old Git submodule setup/workflow (including `git submodule update --init --recursive`), build and redeploy. Assess any intervening commits before reverting; do not force-reset shared main or bypass rollback review.
- For full Phase-1 rollback, identify the relevant merge commits (#19, #20, #22, #21, #23) and revert in reverse dependency order on a fresh branch with a build/deploy check.
- Build comparisons should use the same checkout path and full Git history (`enableGitInfo` changes lastmod under shallow clones). Keep test logs attached to the PR/commit.
- P1-09 recovery remains local migration/backup/restore, independent from GitHub Pages; never use demo credentials or destructive test commands against production data.

## Exit criterion
Mark **P1-08 DONE** only after a reviewer provides trustworthy direct live browser/HTTP smoke evidence, validates no newly introduced regression, records exact URLs/screenshots and signs off. Deployment log alone is insufficient.
