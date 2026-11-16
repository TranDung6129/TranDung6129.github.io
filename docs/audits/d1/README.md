# D1 Article Reading — implementation evidence

## Status

**READY FOR PR REVIEW — not deployed or merged.** This implements D1-00 through D1-06 only. D2–D8 remain future constraints, and no homepage, payment, affiliate, subscription, or other product architecture was changed.

Baseline: `origin/main` `c2898aa`; implementation branch: `feat/d1-article-reading`; claim `e8a38a0`; implementation `aa8ae36`. The complete owner handoff and approved reference were read/inspected before any code modification.

## What changed

- The long-form article’s prose now centres on the viewport at wide widths; its independent TOC rail sits to the left, becomes normal flow before collision at tablet width, and becomes a compact disclosure on mobile.
- The TOC has persistent top-level entries, manual H3 disclosure controls, contextual opening only until a reader takes manual control, and a prose-only reading-progress indicator.
- The masthead uses a reusable vector brand mark, independently centred navigation, symmetric low-contrast flourishes, plus a vector favicon.
- Original, repository-authored botanical/paper/landscape SVG ornaments are decorative (`alt=""`, `aria-hidden`) and deterministic per article. The optional ornamental files from the handoff were explicitly marked concept prototypes, so were not used.
- The end of an article starts with **Further Essays**, then **Curated Reading / Resources**. The sole resource record is the actual Nash (1950) PNAS paper linked at its DOI; it contains no price, affiliate, merchant, fake cover, or purchase claim.
- Display mathematics and tables use their own horizontal scroll region at extreme text scale rather than widening the reading page.

## Before / after

Representative route: `/kinh-te/game_theory_nash/`.

| Viewport | Before | After, light | After, dark |
|---|---|---|---|
| 1440 × 900 | [PNG](screenshots/before-nash-1440.png) | [PNG](screenshots/after-nash-1440-light.png) | [PNG](screenshots/after-nash-1440-dark.png) |
| 1024 × 768 | [PNG](screenshots/before-nash-1024.png) | [PNG](screenshots/after-nash-1024-light.png) | [PNG](screenshots/after-nash-1024-dark.png) |
| 390 × 844 | [PNG](screenshots/before-nash-390.png) | [PNG](screenshots/after-nash-390-light.png) | [PNG](screenshots/after-nash-390-dark.png) |

Before: prose centre was x=687.3 at 1440px and x=606.7 at 1024px because the TOC grid consumed left-side space. After: x=719.99/1440 and x=511.99/1024; at 390px it is x=195.00. The complete structured browser result is [browser-results.json](evidence/browser-results.json).

## Verification

| Check | Result |
|---|---|
| `PATH=/workspace/.cloud-tools/bin:$PATH npm run build -- --destination /tmp/d1-release-build` | PASS; 306 content pages, zero Hugo errors |
| D1 browser harness: `D1_BASE=http://127.0.0.1:1336 D1_OUT=/tmp/d1-release D1_IGNORE_HTTPS_ERRORS=1 D1_REQUIRE_MATH_RENDER=1 NODE_PATH=/tmp/p2-qa/node_modules:/tmp/p1-02-browser/node_modules node scripts/test-d1.cjs` | PASS: six light/dark states at 1440/1024/390, deep link, TOC manual state, progress, mobile/zoom, 68 MathJax containers/state, no console errors or horizontal overflow |
| 200% text scale, 390px | PASS; no page horizontal scroll; equations/tables retain internal scrolling |
| Vietnamese article `/kinh-te/toan-co-ban-2/` at 390/1440 | HTTP 200, Vietnamese text present, no horizontal overflow |
| axe-core at 390/1440 light/dark | 0 automatic WCAG 2.1 A/AA violations. `color-contrast` remained incomplete (225 mobile / 235 desktop nodes), so this is not a full manual accessibility sign-off. |
| Route retention | PASS: baseline and D1 each contain 377 HTML/XML/JSON outputs; exact relative-path lists are identical. |
| Local, unthrottled performance observation | D1: 431 KB same-origin response headers, 15–16 requests, FCP 352ms (390) / 268ms (1440), CLS 0. Baseline: 804 KB, 14 requests, FCP 280ms / 212ms. These are one-run local observations, not field CWV. |

The managed Chromium instance rejects the CDN certificate for MathJax with `ERR_CERT_AUTHORITY_INVALID` under its normal trust store. The formula-rendering run above uses its documented `D1_IGNORE_HTTPS_ERRORS=1` environment workaround only to test the existing third-party loader; it is not evidence of a live production certificate check. Direct live fetches were also unavailable here (`CONNECT 403`), so no deployment or live-site claim is made.

## Acceptance checklist

- [x] D1-00 baseline inspected and captures retained.
- [x] D1-01 centred, readable long-form article at desktop/tablet/mobile.
- [x] D1-02 independent, accessible TOC and prose-only progress.
- [x] D1-03 reusable identity, favicon, centred navigation, restrained ornaments.
- [x] D1-04 stable light/dark treatment and no automatic artwork inversion.
- [x] D1-05 real, non-commercial discovery data in the required order.
- [x] D1-06 build, route-retention, responsive, zoom, automated accessibility, and local performance evidence.
- [ ] Owner PR review / final approval.

No D1 task row exists in `docs/TASK_BOARD.md`; therefore this evidence does not alter unrelated Phase 1 or Phase 2 completion statuses.
