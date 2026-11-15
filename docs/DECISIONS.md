# Architecture & Product Decision Log

## D-001 — Brand
**Accepted:** The Epistemic Diary. Not a personal-name primary publication. Author names belong in bylines/About. No final homepage concept accepted.

## D-002 — Technical foundation
**Accepted direction:** remain Hugo/GitHub Pages; migrate from FixIt to owned templates gradually, only after audited parity. No framework migration without fresh decision.

## D-003 — Visual identity
**Accepted direction:** warm paper/ink/terracotta with matching warm dark mode; editorial minimalism and premium-quality execution; comfortable long-form reading. Typography is a **candidate** set until tested.

## D-004 — Publishing structure
**Accepted direction:** magazine Journal + book-like Volumes/Chapters; Films, Labs, Discover and Resources. Current phase builds data model/components, not production feature pages.

## D-005 — Editorial voice
**Accepted direction:** rigorous, accessible, gently witty, question-driven; debate without falsehood or selective omission. Periodic high-effort YouTube videos and short-form distribution.

## D-006 — Revenue
**Accepted direction:** voluntary reader backing first; optional paid deep content later; contextual affiliate/product discovery; original digital goods; unobtrusive ads/AdSense when viable and compliant. No financial infrastructure in Phases 1–2.

## D-007 — Multi-agent execution
**Accepted:** TASK_BOARD.md is canonical. Claims, evidence, blockers and completion logs are mandatory; one branch/PR per narrow task; separate integration authority.

## D-008 — Visual asset provenance and original editorial style
**Accepted direction:** hybrid original/AI-assisted art, code-generated scientific figures and license-verified real photography. Never misrepresent synthetic imagery as documentary evidence. Maintain a provenance/license manifest. No final homepage wireframe approved. See [VISUAL_ASSET_GUIDELINES.md](VISUAL_ASSET_GUIDELINES.md).

## D-009 — Architecture proportional to product needs
**Superseded in part by D-010:** Hugo public reading remains static and independent of database availability. Git, small changes, server-side authorization for future protected features, backups/migrations, CI/CD and privacy/legal review remain mandatory. See [ENGINEERING_STANDARDS.md](ENGINEERING_STANDARDS.md).

## D-010 — PostgreSQL foundation from Phase 1
**Accepted:** Prepare an extensible PostgreSQL database early, with a local reproducible environment, reviewed schema/migrations, example data and verification/restore instructions (P1-09). Supabase PostgreSQL is a favored managed provider, not yet provisioned. Hugo/Pages articles remain static and must work without database connection. Real accounts, member entitlements, billing, private assets and customer personal data processing remain deferred to separately approved phases. See [DATABASE_FOUNDATION.md](DATABASE_FOUNDATION.md).

## D-011 — Editorial visual direction and prototype-first review
**Accepted direction:** Phase 2 visual standard is defined in [VISUAL_DIRECTION.md](VISUAL_DIRECTION.md): premium magazine × multi-chapter book, warm restraint, intentional editorial hierarchy, strong type, curated illustrations and pixel-level care. User liked the concept moodboard as a *reference*, but has not approved a final homepage layout. Require browser screenshots and maintainer review of a specimen before widespread implementation; automatic checks alone cannot validate aesthetic fit. The moodboard file is not yet checked into the repository; agents must not claim to have inspected it.

## Decision proposal template
### D-XXX — Name
- Status: PROPOSED / ACCEPTED / REJECTED / SUPERSEDED
- Context:
- Options:
- Choice and rationale:
- Consequences and migration:
- Approved by/date:

Agents may propose choices; changes to accepted product direction require maintainer review.
