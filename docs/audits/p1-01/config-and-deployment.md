# P1-01 configuration, deployment and theme audit

Read-only contributor: Codex config_audit. Base audit branch `audit/p1-01-repository-inventory`. No source/config/task status edits made.

## Reproducible configuration evidence

Executed successfully from `/workspace/TranDung6129.github.io` using Hugo Extended 0.149.0:

```sh
/workspace/.cloud-tools/bin/hugo config --format json > /tmp/p1-effective-config.json
mkdir -p /tmp/p1-empty-config-dir
touch /tmp/p1-empty.toml
/workspace/.cloud-tools/bin/hugo config --format json --configDir /tmp/p1-empty-config-dir > /tmp/p1-root-only.json
/workspace/.cloud-tools/bin/hugo config --format json --config /tmp/p1-empty.toml > /tmp/p1-dir-only.json
/workspace/.cloud-tools/bin/hugo config --format json --lang en > /tmp/p1-effective-en.json
/workspace/.cloud-tools/bin/hugo config mounts > /tmp/p1-mounts.txt
```

The isolation checks keep the repository unchanged: empty paths are outside checkout. JSON outputs omit zero values by default. Comparison proves `config/_default` overrides conflicting values in root `hugo.toml` while root-only settings remain active; theme defaults fill gaps. Do not discard either file family based on duplication.

| Setting | root-only | normal effective configuration |
|---|---|---|
| title | empty (omitted in JSON) | The Epistemic Diary |
| themes | FixIt | FixIt, shortcode-docs-bookmark |
| menus.main | 4 items | 9 items, collection parent/children added |
| Goldmark strikethrough | false (omitted) | true |
| search.enable | false (omitted) | true (Fuse) |
| page math | MathJax | MathJax (root-only value survives; directory-only is KaTeX) |
| baseURL | https://trandung6129.github.io/ | same |
| default language | vi | vi |

Normal versus directory-only additionally differs in root-provided content cascade (six subject sections become type `posts`, layout `single`), Goldmark extras and math passthrough, Hugo extended/minimum 0.147.7 requirement, pagination page size 12 versus default 10, MathJax selection and deprecated privacy.twitter setting. Root removal would silently change these. Effective English menu uses English labels and `/en/` links via `menus.en.toml`. All four languages inherit top-level `languageCode = vi`; languageCode per-language is absent in languages.toml: investigate resulting language metadata in P1-02, do not assume translations.

## Complete configuration file ledger

All 13 `config/_default/*.toml` files are active inputs:

| File | Purpose/evidence | Recommendation |
|---|---|---|
| hugo.toml (root) | Cascade, main sections, MathJax/passthrough, pagination, output format definitions plus duplicated theme defaults | KEEP now; REPLACE/consolidate in P1-05 only against effective-config and URL baseline |
| config/_default/hugo.toml | Brand/title, canonical baseURL, language, two themes, GitInfo and robots flags | KEEP; consolidate later with precedence preserved |
| languages.toml | vi/en/ja/zh-cn names/weights and localized descriptions/subtitles | KEEP; review real translation coverage P1-02/P1-06 |
| menus.toml | Vietnamese menu with collections and children | KEEP |
| menus.en.toml | English localized menu | KEEP |
| params.toml | Search/Fuse, theme mode auto, TOC, math enabled, code, share, related, custom bookmark injection; analytics/comments/reward disabled | KEEP; REPLACE theme-specific consumers only after parity |
| markup.toml | Goldmark unsafe/raw HTML, tables/footnotes, syntax line numbers/classes, TOC levels 2–6; `_merge = shallow` | KEEP; raw HTML and math require regression checks |
| outputs.toml | `_merge = shadow`; effective home HTML/RSS/archives/offline/search; page HTML/Markdown | KEEP; theme output defaults are active despite small local file |
| permalinks.toml | posts = posts/:slugorcontentbasename (effective in page and term maps) | KEEP unchanged; URL-sensitive |
| taxonomies.toml | categories, tags, collections; shallow merge | KEEP; collection navigation depends on it |
| related.toml | keywords/date/tags/fragmentrefs/collections/categories matching | KEEP; extra collection/category indices present beyond root config |
| frontmatter.toml | lastmod precedence including Git/file time | KEEP; existing `:defalut` typo survives effective config; record for later repair, no P1-01 fix |
| privacy.toml | x.enableDNT and privacy-enhanced YouTube | KEEP; root privacy.twitter.enableDNT generates nonfatal deprecation warning |
| sitemap.toml | weekly change frequency, sitemap.xml, priority 0.5 | KEEP |

## Deployment inventory

- `.github/workflows/deploy.yml`: push to main filtered to layouts/config/content/data/static/themes/hugo.toml/.nojekyll/assets/workflows/package manifests; `workflow_dispatch`; and `workflow_run` after “Update theme” (all completed outcomes; no success condition in YAML). No `pull_request` trigger. Full-history checkout and submodules, Hugo Extended **0.149.0** Linux amd64 DEB, Node **20**, `npm ci`, `hugo --gc --minify --logLevel info`, upload `public/`, then deploy with `actions/deploy-pages@v4` in github-pages environment. `contents:write`, `pages:write`, `id-token:write`; concurrency group pages with cancellation false. KEEP; do not claim branch PR triggers deployment/CI. Docs-only P1-01 does not match push path filter. Release download currently lacks explicit checksum in workflow; audit finding, not changed.
- `.github/workflows/update-theme.yml`: cron `0 0 * * *` (07:00 Asia/Saigon), manual dispatch; full-history recursive checkout; `git submodule update --remote --merge themes/FixIt` then `stefanzweifel/git-auto-commit-action@v6`. REMOVE candidate **only at P1-07 after parity** per scope; uncontrolled updates conflict with migration stability, but no workflow disabled here. `workflow_run` coupling means updater retirement and deploy trigger cleanup must be reviewed together.
- `.github/dependabot.yml`: monthly github-actions and gitsubmodule PRs; `Lruihao` assignee inherited from starter; KEEP dependency review, review stale assignee in later focused cleanup. No npm ecosystem entry. No other workflow files found.
- `.nojekyll`: Pages compatibility marker; KEEP.
- `package.json`: `build` matches deployment; `server` starts Hugo with drafts/bind all interfaces/browser opening; `server:production` adds production environment; `update:theme` mutates submodule and commits. KEEP build/server; REPLACE/remove updater only with theme migration; do not execute updater for audit.

## Theme reachability and retirement constraints

`git submodule status`:
- themes/FixIt @ f5fb989ad1a157dc0e7ac30d0a66b18194b1bea4
- themes/shortcode-docs-bookmark @ bad88c8d731c14a3d8d9bba9183c6b69205f7e9e

`hugo config mounts` confirms project mounts, FixIt archetypes/assets/i18n/layouts/static/package.json and bookmark assets/layouts are all loaded. FixIt provides baseof.html, page.html, posts/single.html, section.html, taxonomy.html, term.html, feeds, search, robots, sitemap and many partials/shortcodes. Owned custom collection partial still invokes FixIt function/params.html and plugin/icon.html. REPLACE FixIt **after** feature parity; KEEP pins and submodules during P1-01.

Bookmark theme has no `fixit-docs-bookmark` invocation in content/layouts/assets (`rg -n 'fixit-docs-bookmark' content layouts assets config` finds only config injection). It is still actively referenced by `params.customPartials.head = ['inject/fixit-docs-bookmark.html']`; FixIt custom.html calls head partial and the bookmark partial conditionally styles only `.HasShortcode "fixit-docs-bookmark"`. REMOVE candidate only with configuration reference removal and parity build in later P1-05/P1-07. Removing submodule alone breaks partial lookup; “unused shortcode” does not prove safe standalone deletion.

## Limits

This is configuration/deployment source and local effective-config evidence, not GitHub Actions execution, live Pages deployment validation, visual parity, translation validation, or an architecture decision. P1-02 must inspect resulting routes/HTML/runtime; P1-03 decides migration. All candidate decisions are recommendations; no deletion performed.
