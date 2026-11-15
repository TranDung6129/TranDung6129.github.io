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
| `docs/AGENT_LOG.md` | `1f15731754637878f19cc32062d99a781bce8dbd` | Append-only P1-09 claim, completion evidence, contributor provenance and limitations; review/merge remains separate. |
| `docs/audits/p1-09/README.md` | `706f6dfa2823bb11633065dc14e2ed4c0e79b395` | Exact local DB and Hugo test commands, output artifacts, observed Docker digest and limitations. |
| `docs/INSPECTED_FILES.md` | `e596c21f1d9486592d4e8c0984b7c0c47cf22eb4` | Revision-aware inspected-file registry; self hash records pre-append working blob. |
| `AGENTS.md` | `006e02c26e301ca92494903e519efbf3c778db3f` | Multi-agent claim, checks, scope, and documentation/registry safeguards. |
| `.gitignore` | `5add35df779366e3aaac48a9c849a5f4a1473e0c` | Existing project ignores generated Hugo/npm files; local database env protected separately by db/.gitignore. |
| `docs/ENGINEERING_STANDARDS.md` | `71a05d70d3982fd873745e99c39822291edd79c5` | PostgreSQL foundation approval, static Hugo boundary, migration/backup and future role/privacy requirements. |
| `docs/QUALITY_GATES.md` | `657ae0681667e282a6e979d69f2ba572b23f3e32` | Build/routes/test/evidence and per-file knowledge gates; no UI redesign in P1-09. |
| `docs/ARCHITECTURE.md` | `9266866e2034c245268d601b872f6a7f757b41f1` | Static Hugo and P1-09 dependency boundaries; no hosted service or runtime DB dependency. |
| `docs/audits/p1-01/verify.py` | `d936eff54c8eb4af55a8ac5202a74aca0be89cc2` | Production output route/byte and representative metadata comparator; used for Hugo independence verification. |

Generated evidence group `docs/audits/p1-09/` (integration/build logs and retention JSON) is PARTIAL: local synthetic Docker test and current Hugo build only, not hosted security, production recovery, browser behavior or deployment. Exact artifacts and test limitations are linked from the group README. Test-created temporary project, network and volume are deleted only after ownership/collision checks.
