# D6 — Discovery & monetization: design specification

**Status:** PLACEMENTS READY FOR OWNER REVIEW (2026-11-24). Nothing is live. Prototype: `prototype/` (`scripts/preview-overlay.sh docs/phases/phase-4/d6/prototype <dir>`). Screenshots: `docs/audits/d6/screenshots/`. Checks: `docs/audits/d6/tools/d6-check.cjs` → 20/20, axe 0.

All store and support links in the prototype are placeholders marked **MẪU / SAMPLE** (`example.invalid`). No real offer, price or commission is invented.

## 1. Recommendations ("Đọc tiếp")
- **Order:**
  1. The editor's picks (front matter `further: ["/path", …]`).
  2. The next part of the essay's series.
  3. Related essays (same topic).
  4. If none is left, the latest essays.
- Each card shows its reason in the meta line. "Same topic" and "Latest" are muted; editorial and series reasons use the accent colour.
- No algorithm beyond Hugo's related index; no behavioural tracking.
- A series' next part is usually already the "newer essay" link, which D1 excludes, so the series reason mostly appears when dates differ. Turning the older/newer links into series navigation is a later option.

## 2. Affiliate book links
- **Data:** a resource item in `data/resources.yaml` or `data/d1_resources.yaml` may list `buy: [{store, url, affiliate: true}]`.
- **Display:** "Mua sách: Tiki ↗ · Fahasa ↗" under the entry in Discover and Curated Reading, never inside essay prose.
  - Links are `rel="sponsored noopener"`.
  - The disclosure sits directly below: commission possible, no extra cost, chosen for content.
- **Rules:**
  - Nothing renders without a real URL.
  - Only books the essay or the library already recommends.
  - No prices, ratings, countdowns or "buy now" language.

## 3. Voluntary support
- **Placement:** one quiet block after each essay's footer and on About.
- **Content:** title, one sentence ("Mọi bài viết đều miễn phí…"), one button (Ko-fi / Buy Me a Coffee / bank or MoMo page) and an optional QR image.
- **Configuration:** off until `params.support.url` is set. It never gates content.

## 4. Analytics (no cookies)
- **Script:** GoatCounter `count.js` from `params.goatcounter` (the owner's endpoint). It loads only in production builds and nothing loads until it is set.
- **What it counts:** page views, referrers and paths.
- **Click events:** store and support clicks carry `data-goatcounter-click` (`buy:<store>`, `support`), so D7 can show discovery and affiliate interest.
- **No cookie banner needed.** A short privacy note goes on About when it is enabled.

## 5. Owner review and inputs
1. Approve the placements (screenshots).
2. For go-live, the owner provides:
   - the affiliate program(s) and the store links for specific books;
   - the support link (and QR if wanted);
   - the GoatCounter (or Cloudflare) site code.

   Until then, the code ships switched off.
