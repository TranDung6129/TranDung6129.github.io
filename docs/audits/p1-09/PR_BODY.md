## Purpose

Add the approved local PostgreSQL foundation so future editorial and product references have stable identifiers and a tested migration/recovery workflow. Hugo continues to build public articles without a database.

## Change

- Add a local PostgreSQL 16.10 Compose service, ordered transactional migrations with advisory locking and checksum history, a small reference-only schema, and synthetic demo seed.
- Document setup, security boundaries, future content-key mapping and backup/restore; record D-013 and update the task and knowledge ledgers.
- Add isolated Docker integration tests; no hosted provisioning, customer identities, payment or authorization flows are included.

## Validation

- `db/tests/integration.sh` passed twice, including clean/repeat migrations, constraints, checksum tampering, transaction rollback, seed idempotence, volume recreation and restored rows/relationships/ledger.
- Hugo production build and baseline comparator passed: 645 emitted files, no path or byte changes.
- Bash syntax, Compose configuration and ignored local env checks passed. ShellCheck is unavailable.

## Change impact and knowledge captured

Database entrypoints are `compose.yaml`, `db/bin/`, `db/migrations/`, `db/seed.sql` and `db/tests/`; the codebase map and inspected-file registry document ownership and reviewed versions. Runtime uses local demo superuser credentials and is not a production security configuration. No UI or public site behavior changed.
