#!/usr/bin/env bash
# Destructive operations are confined to a freshly generated Compose project.
set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
test_tmp=$(mktemp -d "${TMPDIR:-/tmp}/ted-p109-test.XXXXXXXX")
suffix=$(basename "$test_tmp" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9')
export COMPOSE_PROJECT_NAME="p109${suffix}"
export P1_POSTGRES_USER=p109_test
export P1_POSTGRES_PASSWORD=p109_test_local_only
export P1_POSTGRES_DB=p109_test
export P1_POSTGRES_PORT
P1_POSTGRES_PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1",0)); print(s.getsockname()[1]); s.close()')
unset COMPOSE_FILE COMPOSE_PROFILES P1_MIGRATIONS_DIR
fixture="$test_tmp/fixture"
mkdir -p "$fixture/db/migrations"
cp "$repo_root/compose.yaml" "$fixture/compose.yaml"
cp -R "$repo_root/db/bin" "$fixture/db/bin"
cp "$repo_root"/db/migrations/*.sql "$fixture/db/migrations/"
cp "$repo_root/db/seed.sql" "$fixture/db/seed.sql"
export P1_MIGRATIONS_DIR="$fixture/db/migrations"
compose="$fixture/db/bin/compose"
migrate="$fixture/db/bin/migrate"
owned=false
cleanup() {
  if [[ "$owned" == true ]]; then "$compose" down --volumes --remove-orphans >/dev/null 2>&1 || true; fi
  rm -rf -- "$test_tmp"
}
trap cleanup EXIT

# Never adopt or delete an existing project. Project name is generated locally.
if [[ -n $(docker ps -aq --filter "label=com.docker.compose.project=$COMPOSE_PROJECT_NAME") || -n $(docker volume ls -q --filter "label=com.docker.compose.project=$COMPOSE_PROJECT_NAME") || -n $(docker network ls -q --filter "label=com.docker.compose.project=$COMPOSE_PROJECT_NAME") ]]; then
  printf 'Refusing to reuse an existing Compose project.\n' >&2
  exit 1
fi
owned=true
"$compose" up -d --wait
sql() {
  "$compose" exec -T db psql -X -v ON_ERROR_STOP=1 -U "$P1_POSTGRES_USER" -d "$P1_POSTGRES_DB" -Atqc "$1"
}
assert_eq() {
  if [[ "$1" != "$2" ]]; then printf 'FAIL: %s (expected %s; got %s)\n' "$3" "$2" "$1" >&2; exit 1; fi
  printf 'PASS: %s\n' "$3"
}
expect_sql_failure() {
  if sql "$1" >/dev/null 2>&1; then printf 'FAIL: %s unexpectedly succeeded\n' "$2" >&2; exit 1; fi
  printf 'PASS: %s\n' "$2"
}

assert_eq "$(sql 'SELECT 1')" 1 'database connection'
"$migrate"
assert_eq "$(sql 'SELECT count(*) FROM public.schema_migrations')" 1 'clean migration ledger'
assert_eq "$(sql "SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('editorial_authors','editorial_objects','editorial_object_authors','catalog_products','entitlement_types','product_entitlement_types')")" 6 'expected six metadata tables'
"$migrate"
assert_eq "$(sql 'SELECT count(*) FROM public.schema_migrations')" 1 'repeat migration is a no-op'

for attempt in 1 2; do
  "$compose" exec -T db psql -X -v ON_ERROR_STOP=1 -U "$P1_POSTGRES_USER" -d "$P1_POSTGRES_DB" < "$fixture/db/seed.sql" >/dev/null
done
assert_eq "$(sql 'SELECT count(*) FROM editorial_authors')" 1 'demo seed is idempotent'
assert_eq "$(sql "SELECT string_agg(content_key, ',') FROM editorial_objects")" demo-article 'demo editorial object present'
assert_eq "$(sql 'SELECT count(*) FROM editorial_object_authors')" 1 'demo author relationship present'
assert_eq "$(sql 'SELECT count(*) FROM product_entitlement_types')" 1 'demo capability relationship present'
expect_sql_failure "INSERT INTO editorial_objects (id,content_key,kind) VALUES ('00000000-0000-4000-8000-000000000010','Bad Key','article')" 'invalid content key rejected'
expect_sql_failure "INSERT INTO editorial_objects (id,content_key,kind) VALUES ('00000000-0000-4000-8000-000000000011','invalid-kind','invalid')" 'invalid kind rejected'
expect_sql_failure "INSERT INTO editorial_object_authors (editorial_object_id,author_id) VALUES ('00000000-0000-4000-8000-000000000099','00000000-0000-4000-8000-000000000001')" 'missing editorial foreign key rejected'
expect_sql_failure "INSERT INTO editorial_object_authors (editorial_object_id,author_id) VALUES ('00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001')" 'duplicate association rejected'

# Both invalid changes occur only in the temporary fixture, not the checkout.
printf '\n-- deliberate checksum mutation for test\n' >> "$fixture/db/migrations/001_foundation.sql"
if "$migrate" >"$test_tmp/tamper.log" 2>&1; then printf 'FAIL: modified migration was accepted\n' >&2; exit 1; fi
printf 'PASS: changed applied migration rejected\n'
cp "$repo_root/db/migrations/001_foundation.sql" "$fixture/db/migrations/001_foundation.sql"
cat > "$fixture/db/migrations/002_test_rollback.sql" <<'SQL'
CREATE TABLE p109_rollback_probe (id integer);
SELECT 1 / 0;
SQL
if "$migrate" >"$test_tmp/rollback.log" 2>&1; then printf 'FAIL: broken migration was accepted\n' >&2; exit 1; fi
assert_eq "$(sql "SELECT to_regclass('public.p109_rollback_probe') IS NULL")" t 'failed migration transaction rolls back schema'
assert_eq "$(sql 'SELECT count(*) FROM public.schema_migrations')" 1 'failed migration does not enter ledger'
rm "$fixture/db/migrations/002_test_rollback.sql"

"$compose" exec -T db pg_dump -U "$P1_POSTGRES_USER" -d "$P1_POSTGRES_DB" --format=custom --no-owner > "$test_tmp/backup.dump"
test -s "$test_tmp/backup.dump"
"$compose" down --volumes --remove-orphans
"$compose" up -d --wait
assert_eq "$(sql "SELECT to_regclass('public.editorial_objects') IS NULL")" t 'recreated volume starts empty'
"$compose" exec -T db pg_restore --exit-on-error --no-owner -U "$P1_POSTGRES_USER" -d "$P1_POSTGRES_DB" < "$test_tmp/backup.dump"
assert_eq "$(sql "SELECT string_agg(content_key, ',') FROM editorial_objects")" demo-article 'backup restores demo data'
assert_eq "$(sql 'SELECT count(*) FROM editorial_object_authors')" 1 'backup restores author relationship'
assert_eq "$(sql 'SELECT count(*) FROM product_entitlement_types')" 1 'backup restores capability relationship'
assert_eq "$(sql 'SELECT count(*) FROM public.schema_migrations')" 1 'backup restores migration ledger'
"$migrate"
assert_eq "$(sql 'SELECT count(*) FROM public.schema_migrations')" 1 'migration remains a no-op after restore'
printf 'PASS: isolated PostgreSQL migration and backup/restore integration test\n'
