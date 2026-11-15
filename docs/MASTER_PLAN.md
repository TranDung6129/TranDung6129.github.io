# Master Plan — The Epistemic Diary V2

**Owner of product decisions:** repository maintainer. **Implementation:** AI agents coordinated by TASK_BOARD and PR reviews.
**Last planning baseline:** 2026-11-15. **Status:** approved direction; implementation has NOT begun.

## North star
The Epistemic Diary is an independent editorial publication with a warm, minimal, high-fidelity reading experience. Its public face is **not a personal-name blog**. It combines:
- **Journal:** timely, sourced analysis and explainers, including technology news.
- **Volumes / Chapters:** evergreen interconnected essays read like a book.
- **Films:** thoughtful long-form YouTube videos; companion transcripts and references.
- **Labs:** interactive visualizations, source code, experiments and notebooks.
- **Discover:** evidence-based product/tool recommendations and later affiliate.
- **Reader support:** voluntary one-off/monthly backing first; selective premium later.
- **Digital goods and ads:** optional future revenue, never at the expense of readability.

Editorial influences: science storytelling and experiments (Veritasium), mathematical visualization (3Blue1Brown), humorous approachable Vietnamese explainers (Vui Vẻ / Mèo Biết Tuốt / Lóng). Draw on principles; **do not imitate scripts, artwork, or identities**. Write rigorously, with humor and open questions, not misleading omissions.

## Guardrails
- Preserve existing light/dark tone. Warm paper, brown ink, terracotta; calm nighttime palette.
- Preserve excellent long-form reading. Mobile-first, keyboard-accessible, SEO-first.
- Prefer controlled, maintainable Hugo templates over exchanging one dependency-heavy theme for another.
- The original homepage concept is **not approved**; do not implement homepage redesign in this scope.
- Avoid brand name derived from author name. Author attribution still permitted within content.
- Free content and recurring support are central; avoid aggressive paywalls/ads.

## Implement now
### Phase 1 — Audit, cleanup, migration foundation
1. Freeze baseline: backup branch, build logs, URL inventory, assets, screenshots (if possible).
2. Audit all content paths, shortcode calls, FixIt-provided features, layouts, JS, dependencies, theme update jobs and configuration overlaps.
3. Identify KEEP / REPLACE / REMOVE candidates with evidence. No speculative deletions.
4. Implement minimal custom Hugo base layouts, navigation shell and article rendering on a branch, progressively replacing FixIt while maintaining functionality.
5. Preserve URLs, translations, search, RSS, math, code, TOC and dark mode or log and resolve parity gaps.
6. Retire FixIt and unused modules only after passing Phase 1 exit gates.
7. Prepare structured content types and SEO metadata without migrating existing content URLs unnecessarily.

### Phase 2 — Editorial design system and tested components
1. Define semantic light/dark tokens, spacing, typography, layout breakpoints, motion and accessibility.
2. Test typefaces in Vietnamese and English, including equations/code/long articles.
3. Build reusable Hugo partials and CSS for header, navigation, footer, editorial/article cards, citation, TOC and content interactions.
4. Create **non-transactional** specimens for Volume/Chapter, Film/Lab, Support, Product/Disclosure, Premium preview and AdSlot; no fake active purchase.
5. Validate on mobile/desktop and long-form pages against design and quality gates.
6. Finish with documentation of usage and examples. Do not ship untested components.

## Defer: later decision gates, NOT a mandate to implement
- **Phase 3:** homepage editorial direction, final IA/navigation, journal and discover page layout.
- **Phase 4:** production workflows for articles, volumes, labs, films; newsletter and real newsroom workflow.
- **Phase 5:** verified affiliate integrations, product catalog, external digital checkout, analytics.
- **Phase 6:** memberships/support payments and access controls, optional premium, ad slots/AdSense when eligible.
All deferred features must be separately scoped and approved.

## Target PR sequence (small PRs preferred)
1. PR-A: baseline audit, inventory, URL map, KEEP/REMOVE/REPLACE ledger.
2. PR-B: foundation, layouts and compatibility tests.
3. PR-C: tokens, typographic specimen and reading layout.
4. PR-D: shared UI component gallery/specimens.
5. PR-E: fix parity gaps, safe FixIt retirement, regression and release notes.

## Non-negotiable exit gates
**Phase 1:** clean build; no lost visible content/URLs/assets/translations; parity for current essential features; no hidden premium content exposed; no broken production deployment.
**Phase 2:** consistent tokens; accessible responsive navigation and readable articles; components documented; documented measured performance; no new regressions; reviewer approves visual direction.

## Commercial principle
Trust precedes monetization. Use relevant affiliate discovery, reader-backed membership, original digital products and later unobtrusive ads. Do not fabricate testing, engagement, earnings or independent editorial judgement. Track business metrics while protecting user experience.
