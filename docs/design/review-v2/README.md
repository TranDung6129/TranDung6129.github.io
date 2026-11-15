# Artwork v2 evidence and reproduction

Current `full/` contains ten full-page captures (360/390/768/1024/1440, light/dark); root contains 12 focused captures (hero, featured essays and volume, 390/1440, light/dark). All are local headless Chromium output, not published-site captures or final owner approval.

`full/results.json` is the existing P2 review harness, `art-results.json` records image/alt/fit/caption checks, `layout-results.json` compares unchanged non-image computed styles against the `efb2667` base, `axe-results.json` records automatic accessibility findings and incomplete cases. `performance.json` and `baseline-performance.json` record one unthrottled localhost run each; no field performance conclusion follows. `production-retention.json` records that 647 production files remain byte-identical, with review route and art absent.

Reproduce with the current isolated preview at port 1317, and install Playwright 1.65.1 plus axe-core 4.10.2 outside the checkout as in [the review report](../REVIEW.md). For the layout/baseline comparison, run a second preview of commit `efb2667` on 1318 in a separate temporary source copy. The tests use `/usr/bin/chromium`; no TLS bypass is used.

```sh
mkdir -p /tmp/p2-v2-qa/final2/full
export NODE_PATH=/tmp/p2-review-tools/node_modules
export P2_URL=http://127.0.0.1:1317/editorial-review/
P2_QA_OUT=/tmp/p2-v2-qa/final2/full node scripts/test-editorial-review.cjs
P2_QA_OUT=/tmp/p2-v2-qa/final2 node docs/design/review-v2/tools/art.cjs
P2_QA_OUT=/tmp/p2-v2-qa/final2 node scripts/test-editorial-axe.cjs
node docs/design/review-v2/tools/layout.cjs
node docs/design/review-v2/tools/perf.cjs
node docs/design/review-v2/tools/baseline-perf.cjs
python3 scripts/test-editorial-art.py
```

To create the separate baseline without a Git worktree, use an empty temporary directory, `git archive efb2667 | tar -x -C <dir>`, link the existing `node_modules` inside it if needed, then `EDITORIAL_PORT=1318 PATH=/workspace/.cloud-tools/bin:$PATH <dir>/scripts/preview-editorial.sh`. Do not run against a user-owned output directory. Absolute temporary paths and ports in these QA scripts are intentionally local test fixtures, not production configuration.
