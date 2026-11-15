# PostgreSQL Foundation — Phase 1 (P1-09)

**Decision:** a database foundation is required now. **Not the same as** building accounts, backend APIs, payments or subscribing users now. The public Hugo site remains fully functional without a database.

## Why now
Later features include voluntary reader support, memberships, original digital products, creator/author accounts, Discover inventory, and analytics. Schema planning, safe migrations and recovery procedures reduce redesign risks when those systems become real.

## Chosen baseline
- Engine: PostgreSQL (local development first).
- Preferred managed option for later hosted use: Supabase PostgreSQL, subject to the maintainer choosing an account/region/plan after reviewing costs and privacy.
- Application/runtime: Hugo serves public editorial pages statically on GitHub Pages. Do not connect PostgreSQL credentials from browser or build pipeline to publish normal articles.
- No paid cloud service, credentials or private project is created by this documentation update.

## P1-09 deliverables
1. Document entity-boundary diagram and risks; no live payment/identity behavior.
2. Local reproducible Postgres runtime (e.g., docker-compose with healthcheck; non-production credentials only), README and environment.example.
3. Versioned SQL migration system; no manual schema edits.
4. Minimal extensible foundation for **editorial object IDs**, **author references**, **product catalog references**, and future **member/support entitlement modeling**; avoid overengineering and do not store transactional events before implementing a trustworthy backend.
5. Tiny non-sensitive seed dataset labeled test/demo; no real personal data.
6. Tests: start database, migrate clean DB, migrate repeatedly/idempotence policy, inspect expected schema, basic connection test, tear down and restore from backup.
7. Security outline: roles/privileges, row-level security policy if Supabase is later used, server-side authorization and provider webhook verification for future billing, privacy/data retention.
8. Clarify how static Hugo content IDs map to future DB records without moving article bodies into the DB.
9. Record exact commands/output, constraints and next steps in AGENT_LOG. Mark DONE only after verification.

## What NOT to build
- No public login/sign-up UI or fake membership checkout.
- No real customer data, payment records or private article plaintext in public HTML.
- No unnecessary GraphQL/REST service, ORM, microservices or mobile app.
- No database requirement for GitHub Pages build, article rendering, SEO or search.
- No Supabase account/project provisioning without explicit maintainer credentials/approval.

## Future entity candidates, subject to feature approval
`author_profiles`, `members`, `support_tiers`, `support_events`, `products`, `purchases`, `entitlements`, `affiliate_links`.
These are **candidates**, not an instruction to create eight production tables. Favor a small flexible schema with a documented expansion path.

## Hosting and economics
Before creating cloud resources, document expected monthly cost, free-tier/limits, region, backups/restore, privacy and cross-border data transfers, exit/export strategy, and credential management. Prefer provider-neutral SQL migrations and data export where reasonable.

## P1-09 acceptance
- Local Postgres can be started and schema migrated with documented commands.
- Clean build of the public Hugo site remains unchanged.
- Demonstrated migration and tested backup/restore flow.
- No committed secrets, production keys, or unapproved network dependencies.
- Architecture rationale, test evidence and a clear later rollout plan available to other agents.
