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

## 2026-11-15 — P1-02 baseline and contributor review

Reviewed on `audit/p1-02-baseline` (main `aae95e9`, claim `808ae64`). Hashes are Git blobs of inspected final working files, except this registry self-entry is pre-append. Only integrator edits shared documents. Existing unchanged planning summaries above were reused. Contributor source-doc hash/purpose handoff is preserved in browser/REPORT.md; no application source was read by the browser/static contributors.

| Path | Reviewed blob | Purpose / consumers / risk / validation | Coverage |
|---|---|---|---|
| `docs/audits/P1-02.md` | `ad7ee51ec5ae89a9d708d765092eac76faad8d99` | Baseline entrypoint; build/route/static/browser evidence, existing defects and P1-03/P1-09 boundaries; depends on capture reports, not a migration decision. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/audits/p1-02/RUNBOOK.md` | `3b1d9770ec2bc69e7886ab83196182343ebc589a` | Replay commands for pinned Hugo, isolated analyzer/fixture and external Playwright/system Chromium; historical retained output required for byte comparison. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/audits/p1-02/PR_BODY.md` | `67472586780f0d635f13c1b284855fef33f20968` | Prepared narrow stacked-PR scope, validation and knowledge/impact handoff; no PR URL until API succeeds. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/audits/p1-02/static/REPORT.md` | `b1b7e1c19eaaf8633724568777342572c7ece9c0` | Static counts/method/limitations and categorized missing references; four canonical collision groups corrected against machine JSON. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/audits/p1-02/static/analyze.py` | `3e18bcc236d0349feddb57e6a4d7753c61cd4e0e` | Stdlib Page HTMLParser resolves refs/fragments with urllib, parses XML/search, records metadata/images/features/routes; asserts capture/retention not zero existing defects. Depends only on generated site and frozen P1-01 routes/CSV. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/audits/p1-02/static/test_analyzer.py` | `7ab49acbba261f3a6c3b31797e3def8a46142146` | Isolated unittest temp-site fixture validates normalization, aliases, missing target vs fragment and nonzero exit on removed route; meaningful negative control; no source mutations. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/audits/p1-02/browser/REPORT.md` | `f61d23ff287cc3eb8e5a784da79782a428b201b4` | Final8 assertions,16 shots, keyboard sample/performance/error limits and inspected-doc handoff; exploratory harness issues superseded by corrected final evidence. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/audits/p1-02/browser/baseline.cjs` | `6bb142cbfcc1cad96732aa5adb32d45c93144e84` | Playwright browser runner against1314 captures routes, errors, screenshots/timings and8 behavioral assertions; uses system Chromium, no trust bypass, failed check causes nonzero exit. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/audits/p1-02/browser/keyboard.cjs` | `39b2d64f315a6719bba2b973884cebafc43837e9` | Supplemental Tab/reduced-motion/console sampling at360/1440; writes keyboard.json in /tmp; observational sample not full accessibility test. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/audits/p1-02/artifact-blobs.tsv` | `dfb56436ed6993740d79b6dc35a94f437a207f58` | Generated-artifact Git-blob/size manifest for baseline JSON/log/routes/screenshots; reproducibility locator, not a new whole-repo inventory. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/CODEBASE_MAP.md` | `72c2e15ed901c82dfae5d04e0374905fd7d9d48b` | Adds baseline test/report owners and modification record; application ownership remains unchanged; registry and report depend on map navigation. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/TASK_BOARD.md` | `64102f5a442263ffb3498845435dba0f22b10576` | P1-01 DONE via merged#13+retest; P1-02 BLOCKED solely for separate PR creation; P1-03/P1-09 remain TODO with existing dependency gates. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/AGENT_LOG.md` | `9e5138efceb2c925513dca144e472fcb79bf2b92` | Appends P1-01 acceptance and P1-02 claim/evidence/results/blocker; retains earlier history; exact paths/commands and test limits prevent implied deployment approval. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |
| `docs/INSPECTED_FILES.md` | `248441314147c9956339add5f74d40dae28cf2ee` | Living revision/purpose registry; this self-entry stores pre-append blob; per-file source rows and generated group avoid stale ownership claims. Validation: fixture/static rerun, final8 browser assertions and scoped source diff recorded in AGENT_LOG. | COVERED |

Generated/binary module `docs/audits/p1-02/` JSON/log/routes/screenshots: PARTIAL, parser fields and sampled browser states only. Exact per-artifact Git blobs are in `artifact-blobs.tsv`; module manifest SHA256 `dcaff479e3f15e910cea6f407c268d9807298477e9f111c8cad1eae4a5fb1392`. JSON includes full metadata, missing-target provenance, image digests, XML/search counts, runtime/keyboard observations and P1-01 byte-retention comparison;16 PNGs are unedited viewport captures, two visually opened. Dependencies are unmodified Hugo/FixIt/content+local HTTP/browser; external errors preserved. Edit/regenerate only with documented baseline source/tool versions; no full link/CSS/JS crawl, a11y/SEO, production CWV or live deployment claim.

Reused P1-01 source CSV and route artifacts: PARTIAL; `content-pages.csv` blob `0fc0b18babb32b4526d2c750653b1ee117276863` supplies24vi/24en source counts; `routes-after.txt` blob `6d18a022b4125e4271d6fc3e6d8540c2795cfd77` supplies645 frozen public paths. Consumers: analyzer and parity comparison; neither artifact alone proves runtime/translation quality. Previously reviewed AGENTS/QUALITY_GATES roles and unchanged blobs remain valid; CODEBASE_MAP/registry changes are captured above.

## 2026-11-15 — P1-03 decision review

Git working-file blob hashes at review; registry self hash is pre-append. All entries PARTIAL: targeted roles and implications reviewed; build and baseline analyzer passed as recorded in AGENT_LOG. Existing P1-01/P1-02 artifact group records remain applicable.

| Path | Git blob | Purpose, dependencies and risks |
|---|---|---|
| `AGENTS.md` | `006e02c26e301ca92494903e519efbf3c778db3f` | Agent workflow, safeguards, registry and D-011/P1-09 gates. |
| `docs/TASK_BOARD.md` | `4b9af2f23e10a9e9f0b492cc92ef8c2d4ad4b5b1` | Canonical claims, dependencies and task status; P1-03 decision completed on this branch. |
| `docs/DECISIONS.md` | `5bccb094ef5df421c01631520897947cf1760a09` | D-012 adds chosen Hugo template, config migration and database migration conventions; D-010/D-011 remain controlling. |
| `docs/ARCHITECTURE.md` | `9266866e2034c245268d601b872f6a7f757b41f1` | Migration boundaries and pointer to D-012; future paths are not implemented. |
| `docs/CODEBASE_MAP.md` | `1acfc3893fe1cf9dfed1e034ea4124dabf636b05` | Current feature ownership; adds prospective D-012 pointer without asserting new templates exist. |
| `docs/DATABASE_FOUNDATION.md` | `80087fd4ecdeb223cd879cba8a3701d0e2049775` | P1-09 local PostgreSQL acceptance, static Hugo boundary and restore tests. |
| `docs/VISUAL_DIRECTION.md` | `9181d328d71d874bc95c44daca2dec5a7607bd0c` | D-011 specimen and owner visual approval gate; homepage composition not approved. |
| `docs/audits/P1-02.md` | `ad7ee51ec5ae89a9d708d765092eac76faad8d99` | 645-path baseline, browser results, known link/metadata defects and external runtime limitations. |
| `docs/QUALITY_GATES.md` | `657ae0681667e282a6e979d69f2ba572b23f3e32` | Route, build, metadata, accessibility, performance and evidence gates for subsequent implementation. |
| `docs/INSPECTED_FILES.md` | `d68c4efc4edb2d31a97e3579c2e3c574567db048` | Cumulative inspected-file registry; self hash is pre-append. |
| `docs/AGENT_LOG.md` | `119ec13e1b3acf199abb4bda12bb43b0e12cd8d3` | Claims and evidence; P1-03 entry records commands and limitations. |
| `hugo.toml` | `31ba0a8a84864500f4b96eb87a744d46bbb52c77` | Root Hugo config contributes cascade, math and pagination; effective behavior overlaps split config. |
| `config/_default/hugo.toml` | `ff107c0c3ce681d919e50f25c91e1feb6b388f6f` | Project title/base URL and active theme list override root conflicts. |
| `config/_default/params.toml` | `61861b802993602aabc4e57f6f926f1caefe9005` | Theme search, appearance, math and injected partial settings; preserve consumers until migration. |
| `config/_default/outputs.toml` | `63a58b15da2925adc6056f74d2cabc7b4a1dc02a` | Home and page output configuration; feeds/search depend on effective merge. |

## 2026-11-15 — P1-04 compatibility implementation

Working-file Git blob hashes at inspection (registry self hash is pre-append). Coverage PARTIAL unless scoped to authored adapter; exact build/browser evidence and limits in [P1-04 report](audits/p1-04/README.md). Agent contributors inspected source, integrator owns shared documentation.

| Path | Blob | Purpose, consumers and risks |
|---|---|---|
| `layouts/_default/baseof.html` | `3f49d4ec77963d5a1db23aae5f1e1f210e1e4a6a` | Owned FixIt-derived HTML shell, initializes theme and renders head/widgets/assets; uses site adapters. Affects every page including home. |
| `layouts/_partials/site/header.html` | `995c16d5685f3cbaa009568fafb961bbf686f32a` | Compatibility adapter delegates FixIt header with navigation, search, language and theme controls. |
| `layouts/_partials/site/footer.html` | `9bfc1a7c25a754a977c3dfb1e61814024f0564d4` | Compatibility adapter delegates FixIt footer and custom hooks; cached by shell. |
| `layouts/posts/single.html` | `41f4ad1050ed84f1834b8575926adccaa609fe46` | Type-specific owned post template retaining FixIt article helpers, TOC, collection navigation, content and comments; title uses owned partial. |
| `layouts/section.html` | `1b12ed761c0783d4f1e9356f037c643a796ded47` | Active section template delegates archive body to owned partial while preserving title. |
| `layouts/_default/list.html` | `1b12ed761c0783d4f1e9356f037c643a796ded47` | Generic list fallback delegates owned section-content partial; not active for current section lookup. |
| `layouts/_default/single.html` | `18130a7545efe23c4301cab7d2091286768e39c6` | Generic single fallback adapted from FixIt page template; current posts use type-specific template. |
| `layouts/_partials/p1-04/post-title.html` | `0da4467325604cc8693ce288dadb2ae315e12cae` | Renders localized/capitalized post title and site suffix for posts/single. |
| `layouts/_partials/p1-04/section-content.html` | `2c6b26a8288df8609636e89665ec91f0282876f4` | Year-grouped archive, paginator, icon and recent-update compatibility; trims final whitespace to preserve development output. |
| `layouts/_default/FIXIT-LICENSE.txt` | `2b4cb5adcfe4b2e054409759ce434aeb1224849e` | Upstream MIT license for adapted FixIt templates; keep attribution when altering copies. |
| `docs/CODEBASE_MAP.md` | `b789892f3aac98f93b36766f8eee9803e7f8b4c6` | Documents new compatibility entrypoints, active vs fallback and remaining theme ownership. |
| `docs/TASK_BOARD.md` | `0e646bfde7590dbc2a0b2a74b78b839d88f926da` | P1-04 claimed and blocked on trusted external MathJax/heatmap runtime parity. |
| `docs/AGENT_LOG.md` | `aa0ed2dff6633cbfc7f514c610e2e0087a7c6d0a` | Claims, scoped implementation, tests, contributors, blockers and next actions. |
| `docs/audits/p1-04/README.md` | `524d143a100acb826d7d3c853a497b6c9746c1c8` | Reproducible production/development/lookup/browser evidence and explicit unverified runtime gate. |
| `docs/audits/p1-04/artifact-blobs.tsv` | `d3f95226859a148e99473cbd61ab149a8c14fe83` | Manifest of generated report/screenshot Git blobs and sizes for baseline evidence. |
| `docs/INSPECTED_FILES.md` | `e596c21f1d9486592d4e8c0984b7c0c47cf22eb4` | Revision-aware knowledge registry; self hash records state before this append. |
| `AGENTS.md` | `006e02c26e301ca92494903e519efbf3c778db3f` | Workflow, task ownership, documentation, visual and content preservation safeguards. |
| `docs/DECISIONS.md` | `5bccb094ef5df421c01631520897947cf1760a09` | D-012 prescribes site-owned incremental compatibility and browser parity before theme removal. |
| `docs/QUALITY_GATES.md` | `657ae0681667e282a6e979d69f2ba572b23f3e32` | Build, routes, browser, accessibility, evidence and deployment gates. |
| `docs/audits/p1-02/browser/baseline.cjs` | `6bb142cbfcc1cad96732aa5adb32d45c93144e84` | Playwright reference harness for real browser interactive assertions and viewport captures. |
| `docs/audits/p1-02/browser/keyboard.cjs` | `39b2d64f315a6719bba2b973884cebafc43837e9` | Reference keyboard and reduced-motion observation harness. |
| `docs/audits/p1-02/static/analyze.py` | `3e18bcc236d0349feddb57e6a4d7753c61cd4e0e` | Static route, links, metadata, search and XML baseline analyzer. |
| `docs/audits/p1-02/static/test_analyzer.py` | `7ab49acbba261f3a6c3b31797e3def8a46142146` | Fixture proving analyzer route and URL/fragment behavior. |
| `docs/audits/p1-02/static/routes.txt` | `6d18a022b4125e4271d6fc3e6d8540c2795cfd77` | Frozen P1-02 output paths used for retention comparison. |
| `docs/audits/p1-01/content-pages.csv` | `0fc0b18babb32b4526d2c750653b1ee117276863` | Source page/permalink and language inventory consumed by analyzer. |
| `docs/audits/p1-01/verify.py` | `d936eff54c8eb4af55a8ac5202a74aca0be89cc2` | Production route and byte comparator and emitted consumer assertions. |
| `hugo.toml` | `31ba0a8a84864500f4b96eb87a744d46bbb52c77` | Root config with content cascade selecting posts type and math/pagination settings. |
| `content/about/index.md` | `8d9c83af0530bf2aad05b3377780d7631075fb2c` | About content uses posts type; remains unchanged, affects template lookup. |
| `content/kinh-te/game_theory_nash.md` | `12e43aa0bdf6f7c37052c99cf7f711be7a0735ce` | Nash article and React/video consumer; unchanged and used for runtime checks. |
| `layouts/index.html` | `647dbb82d6b8cfe957db0070bf0c459d0de9806b` | Existing home defines blocks within shared base; unchanged and production bytes verified. |

Pinned vendor FixIt subtree `f5fb989ad1a157dc0e7ac30d0a66b18194b1bea4` PARTIAL: `layouts/baseof.html` blob `f634bfeb6759857511b070f2d8c34cec5049d751`, `layouts/posts/single.html` `813ff47473d158e65a55f897c010e63e815fecf5`, `layouts/section.html` `f6dae6fae193e6b0cc6dca2131f0e8fc815341d0`, `layouts/page.html` `86f65d693277671f46536f5e8aec04519c5c8258` (verify against pinned Git tree before future edits), header `40cf1efe1b07a3a0e60fad8a428b4859ae2c0cd9`, footer `0c103187ba4438639b9daa243efad77822ea9807`, LICENSE `2b4cb5adcfe4b2e054409759ce434aeb1224849e`. These provide originals and delegated head/navigation/footer/article helpers; do not remove theme before D-012 parity. Generated P1-04 JSON/logs/screenshots grouped as PARTIAL; individual hashes and sizes in `artifact-blobs.tsv` SHA256 `268fd65e20f029f4fd371a3fbf076842937ca276e8141bb95182d1296766c587`. Production builds/fixture passed; 8 browser checks passed, but MathJax/heatmap external runtime unverified.

## 2026-11-15 — P1-04 external runtime verification (Claude Code)

Working-file Git blob hashes on `feat/p1-04-hugo-templates`; registry self hash is pre-append `781d6b589d1e45768a5ab24dea596e9af95739bd`. All planning docs listed in AGENTS.md were read in full for onboarding and are unchanged from the blobs recorded above (reused, not re-described). The ten P1-04 template entries above were re-read in full and match their recorded blobs.

| Path | Blob | Status | Purpose, consumers, risks and verification |
|---|---|---|---|
| `layouts/partials/heatmap.html` | `7c5c29664eea78b50b0860b2e4cf08ec858fd0ec` | COVERED | Home activity heatmap: loads D3 v3 and Cal-Heatmap 3.3.10 CSS/JS from `d3js.org`/`cdn.jsdelivr.net`, builds `postData` (day timestamp → count) from seven sections, renders six months from five months ago into `#cal-heatmap`, then `updateHeatmapTheme` after 500 ms. Called by `layouts/index.html`. Browser-verified: renders 183 cells/6 domains and tooltip; defect — mutating `cal.options.legendColors` after `init` does not rebuild the colour scale, so cells keep one fill in both themes and empty days show the "min" colour. |
| `docs/audits/p1-04/runtime/runtime.cjs` | `39ff653990f9a277194eb053bc5e10ccc388ffcc` | COVERED | Playwright harness for the external runtime gate: 16 math routes (MathJax version, container/item counts, errors, raw TeX), four home routes × two themes (D3/Cal-Heatmap state, cells vs expected days, tooltip), per-response TLS issuer and SHA-256, screenshots. Default launch options, no trust bypass; exits nonzero on a failed check. Theme-colour behaviour is an observation, not a gate. |
| `docs/audits/p1-04/runtime/compare.cjs` | `9538735e057560809a4d7cc3d34af76942a08cc0` | COVERED | Compares two `runtime-results.json` files section by section (baseline vs candidate build); exits nonzero on any difference or failed check. Reuse for later tasks. |
| `docs/audits/p1-04/runtime/integrity.py` | `a0c7aa6f313600ea1c89555e78b305422d88c7dd` | COVERED | Stdlib script: checks npm tarball SHA-512 against registry `dist.integrity` and the SHA-256 of each CDN body captured by the harness against the same file in the npm release. Needs extracted `npm pack` output. |
| `docs/audits/p1-04/README.md` | `bc16fc4320ab6924ca444910150433d240bc961d` | COVERED | P1-04 evidence report; now includes the resolved runtime gate, trust-path statement, result tables and remaining baseline defects. |
| `.github/workflows/deploy.yml` | `5bd23aea364dca5f037f8bb60509e2e5b552bb87` | COVERED | Pages deploy on push to `main` (paths: layouts, config, content, data, static, themes, hugo.toml, assets, workflows, package files), `workflow_run` after "Update theme", and manual dispatch. Checks out with submodules, installs Hugo Extended 0.149.0 deb and Node 20, `npm ci`, `hugo --gc --minify`, uploads `./public`. No pull-request build. P1-07 must drop the `workflow_run` coupling and submodule checkout together with the theme. |
| `.github/workflows/update-theme.yml` | `6fdd4637d5551c3391ebff6192519420e3e3516a` | COVERED | Daily cron + manual: `git submodule update --remote --merge themes/FixIt` and auto-commit to the default branch, which then triggers deploy. Unreviewed theme drift; retire in P1-07. |
| `.github/dependabot.yml` | `d550813f6ec374061d0ddf2fc51c26189741d730` | COVERED | Monthly `github-actions` and `gitsubmodule` updates, assignee is the upstream starter author (`Lruihao`), limit 1000. Submodule ecosystem entry becomes obsolete in P1-07; assignee is a starter remnant. |
| `package.json` | `81866df30ef519c711f7ed2221099ecc5295ad8f` | COVERED | Starter metadata (`hugo-fixit-starter1`, upstream author/repository URLs), scripts `build`, `server`, `server:production`, `update:theme`; dependencies react, react-dom, recharts (active for the Nash simulation). |
| `.gitmodules` | `632d82b716f1e6ff168db88f73a31507781b9377` | COVERED | Two submodules: `themes/FixIt` (branch main) and `themes/shortcode-docs-bookmark`. |
| `.gitignore` | `5add35df779366e3aaac48a9c849a5f4a1473e0c` | COVERED | Ignores node_modules, build, public, resources, lock file, `_vendor`, jsconfig.json and a few local scratch patterns. |
| `docs/audits/p1-02/browser/REPORT.md` | `f61d23ff287cc3eb8e5a784da79782a428b201b4` | COVERED | Unchanged; reused for the baseline interaction method and the original MathJax/heatmap failure description. |
| `docs/audits/p1-02/RUNBOOK.md` | `3b1d9770ec2bc69e7886ab83196182343ebc589a` | COVERED | Unchanged; reproduction commands reused. |
| `docs/TASK_BOARD.md` | `da82eb4f3ce57d6ccf1200eccfd0fa3cbe38e2d1` | COVERED | P1-04 marked DONE with evidence; acceptance is the maintainer merge of PR #19. |
| `docs/AGENT_LOG.md` | `82fdfd62b28bf1b2ab0d9930a33e5d78070dddf7` | COVERED | Appends the P1-04 runtime verification entry. |
| `docs/CODEBASE_MAP.md` | `9207a9ca2f516c517b1f8f5f0037d413143e8fae` | COVERED | Adds the runtime-check entry point and modification record. |

Generated evidence group `docs/audits/p1-04/runtime/` (result JSON, logs, PNGs): PARTIAL, blobs listed in `docs/audits/p1-04/artifact-blobs.tsv`. Generated production output `js/lib/mathjax.min.js` (FixIt loader, config `processHtmlClass: content`, CDN `mathjax@3/es5/tex-mml-chtml.js`, `ui/safe`) was read from the build to design the harness; its source stays in the pinned theme.

## 2026-11-15 — P1-05 configuration and CSS consolidation (Claude Code)

Working-file Git blob hashes on `chore/p1-05-css-config-cleanup`; registry self hash is pre-append `4b2057336cfb62033551984f2560b531fcdc1fe9`.

| Path | Blob | Status | Purpose, consumers, risks and verification |
|---|---|---|---|
| `config/_default/hugo.toml` | `667b0ee6e0911849b95acc22b39d1e1606fe0ca2` | COVERED | Title, baseURL, the two theme modules, default language `vi` (top-level `languageCode = vi` is inherited by every language), robots/emoji/GitInfo flags, `summaryLength`, ignored errors; since P1-05 also `pagination.pagerSize = 12` and the `cascade` that gives the six subject sections `type = posts`, `layout = single` (this is what selects `layouts/posts/single.html`). |
| `config/_default/module.toml` | `aa0dcce387d347b441e346f7de90c844695c0117` | COVERED | New in P1-05: `hugoVersion` extended, min 0.147.7 (from the former root file). CI pins 0.149.0. |
| `config/_default/markup.toml` | `27ea4718de66dfd9b4299a141dc4718b6a92016e` | COVERED | Highlight (line numbers in table, classes), Goldmark extensions incl. extras and math passthrough delimiters (moved from the root file in P1-05), parser attributes, `unsafe = true`, TOC levels 2–6; `_merge = shallow`. |
| `config/_default/params.toml` | `a0387eee5ba6c8af0eebf6a282017c9d0852ea7b` | PARTIAL | 918-line FixIt starter parameter set (search/Fuse, header, footer, home, page, TOC, math, code, share, comments off, `customPartials.head` bookmark injector). P1-05 added `page.math.type = "mathjax"`. Mirrors many theme defaults on purpose until P1-07. Read: math, home, custom-partials sections only. |
| `config/_default/frontmatter.toml` | `8f85808e3e66309c72feb417cd9d84f20fabb2e6` | COVERED | `lastmod` precedence `lastmod`, `:git`, `:fileModTime`, `:defalut` (typo, inert because an earlier source always resolves); fix belongs to P1-06. |
| `config/_default/languages.toml` | `1071e660f57e9e294ef90211a8994cfe94aeb14b` | COVERED | vi/en/ja/zh-cn names and weights; `description` and `home.subtitle` for en/ja/zh-cn are FixIt starter taglines (P1-06 item). No per-language `languageCode`. |
| `config/_default/outputs.toml` | `63a58b15da2925adc6056f74d2cabc7b4a1dc02a` | COVERED | Only `_merge = "shadow"`; output formats per kind come from the theme config. |
| `config/_default/permalinks.toml` | `8b18d38fd627769608d762aa0ff3d579d41cc574` | COVERED | `posts = "posts/:slugorcontentbasename"`; URL-sensitive. |
| `config/_default/privacy.toml` | `471be015253f0a04470bafc304c0b6a7bbf5ea9b` | COVERED | `x.enableDNT`, `youtube.privacyEnhanced`. The deprecated `privacy.twitter` duplicate lived only in the removed root file. |
| `config/_default/related.toml` | `ed7b621d52758ee69d463ab07c98f7e2147c43ec` | COVERED | Related-content indices: keywords, date, tags, fragmentrefs, collections, categories. |
| `config/_default/sitemap.toml` | `d83eff58137b8a040f735d1d46be8469889d6e5f` | COVERED | weekly, `sitemap.xml`, priority 0.5. |
| `config/_default/taxonomies.toml` | `3daef3876726e7c944c7986e336133ca0e1b1b86` | COVERED | category/tag/collection; `_merge = shallow`. |
| `layouts/index.html` | `26136ec862726ad916c6961ae035335237e47708` | COVERED | Home: `title`, new `custom-head` block linking `css/home.min.css` (compiled from `assets/css/home.scss`), `content` with six fixed category cards (inline SVG icons, vi/en labels chosen by `eq .Site.Language.Lang "en"`, so ja/zh-cn show Vietnamese), heatmap section calling `partial "heatmap.html"`, five recent posts from seven sections when `params.home.posts.enable`. No inline CSS since P1-05. |
| `assets/css/home.scss` | `38085b486ad73cb6189542617e93818861b6f3f5` | COVERED | New in P1-05: 24 home-only rules (layout wrapper, section title, category grid/cards, recent posts, heatmap section, two breakpoints). Uses theme CSS variables. Loaded only on the four home pages. |
| `assets/css/_custom.scss` | `9b97fbecc88efc486e604cf36bd73bb2ae34a292` | COVERED | Site style layer imported last by the theme stylesheet: Google Fonts imports (Inter, Lora, Caveat, JetBrains Mono), font variables, light/dark palettes, typography, blockquote, links, code, category/tag chips, collection name/nav tweaks, tables, scrollbar, selection, metadata, header, buttons, images, search and pagination radius. Duplicate and dead rules removed in P1-05; `blockquote.handwritten` is an authoring affordance with no current use. |
| `layouts/shortcodes/react.html` | `e4c31b450139fdfa9cc3bf2ce382d0dac822f870` | PARTIAL | Unchanged; size and role confirmed while scanning for inline CSS. Not modified. |
| `layouts/_partials/single/collection-list.html` | `f345eeccfddc33ea1db80211b3ff0ba51dc1021d` | PARTIAL | Unchanged; confirmed as the only emitter of `collection-name-custom` and `collection-nav-simple` used by `_custom.scss`. |
| `.gitignore` | `6adcbcd82a9cd799af8172adaf7bec17d7aa136d` | COVERED | Adds `__pycache__/` and `*.pyc`. |
| `docs/audits/p1-05/README.md` | `6acd5a296e58b77fce43016b7fefcca1bbfb579f` | COVERED | P1-05 report: changes, complete list of output differences, eight verification steps, deferred items, rollback. |
| `docs/audits/p1-05/tools/compare-output.py` | `6832c8425547fcd9e1cf6441763f4c76e94d4736` | COVERED | Byte diff of two output trees with optional JSON report and unified diffs. |
| `docs/audits/p1-05/tools/config-diff.py` | `16b04bbf31a9ea0c2b81678feba7051695281cc5` | COVERED | Flattens two `hugo config --format json` dumps and prints added/removed/changed dotted keys. |
| `docs/audits/p1-05/tools/visual-compare.cjs` | `e79627a19f16c494c01fa142f2a6e94138af2b5e` | COVERED | Full-page pixel comparison of two builds across routes/widths/themes with determinism aids, retries and a serial recheck; writes `visual-results.json`. |
| `docs/audits/p1-05/tools/make-routes.py` | `002319d89c8ef65b0dd8efd8c4297c90d5c1f5ad` | COVERED | Lists non-alias HTML routes of a build and a 22-route representative matrix for the pixel comparison. |
| `docs/audits/p1-05/tools/dead-selectors.cjs` | `3bf3c984b2aec55d0123477ab8daf2ccfb993eec` | COVERED | Counts matches of the removed selectors on every page in Chromium. |
| `docs/audits/p1-05/tools/home-css-rules.cjs` | `f22f4a6e9bb21f0c114b328e94761aa402d0c6b1` | COVERED | CSSOM comparison of the old inline home rules with `css/home.min.css`, stylesheet order, and element/property overlap with reordered sheets. |
| `docs/audits/p1-04/runtime/compare.cjs` | `60e414304a4726e5cd89c684a960b65558af8e93` | COVERED | Now compares response hashes only where both runs captured the body; URL set, status and resolved version are always compared. |
| `docs/audits/P1-01.md` | `aab2ab2b1a122fbd87be7a44385d7b47bbbd4db8` | COVERED | Unchanged; KEEP/REPLACE/REMOVE ledger used to scope P1-05. |
| `docs/audits/p1-01/config-and-deployment.md` | `b6f438985eda4b0be844a165a995f60a2b2460c1` | COVERED | Unchanged; precedence findings reproduced and extended by the isolation diff. |
| `docs/audits/p1-01/assets-and-content.md` | `ebf6f8c56bb7d44dae62fade0ade1f0e18665cc8` | COVERED | Unchanged; consumer evidence for the removal candidates. |
| `archetypes/default.md` | `cb8a71478de2c36a9838c722745fa6919dddbb39` | COVERED | New-content scaffold: title from file name, empty subtitle/description/keywords, `comment: false`. |
| `docs/CODEBASE_MAP.md` | `ca188c7d46d4baf2d07db9b1ee06bbc754d27f34` | COVERED | Config, home CSS, custom JS, Kalman, animation and robots rows updated; new regression-tooling row and modification record. |
| `docs/ARCHITECTURE.md` | `8217fa9ae0bb67105801e1e5c3231a571c5aa8d7` | COVERED | Adds the P1-05 state note. |
| `docs/TASK_BOARD.md` | `8b6be2396e4da598db1e65f309dfc400e868dd40` | COVERED | P1-05 DONE pending maintainer merge. |
| `docs/AGENT_LOG.md` | `a90b13edd967322f6a65f0eea97de21d7692b0cc` | COVERED | P1-05 claim and completion entries. |

**REMOVED in P1-05** (historical notes; all remain in Git history before `7d83d78`/`4d82bd4`/`0b575ae`):

| Former path | Last blob | What it was and why it went |
|---|---|---|
| `hugo.toml` (root) | `31ba0a8a84864500f4b96eb87a744d46bbb52c77` | 1,414-line FixIt starter config. Contributed only pagination, cascade, `module.hugoVersion`, Goldmark extras/passthrough, MathJax type and deprecated `privacy.twitter`; everything else was overridden by `config/_default/` or equal to theme defaults. Replaced by `config/_default/{hugo,module,markup,params}.toml`. |
| `assets/css/_override.scss` | — | Four comment lines; the theme ships the same fallback. |
| `assets/js/custom.js` | — | Starter `FixItBlog` class logging a greeting; emitted as `js/custom.min.js`, no consumer. |
| `assets/js/components/KalmanFilterSim.jsx` | — | Mock React component with no shortcode call or import. |
| `robots.txt` (root) | — | Not a Hugo mount; duplicate of the theme template output with an `example.org` sitemap line. |
| `manim/__pycache__/game_theory_nash.cpython-310.pyc` | — | Interpreter bytecode. |
| `media/videos/game_theory_nash/720p30/game_theory_nash.mp4` | — | Byte-identical to `static/videos/game_theory_nash.mp4` (SHA-256 `10a2da74…145b`). |

Vendor theme files read for this task (pinned FixIt `f5fb989`, PARTIAL): `assets/css/style.scss` (import order: variables, override, mixins, core, page, media, patch, custom), `assets/css/_override.scss` and `_custom.scss` (comment-only fallbacks), `layouts/_partials/plugin/style.html` (stylesheet helper: resource, template, toCSS, minify, fingerprint, preload), `layouts/_partials/head/link.html` (icons, canonical, prev/next, alternates, config/style/Font Awesome/Animate links), `layouts/_partials/assets.html` lines 285–320 (config script, theme script, optional `js/custom.js`, per-page styles), `layouts/robots.txt` (robots template). Generated evidence under `docs/audits/p1-05/evidence/`: PARTIAL, described in the report.

## 2026-11-15 — P1-06 metadata and SEO (Claude Code)

Working-file blobs on `feat/p1-06-metadata-seo`; registry self hash is pre-append `5cb93b447bd3c110d817369e29646d67c3868899`. Vendor FixIt `f5fb989` read PARTIAL: `layouts/_partials/head/link.html` (full, source of the owned copy), `head/seo.html` lines 85–105 (image selection for JSON-LD), `home.offline.html`, `robots.txt`. Content read: front matter of `kinh-te/toan-co-ban-1.en.md`, `toan-co-ban-2.en.md`, `game_theory_nash.md` only.

| Path | Blob | Status | Purpose, consumers, risks |
|---|---|---|---|
| `layouts/_partials/head/link.html` | `b229d58546b209a517a882184d1493c51523931c` | COVERED | Site-owned copy of FixIt `head/link.html`: icons, canonical (via `site/translation.html`), hreflang for verified translations, prev/next, alternate output formats except rel=canonical, config/style/Font Awesome/Animate stylesheets. Called by `layouts/_default/baseof.html`. Still uses FixIt `plugin/style.html`. |
| `layouts/_partials/site/translation.html` | `f6ac96c8cde0950e88418e5016d3b3d066bf2f30` | COVERED | Returns `isCopy`, `original`, `verified`, `defaultLang` for a page by comparing `.RawContent` with the default-language translation; regular pages only. Consumer: `head/link.html`. |
| `layouts/robots.txt` | `cd73623af6136a6869507b732d1bfa8e88419534` | COVERED | Site-owned robots template (from FixIt): no CSS/JS/image disallow, offline/404/markdown disallowed, crawler block list, absolute sitemap URL. |
| `config/_default/params.toml` | `7b0596fb33c577d36baaf0a2beab5204a7807525` | PARTIAL | P1-06 edits: `keywords`, `images` (default social image), `app.title`, `app.svgFavicon`, `app.iconColor` empty, `page.seo.publisher`. Other sections unread. |
| `config/_default/languages.toml` | `031b0c18b10f5fa91a44b42354f7c1cf55b69430` | COVERED | en/ja/zh-cn `description` and `home.subtitle` now translate the Vietnamese tagline. |
| `config/_default/frontmatter.toml` | `33cfb657b916a05d0b5245f81a7e85b6d4691bd1` | COVERED | `lastmod = ["lastmod", ":git", ":fileModTime", ":default"]`. |
| `archetypes/default.md` | `30f5195c2fb386c0b780bbef382b643b2c8071f4` | COVERED | Adds commented optional schema fields and a description hint. |
| `docs/audits/p1-06/tools/seo-check.py` | `393ae7920fe4d34db1e96ffe721930bcc3da6523` | COVERED | Stdlib SEO invariant checker for a build plus the content tree; exits 1 on violations. |
| `docs/audits/p1-06/tools/explain-html-diff.py` | `46cf1f1bb32e1036151b56690f9e65055a8823ee` | COVERED | Strips the intended head metadata from two builds and requires the remaining HTML to be identical. |
| `docs/audits/p1-06/README.md` | `3b5e997d3cfa1ca6006c310c3b511f6d51d5bea3` | COVERED | Report, front matter conventions, verification table, follow-up backlog, P1-07 hand-off. |
| `docs/audits/P1-02.md` | `ad7ee51ec5ae89a9d708d765092eac76faad8d99` | COVERED | Unchanged; defect list used as the P1-06 scope source. |
| `docs/audits/p1-02/static/REPORT.md` | `b1b7e1c19eaaf8633724568777342572c7ece9c0` | COVERED | Unchanged; missing-reference table reused. |

## 2026-11-15 — P1-09 local PostgreSQL foundation

Hashes are working-file Git blobs at review (registry self hash is pre-append); entries PARTIAL unless specifically scoped. Contributors inspected independent DB files; integrator reviewed and reran isolated full integration plus Hugo retention. Evidence and exact commands in [P1-09 verification](audits/p1-09/README.md).

| Path | Git blob | Purpose, consumers and risks |
|---|---|---|
| `compose.yaml` | `d594ca1e63f449f76aba9048c18b0731134b542b` | PostgreSQL 16.10 local-only service, healthcheck, loopback port and persistent named volume; demo credentials only, no Hugo dependency. |
| `db/.env.example` | `7c6f6ea0d896d2f0c0334134b516e532c821de7b` | Optional non-secret demo configuration for local Compose; copy to ignored db/.env for local overrides, never hosted secrets. |
| `db/.gitignore` | `4c49bd78f1d08f2bc09fa0bd8191ed38b7dce5e3` | Ignores db/.env to avoid accidental local credential commits; not a replacement for secret management. |
| `db/bin/compose` | `420a931b807c86ce2a0c642509d8b40e32a34419` | Resolves repository root and invokes Compose with optional db/.env; honors COMPOSE_PROJECT_NAME for isolated tests. |
| `db/bin/migrate` | `17bfd45c2a486a80955064271113be41d60f9c06` | Validates sequential migration names and SHA256 history; serializes with PostgreSQL advisory transaction lock, applies SQL and ledger atomically via local Compose psql. No hosted DB support. |
| `db/migrations/001_foundation.sql` | `a17020b850f9cfb440f5f6714866a916ce382870` | Six provider-neutral reference tables: editorial authors/objects and associations, catalog products, entitlement types and associations; UUID/stable-key constraints and foreign keys, no article bodies/identity/grants. |
| `db/seed.sql` | `9ecc3242cba41b585b61b29cd94845d18fe8014d` | Opt-in fixed UUID synthetic metadata, repeatable INSERT ON CONFLICT; conflicts with different natural-key owners fail. |
| `db/tests/integration.sh` | `4d46d5b7e38af7653394ec1e5b1d490b99e1eee1` | Disposable unique Compose fixture, checks existing project container/volume/network collision, migrates/repeats, validates constraints/tamper/rollback, backs up then recreates volume and restores actual rows/ledger. Cleanup removes only generated project. |
| `db/README.md` | `3551b453e42718ad0928c89b8f7772fcae560917` | Local startup, entity boundary, stable content-key future mapping, migration conventions, isolated restore drill, security and hosted rollout limitations. |
| `docs/DATABASE_FOUNDATION.md` | `a89a99b5e7bfc7b653f4ef92443c46f5d8b4b211` | P1-09 approved deliverables and acceptance, now links implemented local foundation and D-013. |
| `docs/DECISIONS.md` | `2b7ef6689ae4c070cd2502f8e5a69adc4e520c32` | D-013 records schema and operational choices under D-010/D-012; no hosted or production authorization. |
| `docs/CODEBASE_MAP.md` | `34a011a8f0d276f839156c3570cbb2984e687fa3` | Database row and change record now identify actual local DB entrypoints and boundaries. |
| `docs/TASK_BOARD.md` | `0f7f980edfb4bddcc2bf2f5715784ce8d572c433` | P1-09 DONE on feature branch following independent verification; P1-04–07 untouched; P1-08 dependencies remain. |
| `docs/AGENT_LOG.md` | `0e33a756066a5ead88ecfa5427539d3417bea9a1` | Append-only P1-09 claim, completion evidence, contributor provenance and limitations; review/merge remains separate. |
| `docs/audits/p1-09/PR_BODY.md` | `6ca6f17bbdd873096e0704df7042868e8bbe8fb9` | Prepared scoped PR description with tests and limitations; actual GitHub PR remains uncreated due API Forbidden. |
| `docs/audits/p1-09/README.md` | `706f6dfa2823bb11633065dc14e2ed4c0e79b395` | Exact local DB and Hugo test commands, output artifacts, observed Docker digest and limitations. |
| `docs/INSPECTED_FILES.md` | `e596c21f1d9486592d4e8c0984b7c0c47cf22eb4` | Revision-aware inspected-file registry; self hash records pre-append working blob. |
| `AGENTS.md` | `006e02c26e301ca92494903e519efbf3c778db3f` | Multi-agent claim, checks, scope, and documentation/registry safeguards. |
| `.gitignore` | `5add35df779366e3aaac48a9c849a5f4a1473e0c` | Existing project ignores generated Hugo/npm files; local database env protected separately by db/.gitignore. |
| `docs/ENGINEERING_STANDARDS.md` | `71a05d70d3982fd873745e99c39822291edd79c5` | PostgreSQL foundation approval, static Hugo boundary, migration/backup and future role/privacy requirements. |
| `docs/QUALITY_GATES.md` | `657ae0681667e282a6e979d69f2ba572b23f3e32` | Build/routes/test/evidence and per-file knowledge gates; no UI redesign in P1-09. |
| `docs/ARCHITECTURE.md` | `9266866e2034c245268d601b872f6a7f757b41f1` | Static Hugo and P1-09 dependency boundaries; no hosted service or runtime DB dependency. |
| `docs/audits/p1-01/verify.py` | `d936eff54c8eb4af55a8ac5202a74aca0be89cc2` | Production output route/byte and representative metadata comparator; used for Hugo independence verification. |

Generated evidence group `docs/audits/p1-09/` (integration/build logs and retention JSON) is PARTIAL: local synthetic Docker test and current Hugo build only, not hosted security, production recovery, browser behavior or deployment. Exact artifacts and test limitations are linked from the group README. Test-created temporary project, network and volume are deleted only after ownership/collision checks.

## 2026-11-15 — P1-07 FixIt retirement (Claude Code)

Registry self hash pre-append `b38d75cdfc0147c36721dcbff5fd94b4f48a1fe5`. Migrated FixIt files are recorded as groups (tree hashes at `a0167aa`), per the vendor-tree rule; they were selected by tracing the build, not read line by line. Earlier entries that describe files under `themes/FixIt/` now apply to the same relative path in the site.

| Group | Git tree | Status | Contents and provenance |
|---|---|---|---|
| `layouts/` | `00398a032a9d8a0d043fd953d301a324e9d47502` | PARTIAL | 87 templates. Site-authored: `index.html`, `_default/{baseof,single,list}.html`, `posts/single.html`, `section.html`, `robots.txt`, `_partials/{site,p1-04}/`, `_partials/head/link.html`, `_partials/single/collection-list.html`, `partials/heatmap.html`, `shortcodes/react.html` (see earlier sections). The rest are unchanged copies of FixIt `f5fb989` selected because the build executes them; read at group level only (names, roles in `CODEBASE_MAP.md`). |
| `assets/css/` | `5d0bc5329e28ad54729d140d573fde43045a2ed3` | PARTIAL | FixIt SCSS tree (`style.scss`, `_variables`, `_core`, `_page`, `_partials`, `_shortcodes`, `_mixin`, `config.template.scss`, comment-only `_override.scss`) copied unchanged, plus site `_custom.scss` and `home.scss`. Compiled CSS identical to pre-migration. |
| `assets/js/` | `20c6ee8c4358701561dc9bd0c51ec2b2425c04be` | PARTIAL | `theme.js`, `util.js`, `head/color-scheme.js`, `lib/mathjax.js` copied unchanged from FixIt; `components/NashEquilibriumSim.jsx` is the site's. Bundles identical apart from source paths. |
| `assets/lib/` | `d78eeb50e4a9e1f5dda8b98daff9d384d250617a` | PARTIAL | Bundled libraries (animate, autocomplete, cookieconsent, fontawesome-free, fuse, lightgallery, normalize, sharer); only the files the build opened. |
| `assets/images/` | `a36d3ce87f7523d7bd3fe9e40ef55864c4679942` | PARTIAL | `fixit.svg`, `hugo.svg`, `loading.svg` used by footer and lazy-loading markup. |
| `i18n/` | `ab37779475d5fda00dfeebfb9c073a7d94f1c378` | PARTIAL | `en.toml`, `vi.toml`, `zh-CN.toml` interface strings from FixIt. |
| `static/lib/` | `3e2ac4d9e3f4fae2b4bf457c68c6b51024d87da7` | PARTIAL | KaTeX and lightGallery files and Font Awesome webfonts published as-is (73 files); KaTeX/lightGallery unused by current pages. |

| Path | Blob | Status | Purpose |
|---|---|---|---|
| `config/_default/hugo.toml` | `f8f389f71d6e37160df622cb83472ebf76f23c5d` | COVERED | No `theme` key since P1-07. |
| `config/_default/outputs.toml` | `55f0567eee776cf6dc0f980aa2f836312a300bd4` | COVERED | Explicit outputs per kind (home: html, rss, archives, offline, search; page: html, markdown; section/term: html, rss; taxonomy: html). |
| `config/_default/outputFormats.toml` | `9db99bc9e97dfa38ec88f16ca7ef45ef5057cb1f` | COVERED | `archives`, `offline`, `search` formats formerly defined by the theme. |
| `config/_default/params.toml` | `f59405303e892898548b09f113391958ee64a236` | PARTIAL | P1-07: `customPartials.head` emptied; paginate defaults, `page.linkToVscode`, `page.related.position`, `page.math.mathjax` added (formerly theme defaults). |
| `.github/workflows/deploy.yml` | `aa85e86dfc62d7df7905ddfc36c6ef281750d938` | COVERED | Push to `main` (path-filtered, now incl. `i18n/**`) and manual dispatch; plain checkout with full history, Hugo Extended 0.149.0, Node 20, `npm ci`, build, Pages deploy. No `workflow_run`, no submodules. |
| `.github/dependabot.yml` | `39820ad24ffe9da0e14686a5b241f2c60e3fc869` | COVERED | Monthly GitHub Actions and npm updates; no assignee. |
| `package.json` | `78f69783acee5a047184fa1150bfaaf5cd13b014` | COVERED | Project metadata, scripts `build`, `server`, `server:production`; react, react-dom, recharts. |
| `assets/jsconfig.json` | `377218ccba6fb053d253ce738684fbf85dc4f69d` | COVERED | Editor resolver for `assets/`; Hugo rewrites it during JS builds (theme path dropped). |
| `README.md` | `ebb8102faaf37fb1ba1caca64b5505df3a2804a3` | COVERED | Project README (requirements, develop, layout, deployment, licenses). |
| `THIRD_PARTY_NOTICES.md` | `1b2930064e82c550b412907fdf9a7e7295c28be2` | COVERED | FixIt provenance and bundled library versions. |
| `LICENSE-FixIt.txt` | `2b4cb5adcfe4b2e054409759ce434aeb1224849e` | COVERED | FixIt MIT license (moved from `layouts/_default/FIXIT-LICENSE.txt`). |
| `docs/audits/p1-07/README.md` | `163f3a332fbc16f829feaac2fa3329f3bf2c6018` | COVERED | Report, dependency map, verification, P1-08 hand-off. |
| `docs/audits/p1-07/tools/compare-normalised.py` | `2f9878835eb327634e17c9c93d7666e1fa4f420a` | COVERED | Byte comparison ignoring embedded source-path prefixes. |
| `docs/DECISIONS.md` | `cd0fa303594b27956dfedb835720bd030dd3b7ee` | COVERED | Adds D-013. |
| `docs/CODEBASE_MAP.md` | `93cee551a747512f4fa720ff83d09050d80f97b7` | COVERED | Adds the post-P1-07 ownership table. |
| `docs/ARCHITECTURE.md` | `d59939b18a5f2f081493090e03aa91ce16d62e72` | COVERED | Adds the P1-07 state. |
| `docs/TASK_BOARD.md` | `97eefddda27a723dceec6c2f78f1cbe610824e80` | COVERED | P1-07 DONE pending merge. |
| `docs/AGENT_LOG.md` | `17a2ec9f2d3be45ad34283bed04be438ba4e4b4d` | COVERED | P1-07 claim and completion. |

**REMOVED in P1-07:** `themes/FixIt` (gitlink `f5fb989`), `themes/shortcode-docs-bookmark` (gitlink `bad88c8`), `.gitmodules`, `.github/workflows/update-theme.yml`, `README.en.md`. FixIt source files read while migrating: `hugo.toml` (output formats, outputs, mediaTypes sections), `assets/lib/VERSION`.

## 2026-11-15 — P1-08 live retry

Working Git blobs; coverage PARTIAL. Browser/network failure verified; no production behavior inferred.

| Path | Blob | Purpose and risk |
|---|---|---|
| `docs/audits/p1-08/README.md` | `7ef51021e991879f74d8ae2f858962f749a22a0e` | P1-08 deployed-site evidence and exact blocked retry; no origin result, sign-off remains pending. |
| `docs/AGENT_LOG.md` | `95d74fc3e85d83e699332ed39a63a19ed06c3456` | Append-only P1-08 retry evidence and Phase 2 handoff. |
| `docs/INSPECTED_FILES.md` | `9c2de304d673c1521c0cb4cde3c7c2714499f317` | Revision-aware registry; self hash is pre-append. |
| `AGENTS.md` | `006e02c26e301ca92494903e519efbf3c778db3f` | Task claims, evidence, preservation and visual approval safeguards. |
| `docs/TASK_BOARD.md` | `1f709d219b2968366640346f6de15922addac5f5` | Canonical statuses; P1-08 remains BLOCKED and P2-01 is unclaimed. |

## 2026-11-15 — P2-01 tokens

PARTIAL coverage; working blobs, registry self hash pre-append. Contrast checks and current-main production byte comparison passed; no owner visual approval.

| Path | Blob | Purpose / dependencies / risk |
|---|---|---|
| `assets/css/editorial/tokens.css` | `177b57a1a1684478c192be510ea8993f3f1e1ae2` | Specimen-only semantic palette, type, spacing, width and reduced-motion tokens; not loaded in production. |
| `docs/design/TOKENS.md` | `976dbfedcceae1b34292732e0c656663a58b37f9` | Token usage, measured contrast, light-muted adjustment and provisional font decision. |
| `docs/design/check-token-contrast.py` | `dc1505561442a4edb3cb79a1b77757cdef3344f9` | Parses CSS token declarations and asserts text/background pairings >=4.5 contrast. |
| `docs/CODEBASE_MAP.md` | `019a98b59b9d9a39fc25606198514b7018552ff4` | Current source navigation plus specimen-only P2-01 token ownership. |
| `docs/TASK_BOARD.md` | `7090678de209ffe08d83ad01368db3a11e7b3f8e` | P2-01 completed on branch; P1-08 blocked; dependent P2 tasks remain unclaimed. |
| `docs/AGENT_LOG.md` | `75a6fe1441b3f7ca28ecd99e5ae3c72d479e04d3` | P2-01 claim and exact verification, scope and limitations. |
| `docs/INSPECTED_FILES.md` | `ec8e49a0741ea6318228dd1ac5508a3a259a3132` | Knowledge registry; own hash describes pre-append version. |
| `docs/DESIGN_SYSTEM.md` | `ee8ca775a8471bea29f69523dfc7f0c98109eef8` | Semantic palette and specimen/owner-approval visual gate. |
| `docs/VISUAL_DIRECTION.md` | `9181d328d71d874bc95c44daca2dec5a7607bd0c` | Magazine/book visual brief, specimen-first approval and no unapproved homepage. |
| `docs/QUALITY_GATES.md` | `657ae0681667e282a6e979d69f2ba572b23f3e32` | Build, route, accessibility, screenshots and review requirements. |
| `assets/css/_custom.scss` | `9b97fbecc88efc486e604cf36bd73bb2ae34a292` | Existing production palette, font imports and theme rules; independent of new specimen-only tokens. |

## 2026-11-15 — P2-02 typography

Working blobs, PARTIAL coverage; Chromium and production output checks recorded in AGENT_LOG; final visual approval remains outstanding.

| Path | Blob | Responsibility and risks |
|---|---|---|
| `layouts/specimen/single.html` | `216bc6ae16301086ae6835e08b37fe466a9a898b` | Review-environment-only standalone shell, loads tokens and available specimen partials; no production content route. |
| `layouts/_partials/specimen/typography.html` | `ab6d677ba8f0d1898336299dc192afe7f4981d70` | Vietnamese/English article type specimen with existing attributed excerpt, native MathML, code and caption. |
| `assets/css/specimen/base.css` | `9ec3ebfb44f61a40e14b44581ab981f921def0d2` | Review shell base styles; depends on semantic ed tokens. |
| `assets/css/specimen/typography.css` | `aa44142d91784f4beb02cd029835691fbdfcaefd` | Long-form type and math/code styles for review only. |
| `assets/css/specimen/responsive.css` | `472a8c126aeb53ff4bd5cc9734af4a348c3e618f` | Specimen responsive overrides; includes selectors for later component checkpoints. |
| `scripts/preview-editorial.sh` | `64dc58158500b01d3f3ed3201f9a0baefa71baa6` | Creates temporary Hugo snapshot/draft, disables snapshot GitInfo and runs editorial-review environment on loopback; no repo content changes. |
| `scripts/test-editorial-typography.cjs` | `dd16cbefb5039abc6c15306eb6596590a4adb6cc` | Headless Chromium checks Vietnamese/math/code and overflow, captures four light/dark screenshots at 360/1440. |
| `docs/design/TYPOGRAPHY.md` | `09d631583e0f557bdf4e6a1a7a9972efeb15c414` | Type specimen scope, preview instructions and provisional font/visual approval limitations. |
| `docs/TASK_BOARD.md` | `1e6641765a70e2eef7b0badd26585e6d984ff54d` | P2-02 typography completed on branch; downstream component tasks remain and owner approval outstanding. |
| `docs/AGENT_LOG.md` | `99fe1ebfa1d0a74d8d902c059c51268af99624aa` | P2-02 claim, tests, production isolation and visual limitations. |
| `docs/CODEBASE_MAP.md` | `71562ff7af4ceeaeaa927a6f1be635c8c9dd8612` | Preview and typography ownership; production paths unchanged. |
| `docs/INSPECTED_FILES.md` | `681a652dec192dab76c26ab62324f91caca1d8ca` | Self registry hash is pre-append. |
| `content/toan-hoc/riemann-hypothesis-number-theory.md` | `d038f61397e2531a230d4da3d82f90c634aa8c4c` | Existing Vietnamese article supplies one attributed specimen excerpt; unchanged. |

Generated intermediate screenshots `docs/design/screenshots/p202-{360,1440}-{light,dark}.png` are review-only browser captures; no claim of final aesthetic approval.

## 2026-11-15 — P2-03 navigation checkpoint

Working blobs, PARTIAL coverage; core controls tested, integrated anchors and owner visual review pending.

| Path | Blob | Responsibility and risks |
|---|---|---|
| `layouts/_partials/specimen/navigation.html` | `dc0c512afed742ad4fe669e466b4bcb0496ac204` | Review masthead, responsive menu, search and theme controls; section anchors must be checked when home/future partials are integrated. |
| `layouts/_partials/specimen/interactions.html` | `b956403db41818425734f35fb12abad9d85394f2` | Theme persistence, mobile Escape/focus, local search and async stale-response protection; demo-only and no public template import. |
| `assets/css/specimen/navigation.css` | `10ea94a012d565045cd0a2d92d3bf2ab474fdd7a` | Specimen masthead, controls, search and responsive menu presentation; depends on ed tokens. |
| `assets/css/specimen/responsive.css` | `331634a8e7309b1fdc84f4002faff00a3b0e0324` | Responsive overrides for specimen components; reviewed after updated mobile masthead rules. |
| `scripts/test-editorial-navigation.cjs` | `cc94cde249c712df682ba574118d6c82f87af12e` | Playwright focused navigation test including delayed search race and keyboard Escape. |
| `docs/TASK_BOARD.md` | `a6b4231ae2ac35517f07d92f54455026c674c254` | P2-03 currently IN PROGRESS; full integrated anchor review outstanding. |
| `docs/AGENT_LOG.md` | `e493f15d2a8ae2fb31a49bd09194718578e1f7ad` | P2-03 claim and limited interaction test evidence. |
| `docs/INSPECTED_FILES.md` | `14c6a0c30b7b91891bc78a3daf553318dc845a6a` | Registry self hash is pre-append. |
| `assets/css/specimen/base.css` | `d5a877c91239f0ccba986a82a1efb03a6fb2c482` | P2-02 file reviewed after trailing whitespace cleanup; behavior unchanged. |
| `assets/css/specimen/typography.css` | `605d970113632fb1be1a989dc990728d1d744701` | P2-02 file reviewed after trailing whitespace cleanup; behavior unchanged. |
| `layouts/_partials/specimen/typography.html` | `046622590826399410a48ed6521fd3ce094a9db7` | P2-02 file reviewed after trailing whitespace cleanup; behavior unchanged. |

## 2026-11-15 — P2-04 editorial component checkpoint

Working blobs, PARTIAL coverage; isolated render and production isolation passed; integrated browser QA and owner visual review remain.

| Path | Blob | Responsibility and risks |
|---|---|---|
| `layouts/_partials/specimen/home.html` | `fbde3b4641596e850a71cdeefb108030e158987c` | Review-only hero, journal and volume composition, includes original inline geometric SVG and two feature partial calls. |
| `layouts/_partials/specimen/feature.html` | `45027d27342ff05151a328a7b03082dacb12c16b` | Parameterized featured essay prototype, selects one of two illustrative SVG variants; no fake article link. |
| `layouts/_partials/specimen/art-landscape.html` | `8c4ce35ad9526800118286663b1d7e902a47b516` | Original AI-assisted geometric probability landscape for review, decorative SVG within labeled wrapper. |
| `layouts/_partials/specimen/art-architecture.html` | `5bca6dd5d61d0d2756f6a69c57d6bb8226a12597` | Original AI-assisted geometric library illustration for review, decorative SVG within labeled wrapper. |
| `assets/css/specimen/home.css` | `f0322b5e842cbec9871a1296f573d4101da0def8` | Review-only hero, editorial feature, reading list and volume layout; relies on P2 token and responsive styles. |
| `docs/design/ASSET-PROVENANCE.md` | `5701007fbd73208d2bade254e45bd6a149135477` | Source, alt and publication rights review state for original illustrative SVGs. |
| `docs/TASK_BOARD.md` | `0a293d059bbb2bb28c6982f205c79541a755a952` | P2-04 prototype done on branch; P2-03 and owner visual approval pending. |
| `docs/AGENT_LOG.md` | `c3caea2bec4e85dd1e7464c88a6c5f7b43cb6d02` | P2-04 claim and scoped production isolation evidence. |
| `docs/CODEBASE_MAP.md` | `0f944abb9c357d736e59c372196530f4ecca818b` | Review-only component ownership, production homepage remains separate. |
| `docs/INSPECTED_FILES.md` | `8f7cfa5138b52acd36767da70adee1210448c2b1` | Registry self hash is pre-append. |
