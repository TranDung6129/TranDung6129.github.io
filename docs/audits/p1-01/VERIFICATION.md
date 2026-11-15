# P1-01 verification record

Commands ran from `/workspace/TranDung6129.github.io` on 2026-11-15 unless stated.
Use `export PATH="/workspace/.cloud-tools/bin:$PATH"` for the installed Hugo.
These are local audit results, not CI/deployment or browser test results.

## Source, dependencies and rollback

```sh
git status --short
git rev-parse origin/main
git submodule status
git branch backup/p1-01-before-audit bf20ec5b39498efac7ef7dee2debf543dd49081e
git push origin backup/p1-01-before-audit
hugo version
node --version
npm --version
```

PASS: initial worktree clean; base `bf20ec5b39498efac7ef7dee2debf543dd49081e`;
backup pushed; FixIt `f5fb989ad1a157dc0e7ac30d0a66b18194b1bea4`, bookmark
`bad88c8d731c14a3d8d9bba9183c6b69205f7e9e`; Hugo Extended 0.149.0,
Node 24.22.1/npm 11.9.0. Existing lockfile installation had passed during
environment onboarding with:

```sh
npm ci --cache /workspace/.cloud-tools/npm-cache --no-audit --no-fund
```

The checkout and installed dependencies were reused; no worktree created, no
theme updater executed. Backup is an unchanged production Git reference, not
a deployment or a separate source checkout.

## Exhaustive frozen-tree inventory

```sh
python3 docs/audits/p1-01/inventory.py bf20ec5b39498efac7ef7dee2debf543dd49081e docs/audits/p1-01
hugo list all --logLevel error > docs/audits/p1-01/content-pages.csv
```

PASS: 245 parent entries, 3,334 dependency files, two named content shortcode
calls. `inventory.py` reads Git objects at the supplied reference, including
the exact pinned submodule revisions, rather than enumerating generated caches.
The `hugo list all` table is all source content (including draft/future if any),
not a replacement for the actual production output route list.

An initial `hugo list all --format csv` probe failed because this Hugo version
has no `--format` flag for that command. It was corrected to the command above;
the committed CSV is the successful output, with log warnings suppressed.

## Precedence and mounts

```sh
hugo config --format json > /tmp/p1-effective-config.json
mkdir -p /tmp/p1-empty-config-dir
touch /tmp/p1-empty.toml
hugo config --format json --configDir /tmp/p1-empty-config-dir > /tmp/p1-root-only.json
hugo config --format json --config /tmp/p1-empty.toml > /tmp/p1-dir-only.json
hugo config --format json --lang en > /tmp/p1-effective-en.json
hugo config mounts > /tmp/p1-mounts.txt
```

PASS: effective/root-only/directory-only probes confirm the reported overrides
and unique root settings. External temporary config paths avoid changing project
configuration. `config-comparison.json` records selected keys from each output;
strip any leading warning before JSON parsing (`text[text.index('{'):]`).
`mounts.txt` preserves the actual mount command output. No secrets/environment
values were dumped. All saved settings here are public repository configuration.

## Production output preservation

```sh
npm run build -- --destination /tmp/p1-01-before-public > docs/audits/p1-01/build-before.log 2>&1
npm run build -- --destination /tmp/p1-01-after-public > docs/audits/p1-01/build-after.log 2>&1
python3 docs/audits/p1-01/verify.py /tmp/p1-01-before-public /tmp/p1-01-after-public docs/audits/p1-01
diff -u docs/audits/p1-01/routes-before.txt docs/audits/p1-01/routes-after.txt
git diff --exit-code bf20ec5b39498efac7ef7dee2debf543dd49081e -- . ':(exclude)docs/**'
git submodule foreach --quiet 'git status --short'
git diff --check
```

PASS: both fresh production builds exit 0. Each produces **645 files**, including
347 HTML files and 156 XML files. Hugo reports 180/188/10/10 pages for vi/en/ja/zh-cn.
**Zero removed routes, zero added routes, zero byte differences across all 645
files**. Routes include published assets/non-HTML outputs and HTML aliases;
`index.html` is normalized to the directory URL. Paths are filesystem-derived,
not crawled live URLs. The baseline source tree is identical to the production
ref outside docs, mechanically verified by the source diff command.

The verifier checks one title element and correct language on four home outputs,
records their canonical URLs, checks nonempty RSS/sitemap/robots/video/React bundle
outputs and four search indexes, and checks emitted consumer markers: two Nash
mount pages, ten collection chapter pages and four heatmaps. All pass.
It records the existing absent Nash poster separately. Emission does not prove
browser JavaScript execution, accessibility or absence of unrelated broken links.

Build warning: existing deprecated `privacy.twitter.enableDNT`; informational
Japanese translation fallback. No warning was hidden from the build logs.

## Additional consumer inspection

```sh
rg -n '\{\{[<%]' content
rg -n 'KalmanFilter|kalman' content assets layouts
rg -n '@import' themes/FixIt/assets/css/style.scss
rg -n 'custom.js|collection-list.html' themes/FixIt/layouts
rg -n 'fixit-docs-bookmark' content layouts assets config
sha256sum static/videos/game_theory_nash.mp4 media/videos/game_theory_nash/720p30/game_theory_nash.mp4
```

PASS: content consumers and theme import paths match the reports. Both video
copies hash to `10a2da744d254b63ed42134785c96b81f768382a25d40c84dff785197e23145b`.
No consumer found is a search observation, not permission to delete public assets.

## PR publication limitation

```sh
git push -u origin audit/p1-01-repository-inventory
gh pr list --head audit/p1-01-repository-inventory --json url,state
gh api repos/TranDung6129/TranDung6129.github.io --jq '{full_name,default_branch}'
curl -sS -o /tmp/p1-github-api-body -w 'GitHub REST HTTP %{http_code}\n' https://api.github.com/repos/TranDung6129/TranDung6129.github.io
```

Git push PASS. Both `gh` read-only API probes fail `Forbidden`; curl fails
`CONNECT tunnel failed, response 403` before an HTTP service response. Runtime
environment status reports enforced restricted networking with `api.github.com`
absent from the effective allowlist. This establishes an egress blocker, not
that the repository lacks Git access or a user token is required. Token values
were never inspected. PR creation cannot currently be verified/performed through
the available API route; no PR or CI success is claimed.

Required external action: allow `api.github.com` in environment Internet settings,
then retry the existing GitHub API binding and create the PR from this branch.
Only if that retry establishes a credential failure should authentication be
addressed. A prepared PR title/body is retained in `PR_BODY.md` for that retry.

## Unrun checks

No browser/screenshot, interaction, responsive/keyboard/accessibility/performance,
complete local/external links or live Pages deployment validation was performed.
Those are P1-02/P1-08 work and no application behavior was changed here. No payment,
membership, affiliate, homepage redesign or architecture implementation occurred.
