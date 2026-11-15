# The Epistemic Diary — V2 implementation docs

**Status:** planning / documentation baseline. No site redesign is implemented by this documentation-only branch.

## Project mission
Build **The Epistemic Diary**, an independent, witty but rigorous publication for technology, mathematics, science, economics, and how we know what we know. The experience should feel like an elegantly edited magazine and a multi-chapter book. Readers may arrive for latest tech updates, beginner-friendly guides, deep analysis, experiments, films, and trusted product discovery. Revenue supports better editorial work rather than dominating the interface.

## Source of truth
| File | Purpose |
|---|---|
| [MASTER_PLAN.md](MASTER_PLAN.md) | Scope, phases, constraints, PR sequence |
| [CODEBASE_MAP.md](CODEBASE_MAP.md) | **Where to edit what:** quick navigation without re-reading repository |
| [INSPECTED_FILES.md](INSPECTED_FILES.md) | **What we already know:** cumulative per-file findings, revision and dependencies |
| [TASK_BOARD.md](TASK_BOARD.md) | Single task status ledger; checkboxes, dependencies, ownership |
| [AGENT_LOG.md](AGENT_LOG.md) | Evidence-rich agent activity/handoff log |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Hugo migration and technical boundaries |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Visual tokens and component rules |
| [VISUAL_DIRECTION.md](VISUAL_DIRECTION.md) | **What it should look/feel like:** editorial craft, moodboard direction, prototype approval |
| [VISUAL_ASSET_GUIDELINES.md](VISUAL_ASSET_GUIDELINES.md) | Original/licensed/AI media sourcing and rights |
| [ASSET_MANIFEST_TEMPLATE.md](ASSET_MANIFEST_TEMPLATE.md) | Provenance/credit manifest template |
| [ENGINEERING_STANDARDS.md](ENGINEERING_STANDARDS.md) | Architecture, security, data, migration and CI guardrails |
| [DATABASE_FOUNDATION.md](DATABASE_FOUNDATION.md) | Approved PostgreSQL scope, schema boundaries and acceptance |
| [CONTENT_MODEL.md](CONTENT_MODEL.md) | Magazine, volume, video and product metadata |
| [EDITORIAL_VOICE.md](EDITORIAL_VOICE.md) | Voice and content standard for site/video |
| [SEO_AND_MONETIZATION.md](SEO_AND_MONETIZATION.md) | Search, affiliate, support, ads, digital goods |
| [QUALITY_GATES.md](QUALITY_GATES.md) | Verification and release checks |
| [DECISIONS.md](DECISIONS.md) | Decision record and proposed alternatives |

## Recommended kickoff for Codex
1. Read root [AGENTS.md](../AGENTS.md) and all relevant docs.
2. Begin with **P1-01 (inventory)**, NOT theme deletion or homepage work.
3. Start a separate branch/PR for a small task; log tested evidence.
4. Update [TASK_BOARD.md](TASK_BOARD.md) and [AGENT_LOG.md](AGENT_LOG.md) before handoff.

Multiple agents can work on independent files, but task-board modifications must be serialized or handled by one integrating agent to avoid merge conflicts. Markdown checkboxes do not auto-sync and are not a locking mechanism.

## Existing repository facts (initial inspection; verify during audit)
- Hugo static website deployed to GitHub Pages from main via .github/workflows/deploy.yml.
- FixIt and shortcode-docs-bookmark registered as submodules.
- Custom layouts/index.html embeds sizable inline CSS; assets/css/_custom.scss and _override.scss exist.
- Config spread across hugo.toml and config/_default/*.toml; examine actual precedence.
- Content includes Vietnamese/English variants, sections in mathematics, computer science, economics and philosophy; collection samples include Hugo tutorials and travel guides.
- package.json includes React and Recharts; assets/js/components contains KalmanFilterSim.jsx and NashEquilibriumSim.jsx: do not remove blindly.
- Base URL currently configured as https://trandung6129.github.io/ ; preserve canonical URLs pending explicit migration.
