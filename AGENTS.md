# AI Agent Instructions — The Epistemic Diary

This file is the entry point for Codex, Claude Code, Cursor, and other coding agents.

## Read first (in order)
1. docs/README.md
2. docs/CODEBASE_MAP.md (find the owning files before searching)
3. docs/INSPECTED_FILES.md (persistent per-file findings and inspected blob versions)
4. docs/MASTER_PLAN.md
5. docs/TASK_BOARD.md
4. docs/ARCHITECTURE.md
5. docs/DESIGN_SYSTEM.md
6. docs/VISUAL_DIRECTION.md (mandatory visual north star and screenshot approval gate)
6. docs/VISUAL_ASSET_GUIDELINES.md
7. docs/ENGINEERING_STANDARDS.md
8. docs/QUALITY_GATES.md
9. Docs relevant to the assigned task: CONTENT_MODEL, EDITORIAL_VOICE, SEO_AND_MONETIZATION, DECISIONS.

## Product and scope
- Brand: **The Epistemic Diary**. Do not rebrand as a personal-name blog. Personal name may appear only in bylines/About.
- Product: independent editorial publication; magazine + book-like volumes/chapters; future videos, labs, product discovery, reader support, and membership.
- Current authorized implementation scope: **Phase 1 repository cleanup/foundation, then Phase 2 design system**. Do not redesign homepage or implement payment, auth, memberships, news feed, ads, or affiliate tracking unless explicitly commissioned later.
- Keep Hugo and GitHub Pages. Replace FixIt progressively after feature parity; do not prematurely delete it.
- Preserve current color mood (warm paper/ink/terracotta and midnight library) and comfortable long-form reading.
- Content must be accurate, source-aware, accessible, and pleasant to read; humor without sacrificing precision.

## Multi-agent workflow — REQUIRED
1. Inspect docs/TASK_BOARD.md; choose an **unclaimed** task with dependencies completed. If assigned externally, respect the assignment.
2. Claim one task by changing its row to **IN PROGRESS**, adding your agent identifier and working branch in the task log (docs/AGENT_LOG.md). Commit claim first; coordinate via PR to avoid simultaneous edits to the same board.
3. Work only within the claimed scope. Separate branches/PRs for independent tasks. If an unrelated issue is discovered, record it rather than silently expanding scope.
4. Run task-specific checks plus relevant docs/QUALITY_GATES.md checks. Record command, result, commit/PR URL (or precise path), and known gaps in AGENT_LOG.md.
5. Mark task **DONE** only if its acceptance criteria and evidence are satisfied. Otherwise mark **BLOCKED** or retain **IN PROGRESS**. Add a checkbox tick in TASK_BOARD.md only after verification.
6. PR reviewers validate cross-cutting integration; never merge directly to main without approval. Update docs/DECISIONS.md for architecture changes.

## Non-negotiable safeguards
- Never change public permalinks without a URL map and a tested redirect/retention strategy.
- Never drop Markdown, translated variants, images, math, code, shortcodes, RSS, search, or theme toggles until parity is tested.
- Audit existing React/Recharts usage before removing dependencies (interactive components are present).
- Do not mutate/remove existing theme submodules until replacement pages compile and regression tests pass.
- Never expose premium plaintext in generated public HTML; client-side hiding is not a paywall.
- External links and future affiliate material require honest labeling. Never fabricate product tests, prices, citations, traffic, or freshness claims.
- Use semantic HTML and keyboard-accessible controls; respect reduced-motion preferences.
- Phase 2 design must follow docs/VISUAL_DIRECTION.md: do not assume correct tokens equal good visual design; render real prototype screenshots for owner approval before rolling visual changes through the site. Homepage redesign remains Phase 3 and requires approval.
- Follow docs/VISUAL_ASSET_GUIDELINES.md: original/look-consistent images, provable commercial-use rights and truthful documentary imagery.
- Follow docs/ENGINEERING_STANDARDS.md and docs/DATABASE_FOUNDATION.md: **PostgreSQL local foundation is approved** (P1-09), but public articles remain static; no unapproved authentication, billing, hosted provisioning or secrets in Git. Use versioned migrations and tested backup/restore plans.
- Update docs/CODEBASE_MAP.md in the SAME PR whenever an entry point, dependency, component owner or file path changes; record where future agents should edit.
- **Every file you read, even incidentally while searching, must contribute to docs/INSPECTED_FILES.md**: purpose, key components, consumers/dependencies, risks, verified Git blob SHA, coverage PARTIAL/COVERED, and test evidence. Do not record only whether a sought term exists. If an entry is unchanged, reuse its summary; if the file changed, update just the changed content/dependency implications. The registry is guidance, not a license to edit code without checking current source.
- For large generated/vendor/binary trees, use a concise group-level entry rather than exhaustive per-file descriptions. Coordinate shared Markdown edits through one integrator to prevent branch conflicts. Prefer targeted reads over whole-repo scanning.
- Do not automatically check off project-wide acceptance solely because a local task passed.

## Handoff format (append to docs/AGENT_LOG.md)
Task ID | Agent | branch/PR | files changed | tests (exact command + pass/fail) | findings/risks | next task/dependency.

If conflict arises, stop editing shared files and request integration. **TASK_BOARD.md is the authoritative status ledger.**
