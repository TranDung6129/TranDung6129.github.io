# Engineering Standards — The Epistemic Diary

## Applicability
**Current product:** Hugo static publication on GitHub Pages, with an **approved PostgreSQL foundation in Phase 1** for future reader support, subscriptions and product discovery. Provision a safe local development database/schema and migration workflow now; hosted credentials/project creation require maintainer action. Do not build an application backend, mobile app, customer accounts or payments without later approval. The public Hugo reading path must remain available when the database is offline.

## System boundaries and future architecture
| Concern | Current implementation | Later if justified |
|---|---|---|
| Frontend | Hugo templates, CSS, progressive JS | interactive components or optional app |
| Backend | None needed for public articles | API/service for payment, private delivery and identities |
| Database | PostgreSQL foundation + migrations in Phase 1, no public runtime dependency | Extend for users/orders/entitlements on feature approval |
| File storage | Versioned public static assets | private object storage for paid files |
| External services | GitHub Pages, optional analytics/search | checkout provider, email, subscriptions, video |
Whenever proposing a new service, document why Hugo static isn't sufficient, costs, backup, exit strategy and new data risk.

## Code organization and review
- Git version control, narrowly scoped branches/PRs, small reversible commits; do not alter main directly.
- Reduce duplicated logic using Hugo partials/components; avoid premature abstraction of one-off content.
- Keep modules cohesive and reasonably sized; split by feature/boundary, not arbitrary file-line limits.
- Document architecture decisions and tradeoffs; test additions against future Journal/Volumes/Films/Labs/Discover requirements without building speculative systems.
- Make one coherent change per task; review diff and build artifacts, not just AI-written summaries.
- Pin dependency versions where possible; inspect package usage and bundle impact before adding/removing.
- Provide a rollback path for risky migrations.

## Security and authorization
- No credentials or secrets in Git, public builds, client HTML, browser JS or prompt transcripts. A local .env excluded from Git is necessary but not sufficient; use hosting/CI secret stores, least privilege and key rotation on exposure.
- Never rely on hiding buttons or content for authorization. Enforce permissions on the trusted backend on every protected request.
- Use server-side validation, secure session management and anti-abuse for future auth/payment features.
- Payment success determined by verified provider webhook/server confirmation, never client-only redirect; make transactions idempotent.
- Private premium assets remain outside public Hugo output and publicly accessible storage buckets.
- Restrict third-party scripts and external embeds; update dependencies and check known vulnerabilities.

## Database and storage — approved foundation now
- PostgreSQL is the agreed database engine. Supabase-hosted PostgreSQL is the preferred managed option; self-hosting is not required. Keep provider choice, costs, access and credentials behind an explicit approval gate.
- In P1-09, supply local development setup (Docker Compose or equivalent), versioned schema migrations, seed/demo data with no PII, environment.example, minimal migration/connection smoke tests, and a short backup/restore procedure. The scope is **infrastructure and reversible schema only**, not a deployed member service.
- Define stable identifiers, migration conventions and separation of public editorial references from private member/order/payment data. Do not invent live customers, subscriptions or transaction records.
- Database is not mandatory for reading public Hugo pages: flat files remain the source of editorial text, navigation and site build; database outages must not break article rendering.
- Keep large media in object storage, store references/metadata in DB where useful. Some DB-backed small binary records may be appropriate, but media libraries belong in storage.
- Schema changes via reviewed migrations, rollback plans, backups and **restore tests**. Never manually edit production schema without a controlled migration.
- Design for least privilege, data retention, export/deletion and ownership boundaries.

## Hosting, CI/CD and observability
- Keep GitHub Pages deployments with Actions unless a documented business need warrants moving.
- CI: build, link/route diff, SEO checks, lint/test where available, accessibility and browser checks for changed UI.
- Preview or branch builds before merging; prevent main deployment for failed quality gates.
- Record failures and deployment outcomes in agent log; production error visibility without unnecessary personal data.
- Responsive web first; mobile apps/PWA only when usage requires platform features.

## Privacy and regulatory review
- Collect minimum necessary data, document purpose and lifecycle, publish appropriate disclosures and usable data-rights paths.
- For consent-based processing, do not use pre-ticked consent as evidence; legal basis and actual legal requirements require case-specific review.
- Incident notification periods, cross-border transfer obligations, lawful bases and storage rules are **jurisdiction- and circumstance-dependent**; do not hardcode an across-the-board "72 hours" rule.
- Before user accounts, newsletter, support payments, targeted advertising or overseas AI processing, conduct a current Vietnam privacy, cybersecurity, commerce, consumer protection and tax compliance review with qualified advice when needed.
- Review data processors, data flows, international transfers, consent/user-rights mechanisms, retention and incident response.
- Do not claim legal compliance without evidence.

## AI-agent delivery
- Read AGENTS.md and MASTER_PLAN before touching code.
- Claim one task and update task board/status; keep work separated by PR.
- Identify affected layer (template, CSS, build, data or future backend), risks and acceptance tests.
- Run checks and inspect real diff; if unable to test, report BLOCKED/not verified rather than tick DONE.
- Never optimize for fewer files or fewer tokens at the expense of clear architecture and complete validation.
