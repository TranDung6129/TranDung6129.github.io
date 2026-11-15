# P1-08 — Phase 1 final regression and deployment sign-off

**Status: DONE** (verification complete; Phase 1 ready for the maintainer's final acceptance). Verified 2026-11-15 by Claude Code against the **public site** `https://trandung6129.github.io/`, not localhost.

## Deployment under test

| Item | Value |
|---|---|
| `main` HEAD | `3569afe30e47d50f5762f20df5ca698719a6fbcb` (merge of PR #32, P2 accepted design) |
| Workflow | `.github/workflows/deploy.yml`, [run 43733870614](https://github.com/TranDung6129/TranDung6129.github.io/actions/runs/43733870614), push to `main`, conclusion **success**, finished 16:10:12 UTC |
| Live response | `last-modified: Sun, 15 Nov 2026 16:10:08 GMT` on `/`, i.e. this run's artifact |
| Proof that live = this commit | every one of the 647 files of a local `hugo --gc --minify` build of `3569afe` (full Git history, Hugo 0.149.0) was fetched from the live site: **647 × HTTP 200, 645 byte-identical**; the other two are Sass source maps whose only difference is `sourceRoot` (CI checkout path) — [`evidence/live-mirror.json`](evidence/live-mirror.json) |
| Phase 2 isolation | the build of `3569afe` is equivalent to the P1-07 theme-free build (same 647 paths; only the two source-map paths differ) — [`evidence/output-vs-p1-07.json`](evidence/output-vs-p1-07.json). The P2 specimen does not reach the published site |

## Access and trust path

The earlier blocker was this environment's egress allowlist (proxy CONNECT 403). The maintainer's cloud environment `epistemic-diary` now allows exactly `trandung6129.github.io` (plus the two CDN hosts used before). Certificate verification was never relaxed: `curl` and Python used the system trust store, Chromium ran with default options. The certificate presented for the site was the public one (`CN=*.github.io`, issuer Let's Encrypt `YR1`, TLS 1.3, valid to 2026-12-29). DNS is resolved by the egress proxy; the container has no direct resolver, so no local DNS lookup was possible. `http://` and an unknown path were checked through the proxy only where it allows them (`/does-not-exist/` → 404 `text/html`; `/kinh-te/game_theory_nash` → 301 to the trailing-slash URL).

## Results by category

### 1. Verified PASS

| Area | Evidence |
|---|---|
| Routes and HTTP | 647/647 paths 200 with expected content types; key routes below |
| Static analysis of the live tree (P1-02 analyzer) | 201 pages, 146 aliases, 156 XML parse, 0 missing fragments; 140 broken references, all the 10 known ja/zh-cn menu targets — identical to P1-07 ([`evidence/static-summary-live.json`](evidence/static-summary-live.json)) |
| SEO on the live tree (`docs/audits/p1-06/tools/seo-check.py`) | PASS on 201 pages: one canonical each, targets exist, hreflang reciprocal with `x-default`, 12 untranslated copies canonicalised to the original, title/description/og:image present, icons and poster resolve, 38 JSON-LD blocks parse; 5 sitemaps, 193 URLs; search indexes vi 20 / en 20 / ja 0 / zh-cn 0 ([`evidence/seo-check-live.json`](evidence/seo-check-live.json)) |
| MathJax (live) | MathJax 3.2.2 typesets 674/674 math items on 16 pages; no overflow at 360 and 1440 px, light and dark |
| Cal-Heatmap (live) | D3 3.5.17 + Cal-Heatmap 3.3.10, 6 month domains, 183 cells, tooltip, four home languages × two themes ([`evidence/runtime-results-live.json`](evidence/runtime-results-live.json)) |
| Browser matrix (live) | 6 pages (home vi/en/ja, math article, Nash, code article) × 390/768/1440 px × light/dark = 36 states: all 200, correct theme, no horizontal overflow, no page errors, no failed own-site request ([`evidence/live-smoke.json`](evidence/live-smoke.json)) |
| Interactions (live) | desktop menu links (all 200), desktop search, theme toggle + persistence after reload, TOC anchor, code expand + clipboard copy (311 characters), Nash preset (Matching Pennies → p* = q* = 0.500) and keyboard slider, Nash poster image and video (`video/mp4`), Nash mobile fallback at 390 px, mobile menu open/close, mobile search, keyboard Tab focus with visible outline — **15/15 checks** |

Key routes (full list in `live-mirror.json`):

| URL | Status | Content type |
|---|---:|---|
| `/`, `/en/`, `/ja/`, `/zh-cn/` | 200 | `text/html; charset=utf-8` |
| `/robots.txt` | 200 | `text/plain; charset=utf-8` |
| `/sitemap.xml`, `/vi/sitemap.xml`, `/en/sitemap.xml` | 200 | `application/xml` |
| `/index.xml`, `/en/index.xml` (RSS) | 200 | `application/xml` |
| `/search.json`, `/en/search.json`, `/ja/search.json` | 200 | `application/json; charset=utf-8` |
| `/favicon.ico`, `/apple-touch-icon.png`, `/images/logoted.png` | 200 | image types |
| `/css/style.min.css`, `/css/home.min.css` | 200 | `text/css` |
| `/js/theme.min.js`, `/js/mount-react-root-NashEquilibriumSim-0.js` | 200 | `application/javascript` |
| `/images/game_theory_nash_poster.png`, `/videos/game_theory_nash.mp4` | 200 | `image/png`, `video/mp4` |

Browser: headless Chromium 153.0.8010.12 (Playwright 1.63.0). Screenshots: [`evidence/screenshots/`](evidence/screenshots/) — home, math article and Nash page at 390/768/1440 px in light and dark, the open mobile menu, mobile search, and the live heatmap.

### 2. Existing non-blocking issues (present before Phase 1 or recorded earlier; unchanged)

- ja/zh-cn menus link to 10 missing pages (140 references); ja/zh-cn have no articles; 23 of 24 English files are copies. Placeholder content, editorial backlog.
- **Dark-mode page background is FixIt's `#292A2E`, not the documented `#1A1816`.** `_custom.scss` sets `--global-bg-color`, but the compiled base style paints `body` from FixIt's Sass variable. The pre-migration FixIt build renders the same colour, so this is not a regression; recorded here for Phase 2 tokens (first identified in this task).
- Heatmap colours ignore the theme and mark empty days; article JSON-LD has an empty `description`; footer credits FixIt; unused `static/lib/katex` and `lightgallery` remain published; 128 Manim intermediates remain tracked.
- After Escape the desktop search dropdown closes but the typed text stays in the box (observation, same behaviour as before).

### 3. Newly introduced regressions

**None found.** Live output equals the build of the deployed commit, which equals the P1-07 build verified against the pre-migration site (647/647 paths, 355/355 pixel states in P1-07).

### 4. Environment-limited / unverified

- `www.gravatar.com` (author avatar in article bylines) is not on the environment allowlist: 20 failed third-party requests, the alt text shows instead. Not verified live; cosmetic and third-party.
- `ERR_ABORTED` on `game_theory_nash.mp4` is the browser cancelling ranged video requests, not a failure (the file returns 200 `video/mp4`).
- Not tested: real mobile devices and browsers other than Chromium, screen-reader behaviour, Core Web Vitals in the field, Google Rich Results / social-card validators.

## Rollback readiness

- **Known-good production state:** `3569afe` (this verification). Previous successful deploys: `e5269a0` (P1-07, run 43706336488), `22bf4d8` (P1-06, run 43703867415), `8fc172d` (P1-04, run 43703834937). The P1-05 run 43703850390 was cancelled by the next push; its content shipped with the P1-06 run.
- **Phase 1 merge commits:** #19 `8fc172d`, #20 `8ba4ccb`, #22 `22bf4d8`, #21 `4d97a92` (P1-09, database only), #23 `e5269a0`; Phase 2 integration #32 `3569afe`.
- **Procedure:** on a new branch from `main`, `git revert -m 1 <merge-sha>` for the offending merge (newest first if several, e.g. #32 → #23 → #22 → #20 → #19), resolve conflicts, run `npm ci && npm run build`, compare with `docs/audits/p1-05/tools/compare-output.py` and run `docs/audits/p1-06/tools/seo-check.py`, open a PR, merge. The merge triggers `deploy.yml`; a manual `workflow_dispatch` re-runs it. Reverting #23 brings back the FixIt submodules and the `submodules: true` checkout in `deploy.yml` (verified in `e5269a0^1`); confirm both are present in the revert before merging. Never force-push or reset `main`.
- **Verify a restored deployment:** wait for the run to succeed, then `python3 docs/audits/p1-08/tools/live-mirror.py <local build of the restored commit> https://trandung6129.github.io <dir> <report>` (expect all 200 and byte identity apart from source maps) and `BASE=https://trandung6129.github.io node docs/audits/p1-08/tools/live-smoke.cjs`.
- **Database independence:** the public site never reads PostgreSQL; a site rollback needs no database action and a database problem cannot take the site down. Local database recovery follows `db/README.md` (backup/restore drill with `pg_dump`/`pg_restore`, compensating migrations, never editing applied migrations). No hosted database exists.

## Reproduce

```sh
npm ci && hugo --gc --minify --destination /tmp/local-3569afe        # full Git history
python3 docs/audits/p1-08/tools/live-mirror.py /tmp/local-3569afe https://trandung6129.github.io /tmp/live /tmp/live-mirror.json
python3 docs/audits/p1-06/tools/seo-check.py /tmp/live content /tmp/seo.json
python3 docs/audits/p1-02/static/analyze.py /tmp/live /tmp/live-static docs/audits/p1-02/static/routes.txt docs/audits/p1-01/content-pages.csv  # exits 1 by design (route set changed in P1-05/06)
BASE=https://trandung6129.github.io OUT=/tmp/rt node docs/audits/p1-04/runtime/runtime.cjs
BASE=https://trandung6129.github.io OUT=/tmp/smoke node docs/audits/p1-08/tools/live-smoke.cjs
```

The environment needs `trandung6129.github.io`, `cdn.jsdelivr.net` and `d3js.org` reachable.

## Acceptance decision

All P1-08 acceptance criteria are met with live evidence: deployment identified and successful, public routes and assets served, scientific content, Nash simulation, navigation, search, theme and metadata verified at 390/768/1440 px in both themes, no new regression, rollback procedure documented. **P1-08 DONE.** Phase 1 is ready for the maintainer's final acceptance; that sign-off is the maintainer's, not this report's.

## History

### Independent retry, 2026-11-15

On this task's cloud environment, Chromium 156.0.8078.79 with normal TLS verification attempted `https://trandung6129.github.io/` and returned `net::ERR_TUNNEL_CONNECTION_FAILED`; `curl -I --max-time 12 https://trandung6129.github.io/` returned exit 56, proxy CONNECT HTTP 403, before an origin response. Environment status reports restricted egress and the hostname absent from its effective allowlist. These are environment access failures, not evidence of a production outage. No page, interaction, asset, screenshot of the actual site, or console smoke gate could be verified. P1-08 stays **BLOCKED**. Allow the hostname in the environment's Internet settings and repeat the trusted live browser checklist; maintainer sign-off remains outstanding.

The pre-retry report (deploy run 43706336488 for `e5269a0`, artifact 14157718813) is in Git history; its outstanding checklist is answered above.
