# Inspected File Registry — Persistent Code Understanding

**Purpose:** cumulative per-file knowledge for all AI agents. Read existing verified summaries before opening source. When inspecting a file **for any reason**, update its record as part of the SAME task/PR, even if the requested symbol or feature was not found.

This is a **living index**, not an infallible substitute for source code: before an edit, validate the inspected file's Git blob SHA and relevant dependent files. When unchanged, reuse its explanation. When changed, inspect and update **only changed portions and affected dependencies**. Never infer that a file remains identical merely because a summary exists.

## Two complementary indexes
- [CODEBASE_MAP.md](CODEBASE_MAP.md): *where* to modify a feature; fast entrypoint and ownership.
- **This registry:** *what an inspected file contains*, how it works, relationships, relevant symbols, gotchas, evidence, and its reviewed version.

## Mandatory opportunistic capture
During every search/read/scan:
1. **Check registry first** and validate any existing entry against `git rev-parse HEAD:<path>` or `git hash-object <path>` for working-tree state. Uncommitted edits require inspecting changed hunks regardless of commit SHA.
2. If file previously documented **and unchanged**, trust its factual navigation summary to narrow inspection; open file again only when precise implementation details are required, the summary is insufficient, or integration/security risk warrants verification.
3. If new file or changed file, inspect enough to understand its role **and record useful information, not just present/absent**. Capture major exports/functions/partials, config keys, callers/consumers, outputs, side effects, external dependencies, constraints, and test path.
4. If your search did not fully inspect the file, mark **PARTIAL**. Do not invent unexamined behavior or claim COVERED just because search matched a line. Recording a small accurate summary is better than skipping it.
5. Before completing PR, update registry entries for **all newly read, modified, added or removed files**. Update feature map when responsibilities or paths change; update this registry even if ownership stays the same.
6. If code moved or was deleted, mark **MOVED/REMOVED**, point to replacement, and retain short historical note.
7. Use task-local one-pass notes and a single commit update to reduce cross-agent conflicts; shared registry edits should be serialized via integrator/PR. When another PR changes the same file, rebase and compare blob SHA before asserting "verified".
8. Avoid copying source or generating verbose one-entry-per-dependency boilerplate; summaries should make the next agent productive in less than a minute. Existing P1-01 TSVs are a machine-readable *inventory*, **not** complete file-level semantic summaries.

## Required record fields
| Field | What to capture |
|---|---|
| Path | Exact current relative path; any previous path if moved |
| Status | COVERED (read and role verified), PARTIAL (limited search), STALE (changed), REMOVED |
| Reviewed at | Date + agent/task/PR |
| Reviewed version | Git blob SHA (`git rev-parse <ref>:<path>`) and ref/commit; or working tree hash with explicit uncommitted flag |
| Responsibility | One- or two-sentence purpose and effects |
| Key symbols / config | Relevant functions, partial names, config keys and inputs/outputs; avoid line numbers alone |
| Connections | Callers, imports, dependencies, generated/public output, route/shortcode consumers |
| Edit guidance | When/how to change, risks, invariants, cross-file impact |
| Verification | Relevant test/command and evidence status; distinguish source inspection from tested browser behavior |
| Unknowns | Questions requiring future targeted inspection |

## Format for new entries
### `path/to/file.ext`
- **Status:** PARTIAL | COVERED | STALE | REMOVED
- **Reviewed:** YYYY-MM-DD; agent/task; commit/ref; blob SHA
- **Purpose:** ...
- **Key symbols / behavior:** ...
- **Callers / dependencies / outputs:** ...
- **Edit here when:** ...
- **Validation / unknowns:** ...

## Coverage as of P1-01 audit (2026-11-15)
The P1-01 report has genuine evidence for the following responsibilities. **The summaries below are audit-derived, not a claim that all source lines have been exhaustively read or that live browser behavior passed.** Individual file SHAs/coverage must be filled when the next agent inspects those files.

| File / area | Audit-backed knowledge | Coverage |
|---|---|---|
| `layouts/index.html` | Active home content, six fixed category sections, seven recent-post section filter; CSS embedded; calls heatmap partial | PARTIAL |
| `layouts/partials/heatmap.html` | D3 v3 + Cal-Heatmap 3.3.10 via CDN, activity data and themed rendering | PARTIAL |
| `layouts/_partials/single/collection-list.html` | Collection/chapter links, prev/next UI; currently uses FixIt helper partials | PARTIAL |
| `layouts/shortcodes/react.html` | React dynamic mount shortcode, two Nash article callers, JS build and mobile fallback | PARTIAL |
| `assets/js/components/NashEquilibriumSim.jsx` | Interactive payoff/strategy visualization; React hooks + Recharts, used in content | PARTIAL |
| `assets/js/components/KalmanFilterSim.jsx` | Mock React component; no current content consumer found | PARTIAL |
| `assets/css/_custom.scss` | Theme-imported palette, typography, article and collection styling | PARTIAL |
| `assets/css/_override.scss` | Comments-only layer, imported by theme; cleanup candidate | PARTIAL |
| `assets/js/custom.js` | Theme-included starter greeting JS, emitted into public build | PARTIAL |
| `hugo.toml`, `config/_default/*.toml` | Both root and config directory contribute active configuration; see precedence matrix | PARTIAL |
| `.github/workflows/deploy.yml` | Hugo/Node build, Pages publish; no PR build trigger in audit | PARTIAL |
| `.github/workflows/update-theme.yml` | Daily update changes FixIt and triggers follow-up deploy | PARTIAL |
| `content/kinh-te/game_theory_nash.md`, `.en.md` | Nash React invocation and video; missing poster URL | PARTIAL |
| `manim/game_theory_nash.py`, `media/` | Video source and tracked intermediates; duplicate final video in media | PARTIAL |

**Source evidence:** [P1-01 audit](audits/P1-01.md), [assets/content report](audits/p1-01/assets-and-content.md), [config/deployment report](audits/p1-01/config-and-deployment.md), [tracked-file inventory](audits/p1-01/tracked-files.tsv). Agents should upgrade PARTIAL to COVERED with exact per-file blob SHA and relevant validated behavior when actually reading the whole relevant file.

## Do not waste tokens on this
- Repeatedly describing the same unchanged file in AGENT_LOG; link this registry entry instead.
- Re-reading thousands of vendored FixIt files by default. Use a component-level overview and only inspect necessary vendor partials; vendor version/hash matters.
- Automatically generating giant summaries of `node_modules`, binary media, minified/generated output or every template from dependencies. Summarize at module level with hashes and entrypoints.
- Pretending a SHA matches if an active branch differs from main: validate against the **working branch** and any uncommitted edits.
- Treating a registry as immutable truth. If runtime evidence contradicts a note, update it with the newer evidence.

## Maintenance protocol
Each PR must include a short `Knowledge captured` section (new/updated entry paths, statuses, affected dependencies). The reviewer checks that every file the agent **actually inspected** was accounted for, at least as a PARTIAL entry or within a clearly identified reviewed module group. Do not mark implementation tasks DONE until this bookkeeping and necessary tests are complete.

## 2026-11-15 — P1-01 acceptance reconciliation

Reviewed on `docs/p1-01-acceptance`, based on `aae95e9`. Versions below are working-file Git blob hashes at inspection; registry self-entry records its pre-append blob. Coverage is PARTIAL (role/relevant clauses verified, no claim of external deployment or whole-application execution). Verification: fetched merge graph, fresh Hugo build and `verify.py` passed with 645 unchanged files. No runtime ownership paths changed.

| Path | Reviewed blob | Responsibility, dependencies and edit risks | Coverage |
|---|---|---|---|
| `AGENTS.md` | `283fb0f2870e3c3ae6ce0424ea9b233d9b5a77b3` | Agent entrypoint; scope, serialized claims, evidence and per-file knowledge rules; governs every task. PostgreSQL allowed locally only. | PARTIAL |
| `docs/README.md` | `5ae68728c91c0efbfd94225f801f77a01a14f450` | Documentation index linking workflow/product/database/visual specs; entrypoint for onboarding, not implementation evidence. | PARTIAL |
| `docs/CODEBASE_MAP.md` | `c3ee7af936e145fa52fdd1783169eda1d78f4c9f` | Feature-to-owner routing and modification log; directs targeted source inspection; update when adding entrypoints. | PARTIAL |
| `docs/INSPECTED_FILES.md` | `4a568f12173c5a593bd95acba8a7aec3dbc1cc04` | Cumulative purpose/dependency/blob/coverage registry; self-entry references pre-update blob, avoiding a recursive hash claim. | PARTIAL |
| `docs/MASTER_PLAN.md` | `4470cd58cd4597135b247d5f298227e6cec3df6a` | Ordered P1/P2 roadmap and phase exit gates; public Hugo preserved; P1-09 local DB must follow approved architecture. | PARTIAL |
| `docs/TASK_BOARD.md` | `f24dbc36bc57df57a504adf88d4b5ae2b6d7eed6` | Canonical task/dependency/status ledger; P1-01 accepted through merged PR #13 and retest; P1-02 next; P1-09 depends P1-03. | PARTIAL |
| `docs/ARCHITECTURE.md` | `209c35a7637edde3340cb31441ea13ea8ad1f227` | Gradual FixIt migration, URL retention, effective config and DB boundaries; depends on P1-01/P1-02 evidence before P1-03 design. | PARTIAL |
| `docs/DESIGN_SYSTEM.md` | `3de7531815910df722f0ce8c052d092a4bcfe01e` | P2 semantic palette/type/component targets; no approved homepage layout; actual contrast/responsive tests required later. | PARTIAL |
| `docs/VISUAL_ASSET_GUIDELINES.md` | `a685802a69d9945498e69b7bd257385e05ebed6d` | Asset sourcing, rights, synthetic honesty, alt/crop/performance workflow; applies to new shipped art, not baseline screenshot rights claims. | PARTIAL |
| `docs/ASSET_MANIFEST_TEMPLATE.md` | `7ffbdfd1ce18b3dc83a50b96bc889b30d7844cc7` | Provenance schema/checklist for future published assets; example fields are specimens, not actual licensed media records. | PARTIAL |
| `docs/ENGINEERING_STANDARDS.md` | `71a05d70d3982fd873745e99c39822291edd79c5` | Static/DB service boundaries, security, migrations/recovery, CI/privacy; local DB approved, hosted services/auth/billing deferred. | PARTIAL |
| `docs/QUALITY_GATES.md` | `8914d7729b3f330d8e5334b08f1a084d09e73d3c` | Per-PR build/routes/metadata/browser/knowledge evidence and phase exits; existing baseline defects must be distinguished from regressions. | PARTIAL |
| `docs/CONTENT_MODEL.md` | `de2e087ddecde79a71d48f27e83ed2aa4a02be7c` | Optional editorial/frontmatter and access semantics; preserves article bodies/URLs, no forced schema rewrite. | PARTIAL |
| `docs/EDITORIAL_VOICE.md` | `6dbd468df8c3c344c773afe8c290c0ea6321aa2b` | Source-aware narrative, accuracy and disclosure rules; governs future writing without rewriting current content in audit. | PARTIAL |
| `docs/SEO_AND_MONETIZATION.md` | `528ae99094409023f2ff097adc06976261ac2fa2` | Canonical/hreflang/distribution principles and deferred commercial flows; no active payments or affiliate tracking authorized. | PARTIAL |
| `docs/DATABASE_FOUNDATION.md` | `80087fd4ecdeb223cd879cba8a3701d0e2049775` | P1-09 acceptance: local PostgreSQL, versioned migration, demo seed, connection/repeatability and restore tests; no article DB runtime. | PARTIAL |
| `docs/DECISIONS.md` | `daa098124b0116f0b91f867f64dc69053da48af9` | Accepted D-001–D-010 product/technical decisions; D-010 partially supersedes D-009, local PostgreSQL only at approved task dependency. | PARTIAL |
| `docs/AGENT_LOG.md` | `5daab93048163ecad0f07c8e42c092fd460b1d1d` | Append-only claims/evidence/handoff; P1-01 original BLOCKED history retained and superseded by explicit acceptance entry; task board controls state. | PARTIAL |
| `docs/audits/p1-01/verify.py` | `d936eff54c8eb4af55a8ac5202a74aca0be89cc2` | Read-only output comparator checks routes, bytes, language/title/canonical, emitted consumers and outputs; assertion retains known absent poster, not runtime proof. | PARTIAL |

Audit evidence module `docs/audits/p1-01/` (tree `4b62518085cc39774d24ad2533166f98b4f4d374`) is reused from merged PR #13: TSVs inventory Git objects; JSON/logs/routes record production emission, scripts regenerate/check evidence. Generated/binary/vendor content is treated as module-level evidence, not new exhaustive per-file inspection. No browser behavior inferred from HTML markers.
