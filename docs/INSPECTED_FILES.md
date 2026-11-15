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
