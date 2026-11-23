#!/usr/bin/env bash
# Review build of a phase prototype: the tracked site plus a review-only overlay directory,
# assembled in a temporary tree so the prototype can never be published by a normal build.
# Overlay layout: content/ data/ layouts/ assets/ static/ (copied over the tree), REMOVE (paths to
# delete), i18n-append/<lang>.toml (appended; en is also appended to ja and zh-CN), SED (lines
# "file<TAB>sed-expression" applied in the tree).
# Usage: scripts/preview-overlay.sh <overlay-dir> <output-dir>
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
proto="$(realpath "${1:?overlay directory}")"; out="$(realpath -m "${2:?output directory}")"
tree="$(mktemp -d "${TMPDIR:-/tmp}/ted-overlay.XXXXXXXX")"; trap 'rm -rf -- "$tree"' EXIT
git -C "$root" ls-files -z | (cd "$root" && xargs -0 cp --parents -t "$tree")
ln -s "$root/node_modules" "$tree/node_modules"; cp -r "$root/.git" "$tree/.git"
[[ -f "$proto/REMOVE" ]] && grep -vE '^\s*(#|$)' "$proto/REMOVE" | while read -r p; do rm -rf -- "$tree/$p"; done
for d in content data layouts assets static; do [[ -d "$proto/$d" ]] && (cd "$proto" && find "$d" -type f -print0 | xargs -0 cp --parents -t "$tree"); done
if [[ -d "$proto/i18n-append" ]]; then
  for f in "$proto"/i18n-append/*.toml; do cat "$f" >> "$tree/i18n/$(basename "$f")"; done
  [[ -f "$proto/i18n-append/en.toml" ]] && for l in ja zh-CN; do cat "$proto/i18n-append/en.toml" >> "$tree/i18n/$l.toml"; done
fi
[[ -f "$proto/SED" ]] && grep -vE '^\s*(#|$)' "$proto/SED" | while IFS=$'\t' read -r f e; do sed -i "$e" "$tree/$f"; done
hugo --source "$tree" --gc --minify --cleanDestinationDir --destination "$out"
