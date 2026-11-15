# Agent Handoffs and Evidence

This is an append-only log, except to correct factual mistakes. **No implementation tasks are claimed or complete at documentation creation time.**

## Entry template

### YYYY-MM-DD — TASK-ID — AGENT-ID
- **Status:** IN PROGRESS / BLOCKED / DONE
- **Branch / PR:** [link]
- **Scope and files:** [list]
- **What changed:** [summary]
- **Tests and evidence:** [exact commands + results, screenshots, link report, perf readings]
- **Known gaps / risks:** [specific]
- **Next dependency / requested review:** [task ID]

## Coordination rules
- Claim status first in TASK_BOARD.md and commit claim, then implement.
- Task board is the single source of truth; this log provides evidence/context.
- If two agents want the same task, one must pause or choose another.
- Never use the log as a substitute for verified tests or a reviewer sign-off.
- Avoid parallel edits to TASK_BOARD.md. Prefer one integrator or successive merge/rebase.

### 2026-11-15 — P1-01 — Codex (integrator)
- **Status:** IN PROGRESS
- **Branch / PR:** `audit/p1-01-repository-inventory` (PR pending)
- **Scope and files:** P1-01 repository inventory and evidence only; `docs/TASK_BOARD.md`, `docs/AGENT_LOG.md`, and new audit documentation/artifacts.
- **What changed:** Claimed the unassigned task before audit work. Read AGENTS.md and all existing docs; base is `bf20ec5` from origin/main. Separate audit contributors will inspect configuration/deployment and assets/content; only the integrator edits shared status files.
- **Tests and evidence:** Initial `git status --short` was empty. Implementation/build evidence follows in an appended completion entry.
- **Known gaps / risks:** No removal or architecture decision is authorized by this audit. Runtime and visual baseline beyond inventory belongs to P1-02.
- **Next dependency / requested review:** Publish P1-01 inventory for integration review; P1-02 remains unclaimed.

### 2026-11-15 — P1-01 — Codex (integrator), evidence handoff
- **Status:** BLOCKED — inventory acceptance evidence is produced and contributor-reviewed; required PR creation is blocked by GitHub API egress. Checkbox remains unticked; P1-02 remains TODO.
- **Branch / PR:** `audit/p1-01-repository-inventory`, pushed to origin. Claim commit `b8e5410a596a5868600664ad8fac1612aa151925`; evidence commit [`a9a0adb4c2940669a27865b5ab4337dc438af2b9`](https://github.com/TranDung6129/TranDung6129.github.io/commit/a9a0adb4c2940669a27865b5ab4337dc438af2b9). PR not created; [prepared title/body](audits/p1-01/PR_BODY.md).
- **Scope and files:** [Audit/cleanup matrix](audits/P1-01.md), 17 supporting files under `docs/audits/p1-01/`, this log, task board and architecture ledger pointer. No existing application source, content, configuration, dependency manifests/lockfiles, workflows, theme pins or public assets changed/deleted. Backup ref `backup/p1-01-before-audit` was pushed at baseline `bf20ec5b39498efac7ef7dee2debf543dd49081e`.
- **What changed:** Inventoried all 245 baseline parent entries, 3,334 pinned theme files, 48 Markdown pages/10 bundle images, all 13 split configs, deployment/update scripts, active layouts/CSS/JS, shortcode/theme consumers and generated artifacts. Added proof-backed KEEP/REPLACE/REMOVE recommendations without implementing them. Contributors `config_audit` and `assets_audit` inspected separate domains read-only; only integrator edited shared status files. `config_audit` reviewed the integrated report, independently checked manifest counts/route equality and requested verification provenance plus a zero-byte-diff assertion; both are included. Contributor review is not maintainer approval.
- **Tests and evidence:** Exact commands/provenance/limits in [VERIFICATION.md](audits/p1-01/VERIFICATION.md). `python3 docs/audits/p1-01/inventory.py bf20ec5b39498efac7ef7dee2debf543dd49081e docs/audits/p1-01` PASS (245/3,334 entries, 2 shortcode calls). `hugo list all --logLevel error` PASS (48 rows); unsupported initial `--format csv` was corrected. `hugo config --format json` and isolated `--configDir /tmp/p1-empty-config-dir` / `--config /tmp/p1-empty.toml` probes PASS; actual precedence retained in JSON/report.
- **Build/retention evidence:** `PATH=/workspace/.cloud-tools/bin:$PATH npm run build -- --destination /tmp/p1-01-before-public` and corresponding `/tmp/p1-01-after-public` command both PASS (exit 0; original logs committed). `python3 docs/audits/p1-01/verify.py /tmp/p1-01-before-public /tmp/p1-01-after-public docs/audits/p1-01` PASS: 645/645 emitted files, zero added/removed routes and zero byte differences; correct four home language/title/canonical outputs; RSS/sitemap/robots/video/React output present; four search indexes; 2 React mounts, 10 collection pages, 4 heatmaps emitted. `diff -u docs/audits/p1-01/routes-before.txt docs/audits/p1-01/routes-after.txt` PASS. `git diff --exit-code bf20ec5b39498efac7ef7dee2debf543dd49081e -- . ':(exclude)docs/**'` PASS; submodule status clean. `git diff --check` PASS; audit Markdown targets, manifest counts and CSV row count independently checked with Python (PASS).
- **Findings / risks:** React/Recharts must stay. Root config contributes active MathJax/cascade settings; bookmark partial remains configured despite zero content calls. Existing missing Nash poster, mixed collection translation labels, privacy deprecation and frontmatter typo logged for P1-02/P1-05/P1-06. Generated bytecode, mock Kalman component and duplicate/intermediate media are deferred cleanup candidates, not deleted. No browser/screenshots, interactive simulation tests, accessibility/performance, full link crawl or live deployment validation performed. No PR-triggered CI exists; docs-only changes do not match deployment push paths.
- **Concrete delivery blocker:** `git push -u origin audit/p1-01-repository-inventory` PASS. `gh pr create --base main --head audit/p1-01-repository-inventory --title 'docs: audit repository foundation for P1-01' --body-file docs/audits/p1-01/PR_BODY.md` FAIL (`Post https://api.github.com/graphql: Forbidden`). Read-only REST probe also fails, curl reports CONNECT proxy 403, and environment status confirms enforced allowlist lacks `api.github.com`. Existing Git authentication works; no request for token values is justified by this network failure.
- **Next dependency / requested review:** Allow `api.github.com` in environment Internet settings, retry the existing API binding, create the prepared focused PR, record its URL and mark P1-01 DONE after the delivery blocker clears. Maintainer reviews/integrates; do not merge automatically. P1-02 is next after P1-01 is complete. Do not start homepage redesign, architecture migration, payments, affiliate or subscription work.

### 2026-11-15 — P1-01 acceptance — Codex integrator
- **Status:** DONE. User requested acceptance reconciliation after merge. `git fetch origin` and `git show --no-patch --format=fuller 555b1f3` verify [PR #13](https://github.com/TranDung6129/TranDung6129.github.io/pull/13) merged at `555b1f3340e8d968318b095f43c497bc8663dd5c`; audit commit `a9a0adb4c2940669a27865b5ab4337dc438af2b9` is in main. PR #12 and #14 are also merged in the fetched graph, current main `aae95e9`.
- **Branch:** `docs/p1-01-acceptance`; only acceptance/status and inspected-knowledge documentation. Original P1-01 scope/evidence remains in merged PR #13.
- **Acceptance:** Complete inventory/matrix and contributor review were already committed. `PATH=/workspace/.cloud-tools/bin:$PATH npm run build -- --destination /tmp/p1-01-accepted` PASS (exit 0); `python3 docs/audits/p1-01/verify.py /tmp/p1-01-after-public /tmp/p1-01-accepted /tmp/p1-01-accepted-evidence` PASS, 645/645 files, zero route or byte differences; language/consumer/output assertions PASS. No source change after the audit. Existing missing poster is a recorded baseline defect, not missing P1-01 inventory evidence.
- **Policy:** Read new navigation/registry, visual/engineering standards and D-010/DATABASE_FOUNDATION. P1-09 remains TODO dependent on P1-03; approved local PostgreSQL does not authorize public auth/billing, hosted provisioning or a DB dependency in Hugo.
- **Delivery:** Prior PR blocker is resolved by merged PR #13, not by API access: `gh pr list --state merged --limit 10 --json number,title,mergeCommit,url` still fails Forbidden. Git merge evidence is used, not a fabricated API outcome. Follow-up PR creation is attempted separately; no merge by agent.
- **Next:** P1-02 baseline, own branch/PR.

### 2026-11-15 — P1-02 claim — Codex integrator
- **Status:** IN PROGRESS; dependency P1-01 accepted after PR #13 merge and fresh output comparison.
- **Branch / PR:** `audit/p1-02-baseline`, stacked on `docs/p1-01-acceptance` (`02fd727`) to isolate acceptance reconciliation from baseline evidence. PR base is acceptance branch until it merges, then retarget main.
- **Scope:** Baseline build/routes/languages/feed/search/math/code/TOC/theme behavior, links, screenshots and measured local performance; preserve application/content/config.
- **Contributors:** `baseline_static` inspects fresh generated output; `baseline_browser` exercises headless Chromium. Shared task/log/registry edits stay with integrator.
- **Tests:** Fresh production build already PASS at synchronized main; baseline probes underway, results to follow. No defects are being silently fixed.
- **Next:** P1-03 remains TODO; P1-09 must wait for P1-03 schema/migration decision.

### 2026-11-15 — P1-02 evidence handoff — Codex integrator
- **Status:** BLOCKED for required PR delivery; capture evidence complete and contributor-reviewed. Checkbox intentionally unticked. Known baseline website defects are recorded separately from this delivery blocker.
- **Branch / PR:** `audit/p1-02-baseline`, claim `808ae64`, stacked on acceptance commit `02fd727` (`docs/p1-01-acceptance`). Original P1-01 PR #13 is merged; no P1-02 PR exists yet. Both branches pushed separately; retarget P1-02 to main after acceptance reconciliation merges.
- **Files / entrypoints:** [P1-02 report](audits/P1-02.md), audit tools/raw JSON/log/screenshots under `docs/audits/p1-02/`; CODEBASE_MAP adds test entrypoints, INSPECTED_FILES records reviewed versions. Existing application/content/config/dependency/theme files unchanged.
- **Tests:** `PATH=/workspace/.cloud-tools/bin:$PATH npm run build -- --destination /tmp/p1-01-accepted` PASS; `python3 docs/audits/p1-01/verify.py /tmp/p1-01-after-public /tmp/p1-01-accepted /tmp/p1-01-accepted-evidence` PASS (645 files, zero route/byte changes). `python3 docs/audits/p1-02/static/test_analyzer.py` PASS (1 isolated URL/fragment/alias/route-loss fixture). `python3 docs/audits/p1-02/static/analyze.py /tmp/p1-01-accepted /tmp/p1-02-static-recheck docs/audits/p1-01/routes-after.txt docs/audits/p1-01/content-pages.csv` PASS capture invariants; `cmp docs/audits/p1-02/static/summary.json /tmp/p1-02-static-recheck/summary.json` PASS. Exact reproduction and browser commands/results in [RUNBOOK](audits/p1-02/RUNBOOK.md) and [browser report](audits/p1-02/browser/REPORT.md).
- **Static observations:** 347 HTML (201 non-alias/146 aliases); all156 XML parse (151 RSS/5 sitemap);4 search indexes (vi/en20 records each,ja/zh0). 11,202 internal reference occurrences checked;745 missing target occurrences/210 distinct normalized paths, zero missing HTML fragments. Four duplicate canonical groups and24 title groups captured, not an SEO pass. Missing branding/icon/poster and untranslated menu destinations are follow-up findings, not fixed here.
- **Browser observations:** Final Chromium run passes8 assertions (Nash state/keyboard slider,TOC,theme/persistence,search,code/copy). Copy needs expand-code then header hover; initial harness mistakes were corrected and do not establish application defects.16 viewport screenshots: home+Nash at360/768/1024/1440 light/dark, no horizontal viewport overflow observed. Supplemental Tab/reduced-motion observations are not full accessibility approval. Home load292.4ms/FCP144ms;Nash load394.7ms/FCP100ms: single local unthrottled run, not field CWV. MathJax and CalHeatMap execution fail due external network/trust loading; raw math, console errors and failed requests retained. No TLS bypass, mocked CDN or origin rewrites.
- **Contributor review:** baseline_static and baseline_browser own separate captures; integrator edits shared docs. Static reviewer independently recounted artifacts and reran fixture; corrected a prose canonical-duplication error to match JSON. Integrator reviewed harness assumptions, metadata/link scope, final8 assertions and two screenshots. Neither contributor review nor baseline capture is maintainer/Phase1 signoff.
- **Delivery / next:** GitHub GraphQL remains Forbidden; prepared focused PR body committed. P1-01 acceptance PR creation attempt also fails Forbidden even though Git push works. Allow `api.github.com` in environment Internet settings, retry API access/create both scoped PRs and append actual URLs. Do not request raw token values based on proxy egress denial. Keep P1-02 BLOCKED until its required PR exists. P1-03 remains TODO; P1-09 is approved local PostgreSQL but depends on P1-03; no DB,auth,billing,affiliate or homepage implementation in this task.

### 2026-11-15 — P1-02 — GitHub integration review and acceptance
- **Status:** DONE (baseline evidence accepted; legacy site defects remain open and are **not** considered resolved).
- **PR:** [#17](https://github.com/TranDung6129/TranDung6129.github.io/pull/17), merged at commit `2548c7036f7c92e36f5377a2daa212919b76a193`.
- **Review scope:** Confirmed PR changes are confined to baseline documentation, test/reproduction scripts, evidence JSON/logs and 16 PNG screenshots; no site application/content/theme/config/workflow files changed by PR. Compared report to JSON artifacts and reviewed Playwright harness and static analyzer source; validated task status and visual direction preservation.
- **Evidence examined:** P1-02 output-retention JSON: 645/645 emitted files with zero additions/removals and zero byte changes; browser results JSON: 8 passing named interaction checks and 16 screenshots at four widths and two themes; static summary: 11,202 internal references, 745 missing occurrences/210 unique missing normalized targets; 156 parseable XML outputs and four search indexes. See [baseline audit](audits/P1-02.md), [runbook](audits/p1-02/RUNBOOK.md), and [browser results](audits/p1-02/browser/results.json).
- **Limits:** Existing missing branding poster/icon references, duplicated canonical/title groups, incomplete ja/zh-cn routes and MathJax/Cal-Heatmap network failures are **unresolved**. Reviewer inspected submitted source/results but did not independently rerun browser/build test suite in this review environment. Local unthrottled browser timing is not production CWV or performance compliance. This acceptance is for **baseline capture**, not Phase-1 site parity or bug-free production.
- **Next:** P1-03 architecture decision may proceed. Carry all P1-02 baseline defects into migration and SEO/asset tasks, with final release verification under P1-08.

### 2026-11-15 — P1-03 — Codex
- **Status:** IN PROGRESS; dependencies P1-01 and P1-02 DONE on main `2654c30`.
- **Branch / PR:** `design/p1-03-template-architecture`; claim first.
- **Scope:** Decide owned Hugo template architecture, configuration and migration strategy, including PostgreSQL migration boundaries; preserve current site.
- **Evidence:** P1-01/02 merged baseline; tests and decision to follow.
- **Next:** P1-04 and P1-09 after integration.

### 2026-11-15 — P1-03 — Codex decision and evidence
- **Status:** DONE for the architecture decision; implementation and maintainer integration remain separate. **Branch:** `design/p1-03-template-architecture`; claim commit `7061ea6`. **Decision:** [D-012](DECISIONS.md#d-012--owned-hugo-templates-and-incremental-compatibility); [architecture pointer](ARCHITECTURE.md#p1-03-implementation-decision).
- **Scope:** Owned Hugo lookup/base/partials and compatibility, effective configuration consolidation, feature/route/visual gates, incremental rollback, ordered transactional PostgreSQL migrations and Hugo-independent DB boundary. No application files, public content, config, database or theme pins changed.
- **Tests:** `PATH=/workspace/.cloud-tools/bin:$PATH npm run build -- --destination /tmp/p1-03-public` PASS; `python3 docs/audits/p1-02/static/test_analyzer.py` PASS (1 fixture); `python3 docs/audits/p1-02/static/analyze.py /tmp/p1-03-public /tmp/p1-03-static docs/audits/p1-02/static/routes.txt docs/audits/p1-01/content-pages.csv` PASS: 645 output paths, zero added/removed vs P1-02, 0 invalid XML, 745 pre-existing missing-reference occurrences. `git diff --exit-code origin/main -- . ':(exclude)docs/**'` PASS; `git diff --check` PASS. Evidence: decision/architecture files and `/tmp/p1-03-build.log`, `/tmp/p1-03-static/summary.json` in current environment.
- **Known gaps:** These tests validate preserved output, not actual owned templates (P1-04); MathJax and heatmap runtime previously blocked by external trust/network, no parity claim. P1-02 missing assets, language links and metadata issues remain P1-06 work. D-011 owner screenshot gate and P1-09 backup/restore tests remain mandatory. No database provisioned.
- **Next:** Review this decision before merging; P1-04 implements type-specific compatibility, P1-09 develops minimal DB migrations in its own PR. No homepage redesign, billing, auth or deployment performed.

### 2026-11-15 — P1-04 claim — Codex
- **Status:** IN PROGRESS; P1-03 merged via PR #18.
- **Branch:** `feat/p1-04-hugo-templates`.
- **Scope:** Implement owned Hugo shell and post/list compatibility with existing behavior; preserve paths and theme fallback.
- **Evidence:** Claim commit precedes implementation; checks to follow.
- **Next:** P1-05/06 after integration.

### 2026-11-15 — P1-04 compatibility implementation — Codex
- **Status:** BLOCKED; owned shell/post/section compatibility implementation and independent local tests complete; D-012 requires MathJax/heatmap runtime parity in a trusted network-capable browser, currently unavailable. Checkbox remains unticked.
- **Branch / PR:** `feat/p1-04-hugo-templates`, claim `e158d0a`; source and evidence committed on branch. No PR created or merge performed.
- **Files:** `layouts/_default/{baseof,single,list}.html`, `FIXIT-LICENSE.txt`, `layouts/posts/single.html`, `layouts/section.html`, `layouts/_partials/{site,p1-04}/`; map, registry, board and this log; [evidence](audits/p1-04/README.md). Shell, post and section are based on pinned FixIt under preserved MIT terms. Header/footer and many helper partials remain delegated to FixIt. Generic templates are fallbacks; type-specific posts and section are verified selected. Home is affected by shared base but output remains identical.
- **Tests:** `PATH=/workspace/.cloud-tools/bin:$PATH npm run build -- --destination /tmp/p104-final2` PASS; `python3 docs/audits/p1-01/verify.py /tmp/p1-03-public /tmp/p104-final2 docs/audits/p1-04/retention` PASS (645 files, zero byte/path changes). Independent production build/static analyzer and `python3 docs/audits/p1-02/static/test_analyzer.py` PASS; baseline missing-link and metadata counts unchanged. `hugo --environment development --destination /tmp/p104-final2-dev` PASS, 648 paths and all HTML identical to clean-origin development build; 7 JS/CSS map/bundle differences traced to embedded source paths between archive and checkout. Temporary marker probes demonstrated owned post and section lookup. Initial section newline was corrected and both builds repeated.
- **Browser:** independent Chromium P1-02 harness at 1315: 8/8 interactive checks PASS, 16 screenshots at 360/768/1024/1440 light/dark with no horizontal overflow, keyboard/reduced-motion sampled. Screenshots and raw results recorded in evidence directory. Baseline MathJax/CalHeatMap requests fail browser proxy/certificate validation; curl with verified system CA succeeds for MathJax, but browser rendering remains unverified. No TLS bypass. Production output after last whitespace change is byte-identical to browser-tested output.
- **Review / next:** `shell`, `templates`, `checks` contributors supplied implementation and independent evidence; integrator owns task status and shared knowledge docs. P1-04 cannot be marked DONE until network/trust-capable browser verifies math and heatmap and reviewer checks remaining gates. Preserve current themes/content/config; P1-05/06 wait for P1-04. No visual redesign or PostgreSQL service was implemented.

### 2026-11-15 — P1-04 external runtime verification — Claude Code
- **Status:** DONE for the task's acceptance criteria, pending maintainer review and merge of [PR #19](https://github.com/TranDung6129/TranDung6129.github.io/pull/19). Assigned by the maintainer to finish Codex's P1-04 on its existing branch; no template was rewritten.
- **Branch / PR:** `feat/p1-04-hugo-templates`, PR #19; base `main` `0eb0450` (no newer commits on main at verification time).
- **Scope and files:** evidence and docs only — new `docs/audits/p1-04/runtime/` (`runtime.cjs`, `compare.cjs`, `integrity.py`, result JSON, logs, 7 screenshots, interaction rerun), [P1-04 report](audits/p1-04/README.md), map, registry, board and this log. No layout, content, config, dependency or theme pin changed after Codex's commit `6c01cc0`.
- **Tests (all exit 0 unless stated):** `npm ci`; `hugo --gc --minify --logLevel info --destination <dir>` on `origin/main` and on this branch from the same checkout path; `python3 docs/audits/p1-01/verify.py <main> <branch> docs/audits/p1-04/runtime/retention` PASS 645/645, zero byte or path differences. `BASE=http://127.0.0.1:1315 OUT=<dir> node docs/audits/p1-04/runtime/runtime.cjs` on both builds PASS (8 named checks each); `node docs/audits/p1-04/runtime/compare.cjs <main json> <branch json>` PASS, no differing section. `python3 docs/audits/p1-04/runtime/integrity.py <branch json> <npm dir> <out>` PASS, 5/5 files and 3/3 tarballs. P1-02 `baseline.cjs` with port/browser path adjusted PASS 8/8, 16 screenshots, no overflow.
- **Results:** MathJax 3.2.2 typesets 674/674 math items on 16 pages with zero errors or raw TeX; D3 3.5.17 and Cal-Heatmap 3.3.10 render six month domains and 183 day cells with a working tooltip on all four home languages in both themes. Headless Chromium 153.0.8010.12, Playwright 1.63.0, default launch options, certificate validation on.
- **Trust path and limits:** the block in this environment was the network policy refusing `cdn.jsdelivr.net` and `d3js.org`; the maintainer approved an environment allow-listing those two hosts. HTTPS is re-terminated by the provider's managed egress proxy whose CA the environment installs in the browser store, so executed bytes were cross-checked against npm registry releases by hash. A public-internet end-user browser check remains for P1-08. Details in the report.
- **Findings / risks:** new baseline defect, identical on main — heatmap cells keep one fill in both themes and show every day as active when the window has no posts (`layouts/partials/heatmap.html`); not fixed here. Gravatar avatar host is not allow-listed in this environment (cosmetic). P1-02 link/metadata/asset defects unchanged.
- **Next dependency / requested review:** maintainer merges PR #19. P1-05, P1-06 and P1-07 proceed on stacked branches (`chore/p1-05-…` on this branch, and so on) so nothing reaches `main` without review; P1-09 stays with Codex and is not touched.

### 2026-11-15 — P1-05 claim — Claude Code
- **Status:** IN PROGRESS. Dependency P1-04 is implemented and verified on PR #19 but not yet merged, so this branch is stacked on `feat/p1-04-hugo-templates` (`574ddfa`) and its PR targets that branch until #19 merges; nothing here reaches `main` before review.
- **Branch:** `chore/p1-05-css-config-cleanup`.
- **Scope:** consolidate the two active configuration families into `config/_default/`, consolidate duplicated site CSS layers, and remove only files proven unused, each with effective-config, output and browser evidence. No homepage redesign, no theme removal (P1-07), no metadata/SEO fixes (P1-06), no database files (P1-09, Codex).
- **Evidence:** claim commit precedes implementation; checks follow in the completion entry.

### 2026-11-15 — P1-05 completion — Claude Code
- **Status:** DONE for the task's acceptance criteria, pending maintainer review. The PR is stacked on PR #19 and must merge after it; it does not touch `main` directly.
- **Branch / PR:** `chore/p1-05-css-config-cleanup`; claim `95bbcbf`, config `4d82bd4`, CSS `0b575ae`, unused files `7d83d78`, evidence/docs in the following commit. PR URL is recorded in the P1-06 claim entry once created.
- **Scope and files:** `config/_default/{hugo,markup,params}.toml`, new `module.toml`, root `hugo.toml` deleted; `assets/css/_custom.scss`, new `assets/css/home.scss`, `layouts/index.html`, `assets/css/_override.scss` deleted; removed `assets/js/custom.js`, `assets/js/components/KalmanFilterSim.jsx`, root `robots.txt`, `manim/__pycache__/*.pyc`, `media/videos/game_theory_nash/720p30/game_theory_nash.mp4`; `.gitignore`; report, tools and evidence under `docs/audits/p1-05/`; `docs/audits/p1-04/runtime/compare.cjs` (hash comparison made tolerant of uncaptured bodies); map, registry, architecture note, board and this log.
- **Tests (exit 0 unless stated):** `hugo config --format json --lang {vi,en,ja,zh-cn} --environment {production,development}` before/after with `tools/config-diff.py`: identical except deprecated `privacy.twitter` (8/8). `hugo --gc --minify` and `hugo --environment development` after the config step: `tools/compare-output.py` identical, 645 and 648 files. Final build vs baseline: removed `js/custom.min.js`, added `css/home.min.css`, changed `css/style.min.css` + map and 201 HTML files, all explained mechanically (`evidence/html-diff-explained.json`). `python3 docs/audits/p1-02/static/test_analyzer.py` PASS; `analyze.py` exits 1 by design on the two intended route changes, 83/86 metrics equal P1-02. `tools/dead-selectors.cjs` PASS (0 matches on 201 pages). `tools/home-css-rules.cjs` PASS (24 rules = 39 − 15 dead, same order, zero overlapping element/property pairs with the reordered sheets). `tools/visual-compare.cjs` PASS 355/355 states; self-test 176/176; negative control FAILS as intended (exit 1). `docs/audits/p1-04/runtime/runtime.cjs` PASS and `compare.cjs` identical to P1-04; P1-02 `baseline.cjs` 8/8, 16 screenshots, no overflow.
- **Findings / risks:** the home stylesheet now precedes the Cal-Heatmap stylesheet instead of following it — shown to be inert, but worth knowing when the heatmap is reworked. Same-build screenshot captures show occasional one-pixel raster noise on image-heavy pages; the harness retries and rechecks serially, and the report says so. `config/_default/params.toml` still mirrors theme defaults on purpose (needed once the theme config is gone). 128 Manim intermediates under `media/` remain tracked: maintainer decision requested. P1-02 defects and the heatmap colour defect are unchanged.
- **Next dependency / requested review:** maintainer reviews this PR after #19. P1-06 starts on a branch stacked on this one.

### 2026-11-15 — P1-06 claim — Claude Code
- **Status:** IN PROGRESS. P1-05 is delivered as [PR #20](https://github.com/TranDung6129/TranDung6129.github.io/pull/20), stacked on PR #19; neither is merged, so this branch is stacked on `chore/p1-05-css-config-cleanup` (`05cf5e8`).
- **Branch:** `feat/p1-06-metadata-seo`.
- **Scope:** canonical/hreflang correctness, icon and poster references, site metadata defaults, robots policy, front matter conventions. No article rewrites or translations, no permalink change, no homepage or visual change, no theme removal, no database files.

### 2026-11-15 — P1-06 completion — Claude Code
- **Status:** DONE for the task's acceptance criteria, pending maintainer review; merges after PR #19 and #20.
- **Branch / PR:** `feat/p1-06-metadata-seo`; claim `889706f`, implementation `7c9f193` plus the social-image/publisher and evidence commit. P1-05 is [PR #20](https://github.com/TranDung6129/TranDung6129.github.io/pull/20).
- **Files:** `layouts/_partials/head/link.html`, `layouts/_partials/site/translation.html`, `layouts/robots.txt`, `config/_default/{params,languages,frontmatter}.toml`, `archetypes/default.md`, `static/apple-touch-icon.png`, `static/images/game_theory_nash_poster.png`, `docs/audits/p1-06/`, map, registry, board, log. No Markdown content edited.
- **Tests:** `hugo --gc --minify --logLevel info` and `hugo --environment development` PASS (0 warnings in production). `python3 docs/audits/p1-05/tools/compare-output.py <p1-05> <p1-06>`: no route removed, 2 added. `python3 docs/audits/p1-06/tools/explain-html-diff.py <p1-05> <p1-06> out.json` PASS (201 metadata-only, 146 identical, 0 unexplained). `python3 docs/audits/p1-06/tools/seo-check.py <p1-06> content out.json` PASS on 201 pages; same command on the P1-05 build FAILS with 792 violations. `python3 docs/audits/p1-02/static/analyze.py …` (exit 1 by design): missing references 745 → 140. `node docs/audits/p1-05/tools/visual-compare.cjs routes.json`: 339/355 identical, 16 expected differences on the two Nash pages (poster). `node docs/audits/p1-04/runtime/runtime.cjs` PASS; P1-02 `baseline.cjs` 8/8, 16 screenshots, no overflow.
- **Findings / risks:** 23 of 24 English files are verbatim copies (canonicalised to the original, no hreflang); ja/zh-cn menus still point at 10 missing pages; ja/zh-cn taglines are machine-quality translations needing a native check; external validators and live deployment not tested. Full backlog and P1-07 hand-off in the [report](audits/p1-06/README.md).
- **Next:** P1-07 is not started; it needs explicit assignment after review.


### 2026-11-15 — P1-09 claim — Codex
- **Status:** IN PROGRESS; P1-03 merged in PR #18.
- **Branch:** `feat/p1-09-postgres-foundation`.
- **Scope:** Local PostgreSQL foundation, versioned migrations, demo seed and backup/restore verification. Hugo remains independent of the database. P1-04–07 are assigned elsewhere.
- **Evidence:** Claim committed before implementation; validation follows.
- **Next:** P1-08 after dependencies and review.

### 2026-11-15 — P1-09 completion — Codex
- **Status:** DONE on branch; review/integration remains separate. **Branch:** `feat/p1-09-postgres-foundation`; claim `be3b740`. **PR:** `gh pr create --base main --head feat/p1-09-postgres-foundation --title ... --body-file /tmp/p109-pr-body.md` failed: GitHub GraphQL endpoint returned Forbidden. Branch pushed; [prepared PR body](audits/p1-09/PR_BODY.md) is available for maintainer review. P1-04–07 are assigned elsewhere and were not changed.
- **Scope and files:** `compose.yaml`, `db/.env.example`, `db/.gitignore`, `db/bin/{compose,migrate}`, `db/migrations/001_foundation.sql`, `db/seed.sql`, `db/tests/integration.sh`, `db/README.md`; [D-013](DECISIONS.md#d-013--local-postgresql-reference-foundation), database foundation, codebase map, knowledge registry, task board, and [verification artifacts](audits/p1-09/README.md). No application, article, URL, theme or Hugo configuration changes.
- **Implementation:** local PostgreSQL 16.10 on loopback using demo-only credentials; ordered transactional migration runner with advisory lock, checksum/history validation and ledger; six small reference/definition tables and non-sensitive idempotent demo seed. Stable content keys are only references; future front-matter mapping needs review and public Hugo stays static. Schema has no identity, entitlement grants, transactions or billing.
- **Evidence/tests:** `docker pull postgres:16.10` PASS (layer checksums; observed digest `sha256:21f6013073bc6b92830a2129570e2f5ec42a6c734b5a985a41e83aa58f54c3c1`); `bash -n db/bin/compose db/bin/migrate db/tests/integration.sh`, `db/bin/compose config --quiet`, `git check-ignore db/.env` PASS. Independent contributor and integrator each ran `db/tests/integration.sh` PASS (exit 0): isolated project connection, migration/repeat no-op, schema constraints, seed twice, checksum tamper rejection, failed migration rollback, custom-format backup, volume removal/recreation, restore of actual rows/relationships/ledger, and no-op after restore. Integrator log: [integration.log](audits/p1-09/integration.log). `PATH=/workspace/.cloud-tools/bin:$PATH npm run build -- --destination /tmp/p109-hugo` and `python3 docs/audits/p1-01/verify.py /tmp/p1-03-public /tmp/p109-hugo /tmp/p109-hugo-check` PASS: 645 files, zero path/byte differences, see [Hugo evidence](audits/p1-09/README.md). Docker test cleanup is limited to generated project/volume/network and has been checked.
- **Contributors/review:** `db_schema` implemented schema/seed; `db_runner` implemented local Compose/runner; `db_tests` implemented isolated integration and re-ran after network collision guard. Integrator reviewed scripts, ran independent full test and Hugo build, and integrated documentation/status. This is not maintainer sign-off.
- **Known gaps / next:** ShellCheck unavailable; Bash syntax check passed. Local superuser/demo credentials and unencrypted demo backup are non-production; no hosted Supabase, least-privilege/RLS enforcement, production disaster recovery, customer data or security/compliance certification is claimed. Before production, approve provider/region/cost/privacy/retention, roles/RLS, backups/export and trusted backend separately. P1-08 depends on P1-02, P1-07 and P1-09; P1-04–07 continue independently.

### 2026-11-15 — P1-09 integration acceptance
- **Status:** DONE — reviewed and merged into the shared Hugo migration baseline after resolving parallel documentation changes.
- **PR:** [#21](https://github.com/TranDung6129/TranDung6129.github.io/pull/21). Integration preserves P1-04/P1-05/P1-06 changes, introduces only `compose.yaml` + `db/` local implementation, P1-09 audit evidence and merged documentation.
- **Review:** Inspected migration/seed/integration scripts and saved execution logs; integration test evidence supports local migrations, rollback and restore; no independent Docker rerun in this review runtime. No hosted/production DB validation.
- **Next:** P1-07 theme retirement, then P1-08 phase regression. Placeholder editorial content quality deferred by maintainer direction.

### 2026-11-15 — P1-07 claim — Claude Code
- **Status:** IN PROGRESS; P1-04, P1-05, P1-06 and P1-09 are merged (`main` `4d97a92`).
- **Branch:** `feat/p1-07-retire-fixit`, from `main`.
- **Scope:** make every template, style, script, asset, translation string and configuration default the site uses site-owned, then remove the FixIt and bookmark submodules and the theme-update machinery. Checkpoints: A dependency map, B templates, C CSS/JS/assets/i18n/config, D removal, E regression and docs. No redesign, no content edits, no deletion of the remaining Manim intermediates, no database changes.

### 2026-11-15 — P1-07 completion — Claude Code
- **Status:** DONE for the task's acceptance criteria (site builds and behaves identically with no FixIt), pending maintainer review and merge. Live deployment verification is P1-08.
- **Branch / PR:** `feat/p1-07-retire-fixit`; claim `a9dad48`, templates/assets/i18n/config `e8c5d44`, removal `a0167aa`, evidence/docs in the following commit.
- **Files:** `layouts/` (72 migrated templates), `assets/{css,js,images,lib}`, `i18n/`, `static/{favicon.ico,lib}`, `config/_default/{hugo,outputs,outputFormats,params}.toml`, `.github/{workflows/deploy.yml,dependabot.yml}`, `package.json`, `package-lock.json`, `README.md`, `THIRD_PARTY_NOTICES.md`, `LICENSE-FixIt.txt`; removed submodules, `.gitmodules`, `update-theme.yml`, `README.en.md`; docs and `docs/audits/p1-07/`.
- **Tests (exit 0):** `strace -f -e trace=openat,… hugo …` for the dependency map; `hugo --printUnusedTemplates`; fresh clone → `npm ci` → `hugo --gc --minify` (0 warnings); `python3 docs/audits/p1-07/tools/compare-normalised.py <main build> <fresh build> …` PASS 647/647 (2 path-only map differences), development PASS 650/650 (6 path-only); `hugo config` diff 4 languages × 2 environments: 584 keys identical, 37 theme-only keys gone; P1-02 `analyze.py` summary byte-identical to the pre-migration run (exit 1 by design for the known route set); `seo-check.py` PASS; `visual-compare.cjs` PASS 355/355; `runtime.cjs` on both builds PASS and `compare.cjs` identical; `baseline.cjs` 8/8, 16 screenshots, no overflow; `keyboard.cjs` sample unchanged.
- **Findings / risks:** FixIt-derived files are now maintained here; 52 unused templates were not migrated; footer/meta still credit FixIt; two unused `static/lib` trees remain published; 128 Manim intermediates untouched. Earlier defects unchanged. First deploy without submodules has not run yet.
- **Next:** P1-08 after merge (deployment smoke test, rollback notes, sign-off).


### 2026-11-15 — P1-08 integration checkpoint (reviewed, live smoke BLOCKED)
- **Baseline:** Theme-free merge `e5269a0` (PR #23) and all Phase-1 prerequisites are merged.
- **Deployment:** GitHub Actions run [43706336488](https://github.com/TranDung6129/TranDung6129.github.io/actions/runs/43706336488) build and deploy both SUCCESS, on `e5269a0`, Pages reported success. Artifact 14157718813 uploaded.
- **Regression review:** Checked stored P1-07 report and results (647 output files, 355 screenshot states, 8/8 interactions, MathJax/Cal-Heatmap, SEO 201 pages). These tests were run by Claude, not rerun independently here.
- **Blocker:** Public site cannot be fetched from this review environment via web/DNS, so no independent live browser/HTTP smoke evidence. Do not mark P1-08 DONE until that specific gate is demonstrated.
- **Next:** trusted browser smoke, screenshots and console/HTTP findings per [P1-08 audit](audits/p1-08/README.md); Phase 2 concept may proceed separately as a design prototype, not automatic production homepage redesign.

### 2026-11-15 — P1-08 live retry — Codex
- **Status:** BLOCKED; no origin connection. **Branch:** `docs/p1-08-live-retry`, base `a01366e`.
- **Evidence:** Independent contributor tried Chromium 156.0.8078.79, normal TLS, `https://trandung6129.github.io/`: `net::ERR_TUNNEL_CONNECTION_FAILED`. `curl -I --max-time 12 https://trandung6129.github.io/` failed exit 56, proxy CONNECT HTTP 403. Environment status reports restricted egress and site hostname absent from effective allowlist. This is not an origin response and does not establish a site outage. No live checks or site screenshots passed. See [P1-08 report](audits/p1-08/README.md).
- **Next:** Allow the site host and retry full live smoke, then maintainer sign-off. Continue independent Phase 2 specimen work; no homepage deployment or design approval inferred.

### 2026-11-15 — P2-01 claim — Codex
- **Status:** IN PROGRESS; P1-03 DONE. P1-08 live retry remains BLOCKED and is documented separately.
- **Branch:** `feat/phase2-editorial-specimens`, stacked on `docs/p1-08-live-retry`.
- **Scope:** Isolated editorial tokens, contrast and usage; no production homepage or site-wide visual rollout.
- **Next:** Typography specimen and review-gated components.

### 2026-11-15 — P2-01 — Codex evidence
- **Status:** DONE for token implementation/contrast; owner visual approval remains pending P2-06. Branch `feat/phase2-editorial-specimens`, claim `c074a64`.
- **Files:** `assets/css/editorial/tokens.css`, `docs/design/TOKENS.md`, `docs/design/check-token-contrast.py`, map, registry and status. Tokens are not imported in public templates.
- **Tests:** `python3 docs/design/check-token-contrast.py` PASS: body/accent/muted >=4.5:1 on paper and surfaces in light/dark. Light muted changed to #6A6256 due baseline #7A7265 measuring 4.36:1 on paper. `npm run build -- --destination /tmp/p201-public` PASS. A separate build with only the new unreferenced token file temporarily moved outside checkout produced 647/647 paths, 0 changed bytes. Initial P1-02 route check failed because P1-07 deliberately changed baseline paths; comparison rerun against current main output instead.
- **Limits:** System font stacks are candidates, not final adoption; typography/actual visual review remains P2-02/P2-06. Browser visual approval not claimed. P1-08 remains blocked on live egress.

### 2026-11-15 — P2-02 claim — Codex
- **Status:** IN PROGRESS; P2-01 tokens pass on stacked branch.
- **Branch:** `feat/p2-02-typography`, based on `feat/p2-01-tokens`.
- **Scope:** Real browser typography specimen with Vietnamese/English, math and code. Prototype remains local-only, no homepage production change.

### 2026-11-15 — P2-02 — Codex evidence
- **Status:** DONE for the typography specimen and automated rendering checks; visual direction and final typeface remain UNAPPROVED pending owner review. **Branch:** `feat/p2-02-typography`, claim `93a88cd`.
- **Files:** review-only Hugo template, typography partial/CSS, preview script, browser check and four preliminary screenshots; [type notes](design/TYPOGRAPHY.md). Native MathML and existing Vietnamese excerpt are included; no content/page changes in the repository. Contributor drafted composition in temporary directory; integrator isolated and tested typography checkpoint.
- **Checks:** `PATH=/workspace/.cloud-tools/bin:$PATH scripts/preview-editorial.sh` PASS after supported `--enableGitInfo=false` in the temporary source (initial run failed because copied tree lacked .git). Preview HTTP 200, Vietnamese and MathML/code present. `NODE_PATH=/tmp/p1-02-browser/node_modules node scripts/test-editorial-typography.cjs` PASS at 360/1440 light/dark: math has nonzero rendered width, Vietnamese and code present, no horizontal overflow. Screenshots in `docs/design/screenshots/`. Production Hugo build and SHA256 tree comparison vs `/tmp/p201-before` PASS: 647 paths, zero added/removed/changed bytes and no editorial-review route.
- **Limits:** Font fallback stacks are provisional, not an owner selection; no full accessibility or performance certification. P2-03/04/05 and full visual review follow. P1-08 remains BLOCKED on live-site proxy egress.

### 2026-11-15 — P2-03 claim — Codex
- **Status:** IN PROGRESS; dependencies P1-04 and P2-01 DONE.
- **Branch:** `feat/p2-03-navigation` stacked on P2-02.
- **Scope:** Review-only editorial navigation/search/mobile menu and theme controls; no public route changes.

### 2026-11-15 — P2-03 navigation checkpoint — Codex
- **Status:** IN PROGRESS: core navigation and local interaction probes pass; section anchors and full responsive/accessibility review await integrated P2-04/05 specimen. Branch `feat/p2-03-navigation`, claim `ce9d298`.
- **Change:** Review-only masthead, mobile menu, local article search and theme persistence; keyboard Escape closes menu and search with focus return. Search uses a request sequence to ignore stale asynchronous responses. Responsive CSS updated; trailing blank lines from P2-02 corrected without semantic changes. No public homepage modification.
- **Checks:** `NODE_PATH=/tmp/p1-02-browser/node_modules node scripts/test-editorial-navigation.cjs` PASS on local preview: menu open/Escape focus, theme persistence, delayed search race, real Nash search results and search Escape. Full link/keyboard/motion testing follows integrated specimen; no owner visual approval claimed.

### 2026-11-15 — P2-04 claim — specimen_design / Codex integrator
- **Status:** IN PROGRESS; P2-01/02 done on stacked branches. P2-03 remains in progress pending integrated anchors.
- **Branch:** `feat/p2-04-editorial-components`, stacked on P2-03.
- **Scope:** Reusable editorial components and isolated experimental homepage composition; original SVG illustration only. No production homepage changes.

### 2026-11-15 — P2-04 — specimen_design / Codex
- **Status:** DONE for isolated editorial component prototypes; production propagation and owner visual approval remain pending P2-06. **Branch:** `feat/p2-04-editorial-components`, claim `5d52416`. P2-03 remains IN PROGRESS pending final integrated anchors.
- **Files:** `layouts/_partials/specimen/{home,feature,art-landscape,art-architecture}.html`, `assets/css/specimen/home.css`, [illustration provenance](design/ASSET-PROVENANCE.md). Two featured entries share the parameterized `feature.html`; journal/volume/hero are specimen composition. Original SVG illustrations are AI-assisted, illustrative and not a copied background; publication rights review remains pending.
- **Tests:** Local review route HTTP 200 contains hero, two featured components, journal and volume anchors; `PATH=/workspace/.cloud-tools/bin:$PATH npm run build -- --destination /tmp/p204-public` PASS, 647 production files and byte-identical tree vs `/tmp/p201-before`, no review route. Full browser visual/keyboard/contrast QA and screenshot review follow after P2-05 integration; no maintainer approval claimed.

### 2026-11-15 — P2-05 claim — Codex
- **Status:** IN PROGRESS; P2-01 and P2-04 done on stacked branches.
- **Branch:** `feat/p2-05-future-specimens`, stacked on P2-04.
- **Scope:** Visual-only future formats; no commerce, auth, payment, subscription or infrastructure.
