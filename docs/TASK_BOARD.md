# Task Board — canonical status ledger

**How to use:** Each agent may tick [x] **only after** task acceptance and evidence are logged in AGENT_LOG.md. Status field is authoritative: TODO / IN PROGRESS / BLOCKED / DONE. One claim per agent. Avoid simultaneous edits to this file; use a dedicated integration PR or serialize updates. Tasks are initially **unclaimed**.

## Phase 1 — Audit, cleanup & foundation

| Check | ID | Task / acceptance | Depends | Status | Owner |
|---|---|---|---|---|---|
| [x] | P1-01 | Inventory all files, deployments, config precedence, active assets/shortcodes/theme use; publish KEEP/REPLACE/REMOVE matrix with proof | — | DONE | Codex (PR #13 accepted) |
| [x] | P1-02 | Capture baseline: Hugo version/build, route list, language variants, RSS/search/math/code/TOC/theme behaviors, broken links, current performance | P1-01 | DONE | Codex (PR #17 reviewed and merged; existing defects logged) |
| [x] | P1-03 | Decide custom Hugo template architecture, configuration model and migration strategy; record decision | P1-01, P1-02 | DONE | Codex |
| [x] | P1-04 | Implement base, header/footer, section/single templates and compatibility layer; build passes while old functionality remains | P1-03 | DONE | Codex (implementation) + Claude Code (runtime verification); PR #19, acceptance = maintainer merge |
| [x] | P1-05 | Consolidate duplicate CSS and configuration; remove only demonstrably unused packages/old overrides, with proof | P1-04 | DONE | Claude Code; PR stacked on #19, acceptance = maintainer merge after #19 |
| [x] | P1-06 | Adopt content metadata/schema and SEO defaults without breaking permalinks or translations | P1-03, P1-04 | DONE | Claude Code; PR stacked on #20, acceptance = maintainer merge after #19 and #20. Editorial backlog in `docs/audits/p1-06/README.md` |
| [x] | P1-07 | Verify parity and safely remove FixIt/unused submodules and obsolete theme update workflow | P1-04, P1-05, P1-06 | DONE | Claude Code; `feat/p1-07-retire-fixit`, acceptance = maintainer merge. Live deployment check is P1-08 |
| [x] | P1-08 | Final Phase-1 regression, rollback notes, deployment smoke test and sign-off | P1-02, P1-07, P1-09 | DONE | Claude Code; live smoke of deployed `3569afe` (run 43733870614), `docs/audits/p1-08/README.md`. Phase 1 awaits maintainer final acceptance |
| [x] | P1-09 | PostgreSQL foundation: review schema boundary, local dev setup, versioned migration, seed/demo data, env.example, connection/migration tests and backup/restore drill; no live auth/payments/hosted provision claim | P1-03 | DONE | Codex (PR #21, local integration verified) |

## Phase 2 — Editorial design system

| Check | ID | Task / acceptance | Depends | Status | Owner |
|---|---|---|---|---|---|
| [x] | P2-01 | Establish color/spacing/size/motion tokens for both themes, document contrast and semantics | P1-03 | DONE | Codex |
| [x] | P2-02 | Typography specimen: test Vietnamese/English, headings, prose, math, code, captions and long-form readability | P2-01 | DONE | Codex |
| [x] | P2-03 | Accessible navigation primitives, buttons, focus states, mobile behavior, reduced motion | P1-04, P2-01 | DONE | Codex |
| [x] | P2-04 | Editorial components: article cards, lead, quotes, media, code, TOC, citations, chapter navigation | P2-01, P2-02 | DONE | specimen_design / Codex |
| [x] | P2-05 | Future-ready *visual-only* support/membership, Discover/affiliate, premium teaser, film, lab and ad specimens with disclosures | P2-01, P2-04 | DONE | Codex |
| [x] | P2-06 | Component showcase, usage docs, light/dark/mobile/accessibility/performance validation and sign-off | P2-02, P2-03, P2-04, P2-05 | DONE | Codex + owner final acceptance; reversible visual approval, selected fonts |

## Phase 3 — End-to-end production integration

Plan, scope and acceptance: [docs/phases/phase-3/PLAN.md](phases/phase-3/PLAN.md). Owner-authorized autonomous delivery, 2026-11-15.

| Check | ID | Task / acceptance | Depends | Status | Owner / PR |
|---|---|---|---|---|---|
| [x] | P3-01 | Production design system: tokens (dark `#1A1816`), local fonts, shared components, editorial shell | P2-06 | DONE | Claude Code, PR A; evidence `docs/audits/p3-07/` |
| [x] | P3-02 | Homepage integration from real Hugo data | P3-01 | DONE | Claude Code, PR A |
| [x] | P3-03 | Journal landing, lists and article reading experience; MathJax/code/TOC/shortcodes kept | P3-01 | DONE | Claude Code, PR A |
| [x] | P3-04 | Volumes and chapters | P3-03 | DONE | Claude Code, PR B |
| [x] | P3-05 | Films and Labs; Nash unchanged | P3-03 | DONE | Claude Code, PR B |
| [x] | P3-06 | Discover, global navigation, search, multilingual behaviour | P3-04, P3-05 | DONE | Claude Code, PR B |
| [x] | P3-07 | QA and regression report (routes, SEO, runtime, browser matrix, a11y, performance, visual) | P3-01..06 | DONE | Claude Code, PR C; `docs/audits/p3-07/README.md` |
| [ ] | P3-08 | Production deployment and live sign-off | P3-07 | TODO | Claude Code, PR D |

## Deferred backlog (do NOT check off or implement without new approval)
- [ ] F3-01 Homepage concept exploration and actual redesigned homepage
- [ ] F3-02 Journal/Volumes/Films/Labs/Discover production pages
- [ ] F4-01 YouTube long-form publication process and episode pipeline
- [ ] F5-01 Verified affiliate data feeds, vendor offers, click reporting
- [ ] F5-02 External checkout and downloads for original digital products
- [ ] F6-01 Real one-off/recurring support billing and secure membership access
- [ ] F6-02 AdSense eligibility, consent/compliance review and controlled ad placements

## Evidence & completion rules
- Every DONE task must link to a PR/commit, file(s), exact tests and relevant screenshots/measurements in [AGENT_LOG.md](AGENT_LOG.md).
- Changed docs alone **do not** complete implementation tasks.
- One unit of work per agent/PR; no agent may mark a dependent task DONE before dependencies are DONE.
- If failures remain, record BLOCKED or IN PROGRESS with a concrete blocker.
- Only maintainer/integration reviewer declares overall Phase 1 or Phase 2 complete.
