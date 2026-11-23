#!/usr/bin/env bash
# D4 review build: the site plus the review-only overlay in docs/phases/phase-4/d4/prototype/,
# assembled in a temporary directory so the prototype can never be published by a normal build.
# Usage: scripts/preview-d4.sh <output-dir>   (static build; serve it with any static server)
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
proto="$root/docs/phases/phase-4/d4/prototype"
out="${1:?output directory}"
tree="$(mktemp -d "${TMPDIR:-/tmp}/ted-d4-preview.XXXXXXXX")"
trap 'rm -rf -- "$tree"' EXIT
git -C "$root" ls-files -z | (cd "$root" && xargs -0 cp --parents -t "$tree")
ln -s "$root/node_modules" "$tree/node_modules"
cp -r "$root/.git" "$tree/.git"      # enableGitInfo needs the history
grep -vE '^\s*(#|$)' "$proto/REMOVE" | while read -r p; do rm -rf -- "$tree/$p"; done
(cd "$proto" && find content data layouts assets -type f -print0 | xargs -0 cp --parents -t "$tree")
for f in "$proto"/i18n-append/*.toml; do cat "$f" >> "$tree/i18n/$(basename "$f")"; done
for l in ja zh-CN; do cat "$proto/i18n-append/en.toml" >> "$tree/i18n/$l.toml"; done
# Wire the prototype into the shell: its stylesheet, and the series box instead of the volume box.
sed -i 's/"site" "d1"/"site" "d1" "d4"/' "$tree/layouts/_partials/site/head-assets.html"
sed -i 's#editorial/volume-position.html#editorial/series-position.html#g' "$tree/layouts/_partials/editorial/article.html"
hugo --source "$tree" --gc --minify --cleanDestinationDir --destination "$(realpath -m "$out")"
