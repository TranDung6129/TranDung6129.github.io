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
