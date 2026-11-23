# D4 — Implementation plan (after owner approval of DESIGN_SPEC)

One PR, branch `feat/d4-content-architecture`. Every step keeps public URLs (QUALITY_GATES: zero unintended disappeared URLs).

1. **Move the prototype into place.**
   - Templates: `term.html`, `views/{journal,series,volumes,discover}.html`, `series/single.html`, `editorial/series-*.html`, `editorial/resource-item.html`.
   - Styles: `d4.css` added to `head-assets.html`.
   - Strings: i18n keys in all four languages.
   - Article header: `article.html` calls `series-position` instead of `volume-position`.
2. **Volume I → Series.**
   - Create `content/series/toan-co-ban-cho-kinh-te{,.en}.md`.
   - Move `aliases` from `volume-i*.md` (the retired collections URLs) and add `/volumes/volume-i/` and `/en/volumes/volume-i/` as aliases of the series.
   - Delete `volume-i*.md`.
   - Change `page-art.html` (Further Essays art "via volume") so it no longer depends on volumes. Covers stay in `data/art.yaml`.
3. **Topics 6 → 4.**
   - Delete `content/categories/{vat-ly,ca-nhan}` (no essays use them).
   - Add redirects `/categories/vat-ly/` → `/categories/toan-hoc/` and `/categories/ca-nhan/` → `/categories/triet-hoc/` (+ en) in `data/redirects.yaml`.
   - Update the topic descriptions.
   - Remove `vat-ly` and `ca-nhan` from `mainSections` if no section exists.
4. **Discover.**
   - `data/resources.yaml` replaces `data/discover.yaml`.
   - The homepage "resource pick" is not part of D4 (homepage changes need their own approval).
5. **No false dates.** Pin `lastmod` on any essay touched only for metadata (see AGENT_LOG 2026-11-24).
6. **Tests.**
   - Extend `scripts/test-d1.cjs` with the series box.
   - New `docs/audits/d4/tools/d4-check.cjs`: the 32-state matrix; keyboard through topic and series pages; every alias and redirect resolves.
   - Update `p3-smoke.cjs` (Volume I route → series).
   - Diff the route list against `main`.
7. **Docs.** DECISIONS D-018, CODEBASE_MAP, INSPECTED_FILES, AGENT_LOG, TASK_BOARD; then owner approval to merge and a production check.
