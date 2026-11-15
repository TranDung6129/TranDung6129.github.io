#!/usr/bin/env bash
# A temporary Hugo source tree makes the specimen impossible to publish by a normal build.
set -euo pipefail
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
preview_dir="$(mktemp -d "${TMPDIR:-/tmp}/ted-editorial-preview.XXXXXXXX")"
cleanup() { rm -rf -- "$preview_dir"; }
trap cleanup EXIT
for item in config layouts assets content static archetypes i18n data; do
  if [[ -d "$project_root/$item" ]]; then cp -a "$project_root/$item" "$preview_dir/$item"; fi
done
if [[ -d "$project_root/node_modules" ]]; then ln -s "$project_root/node_modules" "$preview_dir/node_modules"; fi
mkdir -p "$preview_dir/content/editorial-review"
cat > "$preview_dir/content/editorial-review/index.md" <<'PAGE'
+++
title = "Editorial design specimen"
type = "specimen"
draft = true
+++
PAGE
printf 'Editorial preview: http://127.0.0.1:%s/editorial-review/\n' "${EDITORIAL_PORT:-1317}"
printf 'The preview uses a temporary snapshot. Restart after source changes.\n'
hugo server --source "$preview_dir" --environment editorial-review --enableGitInfo=false --buildDrafts --bind 127.0.0.1 --port "${EDITORIAL_PORT:-1317}" --disableFastRender
