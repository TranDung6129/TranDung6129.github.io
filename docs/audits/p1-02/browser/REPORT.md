# P1-02 browser baseline

Single-run headless Chromium against unmodified production output served by python http.server on localhost:1314; normal external requests retained; no production-origin rewrites, trust bypass, CPU/network throttle or field CWV claim.

## Reproduce

```sh
npm install --prefix /tmp/p1-02-browser --cache /workspace/.cloud-tools/npm-cache playwright@1.65.1 --no-audit --no-fund
python3 -m http.server 1314 --bind 127.0.0.1 --directory /tmp/p1-01-accepted
NODE_PATH=/tmp/p1-02-browser/node_modules node docs/audits/p1-02/browser/baseline.cjs
NODE_PATH=/tmp/p1-02-browser/node_modules node docs/audits/p1-02/browser/keyboard.cjs
```

Replay from repository root; capture executed the same scripts from `/tmp/p1-02-browser/`. Server runs in separate session. Chromium 156.0.8078.79, Playwright 1.65.1, Node 24.22.1. Final baseline.cjs exit **0**, all eight behavior checks PASS. keyboard.cjs exit **0**. No source files or shared docs changed by contributor.

## Actual behavior

- Four home languages and four representative content routes returned 200; full metadata and network errors are in results.json.
- Nash: Matching Pennies switches pure NE to none and mixed probabilities to p=q=0.500. Keyboard ArrowRight changes a payoff slider from 1 to 1.5.
- TOC link changes URL to existing section anchor. Theme toggle changes html data-theme to dark and persists across reload.
- Search for Nash returns one local Fuse result. One syntax-highlighted Python block renders; expand collapsed .code-title, hover header, click .copy, and read clipboard: 311 characters matching vertex_cover_approx code.
- All 16 home/article viewport screenshots captured at 360/768/1024/1440 x light/dark, height 1000, reduced-motion preference. No document horizontal overflow at those states. They are viewport snapshots, not full-page image comparisons.
- Mobile Nash wrapper hidden and Vietnamese fallback displayed at 360/768; desktop reverses visibility. keyboard.json records fallback text and first 8 Tab focus stops at 360/1440, visible UA outline, reduced-motion match=true, root scroll auto and body animation duration 0s. This limited sample is not full accessibility conformance.

## Existing issues vs environment limitations

- Existing local asset failures: missing Nash poster and relative static/images/logoted.png requests resolve to nonexistent nested article/language paths (404). These are unchanged baseline defects.
- Environment external-request failures: Google Fonts and gravatar fail with ERR_TUNNEL_CONNECTION_FAILED. CDN MathJax/Cal-Heatmap fail certificate validation; no TLS bypass used. MathJax has zero rendered mjx-container elements and raw math remains visible; home reports CalHeatMap is not defined after blocked loader. Do not claim math/heatmap runtime parity passed. Third-party errors remain in results.json and keyboard.json.
- Screenshots preserve visible cookie notice and failed remote avatar; no editing, fake assets or environment dependency substitution was performed.
- Only home-360-light and nash-1440-dark were visually opened by this contributor; all 16 generated screenshots have recorded dimensions/state. Parent independently reviewed some screenshots.

## Single-run local performance (milliseconds)

| Route | Load event end | FCP |
|---|---:|---:|
| `/` | 292.4 | 144.0 |
| `/en/` | 95.8 | 68.0 |
| `/ja/` | 92.8 | 60.0 |
| `/zh-cn/` | 74.4 | 84.0 |
| `/kinh-te/game_theory_nash/` | 394.7 | 100.0 |
| `/en/kinh-te/game_theory_nash/` | 215.9 | 120.0 |
| `/khoa-hoc-may-tinh/complexity-theory-quantum/` | 94.5 | 88.0 |
| `/about/` | 280.6 | 180.0 |

Shared context mixes cold/warm caches; localhost, no network/CPU throttling and failed external dependencies materially affect timings. Navigation/paint entries are observations, not production/Core Web Vitals or a Lighthouse score.

## Inspected source registry handoff

| Read path | Blob when read | Useful purpose / scope |
|---|---|---|
| AGENTS.md | 283fb0f2870e3c3ae6ce0424ea9b233d9b5a77b3 | COVERED: task claim/evidence/multi-agent and static-site/database safety rules; guides all task work. |
| docs/CODEBASE_MAP.md | c3ee7af936e145fa52fdd1783169eda1d78f4c9f | COVERED: entrypoint ownership and Hugo/React/search/theme routes; use to target future edits, not implementation parity proof. |
| docs/INSPECTED_FILES.md | 4a568f12173c5a593bd95acba8a7aec3dbc1cc04 | COVERED at initial read: cumulative per-file SHA and semantic registry, group exception for generated/vendor; shared integrator edits occurred afterward. |
| docs/QUALITY_GATES.md | 8914d7729b3f330d8e5334b08f1a084d09e73d3c | COVERED: output/URL/meta/browser/a11y/performance evidence requirements; baseline uses limited behavior probes and explicitly records gaps. |

Generated output group: /tmp/p1-01-accepted production HTML for /, /en/, /ja/, /zh-cn/, both Nash pages, complexity article and About was inspected in browser; markup excerpts read from root/Nash/complexity outputs. Browser naturally loads generated CSS/JS and assets; group-level coverage PARTIAL, no source line review claimed. Outputs are the fresh build integrator verified unchanged from pinned source. Newly authored baseline.cjs/keyboard.cjs/results.json/keyboard.json and screenshot group are contributor evidence; integrator should record final committed artifact hashes. No app source file was read or edited.

Exploratory harness assumptions (theme attribute on body, Nash decimal precision and initially collapsed copy control) were corrected from actual DOM observations before the final run. Exploratory scripts/logs should not be committed as final evidence. Final baseline.cjs/results.json/run.log and keyboard.cjs/keyboard.json are authoritative.
