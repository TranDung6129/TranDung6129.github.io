# Editorial specimen — owner review

**Status: OWNER-ACCEPTED FOR PHASE 2 (REVERSIBLE).** The owner approved the existing layout, spacing, hierarchy, colors and component structure as design direction. Owner approved this reversible Phase 2 milestone and selected Source Serif 4 for reading and Newsreader for headings; prototype remains isolated, not a homepage deploy. This remains an isolated Hugo specimen, not a deployed homepage. P1-08 remains BLOCKED because the public site could not be reached through the environment proxy. No live-site behavior is inferred from the local preview.

## View the working prototype

From the repository root, install/use Hugo Extended 0.149.0, then:

```sh
# In this environment the binary is under /workspace/.cloud-tools/bin.
PATH=/workspace/.cloud-tools/bin:$PATH scripts/preview-editorial.sh
```

Open `http://127.0.0.1:1317/editorial-review/` **inside the machine running Hugo**. The process binds loopback; this session did not expose a browser-forwarding tool, so this address is not a public link. The command creates a temporary snapshot and a draft only inside it, disables GitInfo for that snapshot, and selects the `editorial-review` environment. The specimen template is guarded by that environment. Restart after edits; Ctrl+C stops the server. No draft or specimen route is present in repository content. The ordinary production build, including the current homepage, has 647 files byte-identical to the pre-prototype baseline and emits no `/editorial-review/`.

## Current artwork v2 — review evidence

The owner supplied four AI-generated PNGs in `epistemic_editorial_assets_v2.zip`. They are preserved exactly in `assets/editorial-source/`; eleven proportionally resized WebP variants are served through `picture`/`srcset` with intrinsic sizes and PNG fallback. No crop, stretching or dark-mode inversion is used. Figure captions sit outside the artwork; the mobile hero margin was adjusted to keep the journal link unobscured. The existing page grids, masthead, typography, reading room, journal and footer remain unchanged. [Asset origin and mathematical limitations](ASSET-PROVENANCE.md) · [machine-readable manifest](owner-art-v2.json).

Current full-page captures: [1440 light](review-v2/full/specimen-1440-light.png), [1440 dark](review-v2/full/specimen-1440-dark.png), [390 light](review-v2/full/specimen-390-light.png), [390 dark](review-v2/full/specimen-390-dark.png). The `review-v2/full/` directory also contains 360/768/1024 light/dark captures.

Focused captures: **hero** [1440 light](review-v2/hero-1440-light.png), [1440 dark](review-v2/hero-1440-dark.png), [390 light](review-v2/hero-390-light.png), [390 dark](review-v2/hero-390-dark.png); **featured essays** [1440 light](review-v2/featured-1440-light.png), [1440 dark](review-v2/featured-1440-dark.png), [390 light](review-v2/featured-390-light.png), [390 dark](review-v2/featured-390-dark.png); **volume cover** [1440 light](review-v2/volume-1440-light.png), [1440 dark](review-v2/volume-1440-dark.png), [390 light](review-v2/volume-390-light.png), [390 dark](review-v2/volume-390-dark.png).

Final local browser run: 84/84 interaction/layout checks; 10 screenshots; 40/40 image loads have the requested WebP, alt text, natural proportions and no inversion or obscured captions/link; no console, request or HTTP failures. Same-browser comparison against the unmodified `efb2667` base found zero computed-style differences across 27 non-image selectors and 17 tokens at the 10 viewport/theme combinations. This is a scoped style comparison, not pixel identity. Axe found no automatic violations at 390/1440 light/dark; 4 mobile and 2 desktop contrast cases per theme remain incomplete for manual inspection. Raw [browser](review-v2/full/results.json), [art](review-v2/art-results.json), [layout](review-v2/layout-results.json), and [axe](review-v2/axe-results.json) evidence. No full WCAG or owner visual approval is claimed.

Local unthrottled single-run LCP for the new hero was 304/240ms at 390 light/dark and 280/376ms at 1440; observed CLS was 0 through 2.5 seconds. Selected image resources totaled 154,666 bytes at 390 and 311,698 bytes at 1440. These are local observations, not field Core Web Vitals or a production performance guarantee. [Current measurements](review-v2/performance.json) · [baseline measurements](review-v2/baseline-performance.json).

A separate [Newsreader / Source Serif 4 / Lora comparison](typography-comparison/README.md) includes licensed local fonts, Vietnamese/English, mathematical text, four screenshots and browser checks. It does not choose a font or alter production typography. [Desktop light comparison](typography-comparison/screenshots/type-1440-light.png) · [desktop dark](typography-comparison/screenshots/type-1440-dark.png) · [mobile light](typography-comparison/screenshots/type-390-light.png) · [mobile dark](typography-comparison/screenshots/type-390-dark.png).

## Prior SVG-placeholder screenshots (historical)

Full-page Chromium captures from the final composite are in `review/`:

- Desktop: [1440 light](review/specimen-1440-light.png), [1440 dark](review/specimen-1440-dark.png).
- Mobile: [390 light](review/specimen-390-light.png), [390 dark](review/specimen-390-dark.png); [360 light](review/specimen-360-light.png), [360 dark](review/specimen-360-dark.png).
- Tablet: [768 light](review/specimen-768-light.png), [768 dark](review/specimen-768-dark.png), [1024 light](review/specimen-1024-light.png), [1024 dark](review/specimen-1024-dark.png).

## Reference interpretation

The supplied concept informed the warm paper/ink/terracotta palette, serif masthead, restrained rules, armillary motif, varied feature hierarchy, journal list and book-like volume. The earlier placeholder used simple vector linework; the current review uses the owner-supplied v2 artwork while retaining a single flowing review page and non-clickable demo treatments for nonexistent essays/volume. Films/Labs/Discover navigate to labeled specimen sections; search and the two related-reading links point to existing public content. The support, membership, editions and advertising-space examples are static, explicitly inactive; no transaction, affiliate or ad integration exists. See [asset provenance](ASSET-PROVENANCE.md).

The reading specimen includes English, Vietnamese, a credited excerpt from the existing Riemann article, italics, numbers, code and native MathML. No final font has been selected. In this Chromium environment, DevTools measured Liberation Serif for the display/VI text, Noto Sans for metadata, DejaVu Sans Mono for code and Latin Modern Math for equation glyphs. Other systems may select other fallback fonts. A separate comparison of Newsreader, Source Serif 4 and Lora is now available above; the production font decision remains open.

## Prior SVG-placeholder quality observations (historical)

- Playwright: **84/84** checks passed at 360/390/768/1024/1440, light and dark, with 10 screenshots, no document overflow and no observed console, failed-request or HTTP errors. Sixteen local section/public-content links checked; menu, search, Escape/focus and theme persistence exercised. The code region is keyboard focusable; ArrowRight scrolled it at 360px. Raw [browser results](review/browser-results.json) and [extra interactions](review/interaction-extra.json).
- Axe-core 4.10.2: zero automatically reported violations at 390 and 1440 in both themes; 11 mobile and 9 desktop **incomplete color-contrast checks** per theme still need manual assessment. This is not a WCAG conformance certificate. Raw [axe results](review/axe-results.json), [computed cases](review/incomplete-computed.json) and [manual color samples](review/manual-contrast.json). SVG text/decorative details and MathML need visual/manual review.
- Token text pair tests pass >=4.5:1. For image captions, a solid backing was added; sampled caption ratio 12.92:1. The light muted token was darkened to meet 4.5:1 on the surface. Mobile menu/search/theme targets were measured at least 44×44px. These checks do not replace manual assistive-technology review.
- Performance is one unthrottled local headless run with fresh contexts: at 390 light, load 492.9ms/FCP 484ms; at 1440 light, load 249ms/FCP 264ms. These are observations, not field Core Web Vitals or production performance guarantees. See [raw results](review/browser-results.json).

The integrator inspected desktop light and 390 dark full-page screenshots; the QA contributor inspected desktop light and mobile dark. The owner approved the overall layout, spacing, hierarchy, color direction and component structure as a direction; final image treatment, typography and overall visual sign-off remain **NEEDS OWNER REVIEW**. The attached reference image was seen in the user request; it is not checked in and is not an asset source.

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


## Owner final acceptance — 2026-11-15
Approved the v2 artwork and overall Phase 2 design, with **Source Serif 4 for reading text** and **Newsreader for headings**. Any later design corrections must use reversible PRs. Existing production homepage is unchanged pending Phase 3 migration; P1-08 live smoke is independent and still BLOCKED.
