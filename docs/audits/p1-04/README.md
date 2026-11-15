# P1-04 compatibility implementation and verification

Base `0eb0450` (PR #18 merged). Site-owned `layouts/_default/baseof.html` supplies the document shell; its `site/header.html` and `site/footer.html` partials delegate to FixIt. `layouts/posts/single.html` and `layouts/section.html` are active article/section templates, with site-owned title/section partials; `_default/single.html` and `_default/list.html` are future fallbacks. These are compatibility adaptations of pinned FixIt `f5fb989`, not an independent theme: head, initialization, assets, navigation, footer, widgets and many article helpers still come from FixIt. MIT attribution is preserved in `layouts/_default/FIXIT-LICENSE.txt` and the shell comment. Home uses the owned base too; production output comparison covers it.

## Verification

- `PATH=/workspace/.cloud-tools/bin:$PATH npm run build -- --destination /tmp/p104-final2` — PASS. `python3 docs/audits/p1-01/verify.py /tmp/p1-03-public /tmp/p104-final2 docs/audits/p1-04/retention` — PASS: 645 production files, zero added, removed or byte-different files. The retained P1-03 build is the baseline; see `retention/verification.json` and `build-production.log`.
- Independent `npm run build -- --destination /tmp/p104-check-prod` and static analyzer against `docs/audits/p1-02/static/routes.txt` — PASS: 645 routes; 156 valid XML, same 745 missing references and four canonical/24 title duplicate groups as P1-02. `python3 docs/audits/p1-02/static/test_analyzer.py` — PASS (1 fixture).
- `hugo --environment development --destination /tmp/p104-final2-dev` versus a clean archive of origin/main built with the same command — PASS for all 648 routes and all HTML byte comparisons. Seven JS/CSS source maps and development bundles differ in embedded checkout paths; independent comparison normalized source paths and confirmed no other differences. See `development-differences.json`. An initial newline difference in eight section pages was corrected and builds rerun.
- Hugo lookup: a temporary copy of layouts, not repository files, was instrumented with `data-source-probe` markers, then built with `/workspace/.cloud-tools/bin/hugo --layoutDir /tmp/p1-04-lookup-layout --destination /tmp/p1-04-lookup-output`. The owned section marker appeared in `kinh-te/index.html`; the owned post marker appeared in `kinh-te/game_theory_nash/index.html`. Generic default single/list remain fallback and are not claimed as active for current content. Hugo template metrics also recorded the header/footer adapters 201 times, including home.
- Browser: serve `/tmp/p104-check-prod` with `python3 -m http.server 1315 --bind 127.0.0.1 --directory /tmp/p104-check-prod`; copy the P1-02 browser and keyboard harnesses to `/tmp/p104-browser`, change localhost port 1314 to 1315, and run with `NODE_PATH=/tmp/p1-02-browser/node_modules BASELINE_OUTPUT=/tmp/p104-browser node /tmp/p104-browser/baseline.cjs` and the keyboard harness. Both exit 0. Eight checks pass: Nash preset and keyboard slider, TOC, theme toggle and persistence, search, code rendering and copy. Eight sampled pages return 200; 16 captures at 360/768/1024/1440, light/dark show no document horizontal overflow. Keyboard sampling and reduced motion are limited observations, not accessibility certification. Browser JSON, keyboard JSON, log and screenshots are retained here. Final production output after the whitespace fix remains byte-identical to the tested build.

## External runtime gate — verified 2026-11-15 (Claude Code)

The gate Codex left open (MathJax typesetting and Cal-Heatmap execution in a real browser) is now exercised. Scripts, raw results and screenshots are in [`runtime/`](runtime/).

### Environment and trust path (read this before relying on the result)

- Hugo Extended 0.149.0, Node 22.23.4, Playwright 1.63.0, headless Chromium 153.0.8010.12. The browser is launched with **no options** and the context keeps `ignoreHTTPSErrors: false`; no certificate-error flag, request interception, mocked asset or origin rewrite is used.
- In this environment the earlier failure was **not** a certificate error: the session's network policy refused `cdn.jsdelivr.net` and `d3js.org` (HTTP 403 on CONNECT). The maintainer approved an environment that allow-lists exactly those two hosts. Certificate validation was never relaxed.
- Outbound HTTPS here is re-terminated by the provider's managed egress proxy. Chromium validates that proxy's chain against the CA the environment installs in the browser trust store; every CDN response therefore records issuer `CCR agent-proxy interception CA (production) 2026-08` in the results. The browser does not see the CDN's public certificate directly, so the delivered bytes were cross-checked independently: the SHA-256 of each executed file equals the same file in the npm registry release, and each npm tarball's SHA-512 equals the registry `dist.integrity` ([`runtime/integrity.json`](runtime/integrity.json)).
- Limitation: both the CDN and the npm registry are reached through the same managed egress, so this is strong evidence that the site executes the genuine library releases, not a substitute for an end-user browser on the public internet. That last confirmation belongs to the P1-08 live smoke test.

| Executed CDN resource | npm release file with identical bytes | Bytes | SHA-256 |
|---|---|---:|---|
| `https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js` | `mathjax@3.2.2/es5/tex-mml-chtml.js` | 1173007 | `300480069078b5892d2363a2b65e2dfbbf30fe5c80f83edbfecf4610fd093862` |
| `https://cdn.jsdelivr.net/npm/mathjax@3/es5/ui/safe.js` | `mathjax@3.2.2/es5/ui/safe.js` | 11189 | `9fef48d868277a8bc1852f7ba796b33ead812d38916a7131b0a29ea48961a6a4` |
| `https://cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.min.js` | `cal-heatmap@3.3.10/cal-heatmap.min.js` | 44230 | `ab8a58f0a4603ad5b275c78c6e6bde7b2170dc6cdbb3f81225cdfb01dc64f387` |
| `https://cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.css` | `cal-heatmap@3.3.10/cal-heatmap.css` | 1676 | `fa2c3af7dc8eb41ad42d4efa2f492b816a27abb69f309f5ff4dfb11d7cd5d673` |
| `https://d3js.org/d3.v3.min.js` | `d3@3.5.17/d3.min.js` | 151725 | `76c39718d1c0a3fb321676b3b7e29306c0907919a5716d5728bd1b08ae0169e7` |

### Reproduce

```sh
npm ci && npm run build -- --destination /tmp/p104-public          # this branch
python3 -m http.server 1315 --bind 127.0.0.1 --directory /tmp/p104-public &
BASE=http://127.0.0.1:1315 OUT=/tmp/p104-runtime node docs/audits/p1-04/runtime/runtime.cjs
# same harness against a build of origin/main served on another port, then:
node docs/audits/p1-04/runtime/compare.cjs <main>/runtime-results.json /tmp/p104-runtime/runtime-results.json
# integrity (npm pack mathjax@3.2.2 cal-heatmap@3.3.10 d3@3.5.17, extracted to <name>-<version>/package/):
python3 docs/audits/p1-04/runtime/integrity.py /tmp/p104-runtime/runtime-results.json <npm-dir> /tmp/integrity.json
```

Playwright and Chromium come from the environment, not from `package.json`. Each script exits nonzero when a check fails.

### Results

- **Output retention, fresh build:** `python3 docs/audits/p1-01/verify.py <main build> <branch build> docs/audits/p1-04/runtime/retention` — PASS, 645/645 files, zero added, removed or byte-different, built from `origin/main` `0eb0450` and this branch in the same checkout path ([`runtime/retention/verification.json`](runtime/retention/verification.json)).
- **MathJax** — PASS on all 16 pages that contain math (10 Vietnamese, 6 English). MathJax 3.2.2 loads from the CDN, CHTML output, 674 `mjx-container` elements equal to MathJax's own 674 math items, zero `mjx-merror`, zero zero-size containers, zero raw TeX left in prose. No document horizontal overflow on a math page at 1440 px and 360 px, light and dark.

| Route | lang | mjx-container | display | MathJax items | mjx-merror | raw TeX left |
|---|---|---:|---:|---:|---:|---:|
| `/kinh-te/toan-co-ban-1/` | vi | 15 | 3 | 15 | 0 | 0 |
| `/en/kinh-te/toan-co-ban-1/` | en | 15 | 3 | 15 | 0 | 0 |
| `/kinh-te/toan-co-ban-2/` | vi | 10 | 4 | 10 | 0 | 0 |
| `/kinh-te/toan-co-ban-3/` | vi | 20 | 3 | 20 | 0 | 0 |
| `/kinh-te/toan-co-ban-4/` | vi | 11 | 3 | 11 | 0 | 0 |
| `/kinh-te/toan-co-ban-5/` | vi | 12 | 1 | 12 | 0 | 0 |
| `/en/kinh-te/toan-co-ban-5/` | en | 12 | 1 | 12 | 0 | 0 |
| `/kinh-te/co-gian-cung-cau-cong-thuc/` | vi | 28 | 17 | 28 | 0 | 0 |
| `/kinh-te/doanh-thu-co-gian-dinh-thuc/` | vi | 47 | 30 | 47 | 0 | 0 |
| `/kinh-te/ly-thuyet-tro-choi-nash/` | vi | 54 | 21 | 54 | 0 | 0 |
| `/kinh-te/game_theory_nash/` | vi | 78 | 14 | 78 | 0 | 0 |
| `/en/kinh-te/game_theory_nash/` | en | 78 | 14 | 78 | 0 | 0 |
| `/toan-hoc/riemann-hypothesis-number-theory/` | vi | 62 | 15 | 62 | 0 | 0 |
| `/en/toan-hoc/riemann-hypothesis-number-theory/` | en | 62 | 15 | 62 | 0 | 0 |
| `/khoa-hoc-may-tinh/complexity-theory-quantum/` | vi | 85 | 20 | 85 | 0 | 0 |
| `/en/khoa-hoc-may-tinh/complexity-theory-quantum/` | en | 85 | 20 | 85 | 0 | 0 |

- **Cal-Heatmap** — PASS on the four home languages (`/`, `/en/`, `/ja/`, `/zh-cn/`) in light and dark: D3 3.5.17 and the `CalHeatMap` constructor load from the CDN, the page's instance exists, one SVG container with six month domains (June–November for the run date) and 183 day cells, equal to the days in that window; hovering a cell shows the tooltip (`Monday June 1, 2026`). At 360 px the heatmap renders 183 cells with no document overflow.
- **Parity with main** — the same harness against a build of `origin/main` gives identical observations in every compared section (checks, per-page math counts, heatmap state, external response hashes, console errors, failed requests): [`runtime/comparison.json`](runtime/comparison.json).
- **Interaction harness rerun** — the P1-02 `baseline.cjs` (port and browser path adjusted, logic unchanged) against this branch: 8/8 checks PASS, 16 screenshots with no horizontal overflow, and the sampled pages now report typeset math (78 and 85 containers) instead of zero: [`runtime/interaction/`](runtime/interaction/).
- Screenshots: `runtime/screenshots/math-{1440,360}-{light,dark}.png`, `heatmap-1440-{light,dark}.png`, `heatmap-360-light.png`. The math and heatmap captures at 1440 px light were opened and read; the others are recorded captures.

### Still open — existing behaviour, identical on main, not fixed here

- **New baseline finding (heatmap colours):** every day cell has fill `rgb(155, 233, 168)` in both themes; the in-page theme switch does not recolour the rendered heatmap, and with no posts inside the six-month window all 183 cells show the "min" colour, so the widget currently conveys no activity information. `layouts/partials/heatmap.html` mutates `cal.options.legendColors` after `init`, which does not rebuild the colour scale. Recorded for a later task; changing it is out of P1-04 scope.
- The `www.gravatar.com` avatar request is refused by this environment's network policy (host not allow-listed; cosmetic image only). The missing Nash poster (404), the relative `static/images/logoted.png` icon path and the P1-02 link/metadata defects are unchanged.
- This report does not certify accessibility conformance, production Core Web Vitals or a live deployment. Maintainer review and merge of PR #19 is the acceptance step.
