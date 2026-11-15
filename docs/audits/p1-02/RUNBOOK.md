# Reproduce P1-02 capture

Run from the repository root, using the pinned Hugo installed during onboarding.
All analysis/tools/browser caches stay outside application dependency manifests.

```sh
export PATH="/workspace/.cloud-tools/bin:$PATH"
hugo version
node --version
npm --version
npm run build -- --destination /tmp/p1-02-public
python3 docs/audits/p1-01/verify.py /tmp/p1-01-after-public /tmp/p1-02-public /tmp/p1-02-retention
python3 docs/audits/p1-02/static/test_analyzer.py
python3 docs/audits/p1-02/static/analyze.py /tmp/p1-02-public /tmp/p1-02-static docs/audits/p1-01/routes-after.txt docs/audits/p1-01/content-pages.csv
```

The first output comparison needs the retained prior P1-01 build; if unavailable,
the static analyzer still compares the frozen route manifest, but do not claim
byte equality against an absent build. During capture the new output directory
was `/tmp/p1-01-accepted`; logs/results use that actual path. Both comparison and
fixture/analyzer completed with exit 0. The fixture deliberately tests that a
disappeared route makes the analyzer exit nonzero. Analyzer success means capture
invariants passed, not that missing links or metadata defects are absent.

Start the server in a separate managed process:

```sh
python3 -m http.server 1314 --bind 127.0.0.1 --directory /tmp/p1-02-public
```

Browser runner (system Chromium required):

```sh
npm install --prefix /tmp/p1-02-tools --cache /workspace/.cloud-tools/npm-cache --no-save --no-audit --no-fund playwright@1.65.1
NODE_PATH=/tmp/p1-02-tools/node_modules BASELINE_OUTPUT=/tmp/p1-02-browser node docs/audits/p1-02/browser/baseline.cjs
NODE_PATH=/tmp/p1-02-tools/node_modules node docs/audits/p1-02/browser/keyboard.cjs
```

Capture used Playwright 1.65.1 installed at `/tmp/p1-02-browser/node_modules`,
system `/usr/bin/chromium` and Python's HTTP server against the unmodified
production build. Exact browser version and checks are in results.json.
See browser/REPORT.md for supplemental interaction/keyboard commands and outcomes.
No trust verification was disabled; missing external resources are reported.
Do not add these tools to the site's package.json/lockfile merely to repeat audit.

Finish with:

```sh
git diff --exit-code aae95e9d6f397fd2262c8e3a3298a401253d8122 -- . ':(exclude)docs/**'
git diff --check
```

PASS during capture: application/config/content/dependencies unchanged. No database
is started or needed. Keep changes for P1-09 separate after P1-03.
