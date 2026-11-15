# Editorial specimen — owner review

**Status: AWAITING OWNER REVIEW.** This is an isolated Hugo design specimen, not an approved visual direction or a deployed homepage. P1-08 remains BLOCKED because the public site could not be reached through the environment proxy. No live-site behavior is inferred from the local preview.

## View the working prototype

From the repository root, install/use Hugo Extended 0.149.0, then:

```sh
# In this environment the binary is under /workspace/.cloud-tools/bin.
PATH=/workspace/.cloud-tools/bin:$PATH scripts/preview-editorial.sh
```

Open `http://127.0.0.1:1317/editorial-review/` **inside the machine running Hugo**. The process binds loopback; this session did not expose a browser-forwarding tool, so this address is not a public link. The command creates a temporary snapshot and a draft only inside it, disables GitInfo for that snapshot, and selects the `editorial-review` environment. The specimen template is guarded by that environment. Restart after edits; Ctrl+C stops the server. No draft or specimen route is present in repository content. The ordinary production build, including the current homepage, has 647 files byte-identical to the pre-prototype baseline and emits no `/editorial-review/`.

## Screenshots

Full-page Chromium captures from the final composite are in `review/`:

- Desktop: [1440 light](review/specimen-1440-light.png), [1440 dark](review/specimen-1440-dark.png).
- Mobile: [390 light](review/specimen-390-light.png), [390 dark](review/specimen-390-dark.png); [360 light](review/specimen-360-light.png), [360 dark](review/specimen-360-dark.png).
- Tablet: [768 light](review/specimen-768-light.png), [768 dark](review/specimen-768-dark.png), [1024 light](review/specimen-1024-light.png), [1024 dark](review/specimen-1024-dark.png).

## Reference interpretation

The supplied concept informed the warm paper/ink/terracotta palette, serif masthead, restrained rules, armillary motif, varied feature hierarchy, journal list and book-like volume. This implementation deliberately uses simpler original vector linework rather than embedding the concept image, a single flowing review page instead of claiming a final production information architecture, and non-clickable demo treatments for nonexistent essays/volume. Films/Labs/Discover navigate to labeled specimen sections; search and the two related-reading links point to existing public content. The support, membership, editions and advertising-space examples are static, explicitly inactive; no transaction, affiliate or ad integration exists. See [asset provenance](ASSET-PROVENANCE.md).

The reading specimen includes English, Vietnamese, a credited excerpt from the existing Riemann article, italics, numbers, code and native MathML. No final font has been selected. In this Chromium environment, DevTools measured Liberation Serif for the display/VI text, Noto Sans for metadata, DejaVu Sans Mono for code and Latin Modern Math for equation glyphs. Other systems may select other fallback fonts. Newsreader/Source Serif/Lora have not been compared visually in this environment, and their production licensing/loading decisions remain open.

## Quality observations, not visual approval

- Playwright: **84/84** checks passed at 360/390/768/1024/1440, light and dark, with 10 screenshots, no document overflow and no observed console, failed-request or HTTP errors. Sixteen local section/public-content links checked; menu, search, Escape/focus and theme persistence exercised. The code region is keyboard focusable; ArrowRight scrolled it at 360px. Raw [browser results](review/browser-results.json) and [extra interactions](review/interaction-extra.json).
- Axe-core 4.10.2: zero automatically reported violations at 390 and 1440 in both themes; 11 mobile and 9 desktop **incomplete color-contrast checks** per theme still need manual assessment. This is not a WCAG conformance certificate. Raw [axe results](review/axe-results.json), [computed cases](review/incomplete-computed.json) and [manual color samples](review/manual-contrast.json). SVG text/decorative details and MathML need visual/manual review.
- Token text pair tests pass >=4.5:1. For image captions, a solid backing was added; sampled caption ratio 12.92:1. The light muted token was darkened to meet 4.5:1 on the surface. Mobile menu/search/theme targets were measured at least 44×44px. These checks do not replace manual assistive-technology review.
- Performance is one unthrottled local headless run with fresh contexts: at 390 light, load 492.9ms/FCP 484ms; at 1440 light, load 249ms/FCP 264ms. These are observations, not field Core Web Vitals or production performance guarantees. See [raw results](review/browser-results.json).

The integrator inspected desktop light and 390 dark full-page screenshots; the QA contributor inspected desktop light and mobile dark. Reading comfort, aesthetic craft, image treatment, chosen font and all owner rubric categories remain **NEEDS OWNER REVIEW**, not approved. The attached reference image was seen in the user request; it is not checked in and is not an asset source.

The focused stacked branches and their review bases are listed in [PR-PLAN.md](PR-PLAN.md). PR creation is blocked by GitHub API egress; no PR or merge is claimed.

## Reproduce checks

With preview running, install browser test packages outside the checkout if needed (Chromium binary at `/usr/bin/chromium`):

```sh
npm install --prefix /tmp/p2-review-tools --no-save --no-audit --no-fund playwright@1.65.1 @axe-core/playwright@4.10.2
export NODE_PATH=/tmp/p2-review-tools/node_modules
export P2_URL=http://127.0.0.1:1317/editorial-review/
export P2_QA_OUT=/tmp/p2-review-results
node scripts/test-editorial-review.cjs
node scripts/test-editorial-axe.cjs
node scripts/test-editorial-extra.cjs
node scripts/test-editorial-fonts.cjs
node scripts/test-editorial-computed.cjs
python3 docs/design/check-token-contrast.py
```

The original test dependencies were installed separately under `/tmp/p1-02-browser` and `/tmp/p2-qa`; these commands use one equivalent temporary prefix. Do not add browser libraries to production dependencies solely for this review. Normal Chrome TLS behavior is retained. A full production build and comparison of all 647 output bytes passed; [comparison](review/production-retention.json).
