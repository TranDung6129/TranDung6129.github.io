# D8 — Quality, integration and final polish: audit (2026-11-24)

The site after D1–D7, checked as a whole, on a clean build of `main` plus this branch. Every number below comes from the files in `evidence/`; the tools live in `docs/audits/*/tools/`.

## Results
| Area | Check | Result |
|---|---|---|
| Accessibility, layout, links | `d8/tools/d8-sweep.cjs`: every sitemap URL (93 pages); status, page errors, overflow at 390 and 1440, axe WCAG 2.1 A/AA, images without `alt`, internal links and anchors | **93/93 clean** |
| SEO | `p1-06/tools/seo-check.py`: one canonical per page, targets exist, hreflang, titles, descriptions, sitemaps, robots | **pass** (105 pages). Fixed on the way: the D-017/D-018 redirect pages now use the same markup as Hugo's own alias pages, so the checker recognises them. |
| URLs | `d4/tools/check-redirects.py` against `main` | 161 redirects, 0 broken or chained; 0 HTML routes lost |
| External links | 15 unique. Publishers (PNAS, SIAM, ACM) and zbMATH return 403 to scripts, so every DOI was checked with the doi.org handle API and the zbMATH API | **all 7 DOIs and 2 zbMATH records resolve** |
| Browsers | Chromium (all suites); Firefox: `d8/tools/d8-browsers.cjs`, 7 key pages × 390/1440 | Firefox **14/14 clean** (masks, fonts, maths). **WebKit not tested**: it needs system libraries installed with sudo on this machine. |
| Feature suites | `test-d1` 31/31; `d3-check` 18/18; `d4-check` 48 states; `p3-smoke` 32/32; fixtures `d2-check` 10/10 and `d6-check` 20/20; `d7-check` 9/9 (Studio, read-only) | **all pass** |
| Error pages | `/404.html`, `/en/404.html` | 200, localised, site shell |
| Performance | `p3-07/tools/perf.cjs`, local, one run; `c2898aa` (before D1) vs now | Home unchanged (590→595 KB, 743→749 KB). Articles +11–120 KB (fonts for handwriting are only on pages with plots; ornaments; D3/D6 markup). CLS 0 everywhere. Fixed on the way: ornament WebPs re-encoded with lossy alpha, **247 KB → 94 KB**, no visible change (`screenshots/landscape-compression-before-after.png`). |
| Security | Static site; no secrets in the repository; Studio local-only (127.0.0.1, Host/Origin checks, writes limited to `content/`, `data/`); analytics and support off until configured; affiliate links `rel=sponsored` | no finding |
| Backup and recovery | Git history and GitHub are the backup of all content. Every change since D1 is a reviewed PR with a merge commit, so any deploy can be reverted with `git revert -m 1 <merge>`. The PostgreSQL foundation (P1-09) keeps its own tested backup/restore plan. | documented |
| Production | Each phase was verified on https://trandung6129.github.io after its deploy (AGENT_LOG) | — |

## Known gaps
- WebKit/Safari, NVDA, JAWS and VoiceOver are untested. Orca was run in D1 only.
- Performance numbers are local and unthrottled, not field Core Web Vitals.
- 37 + 7 term RSS feeds ended with D-017/D-018. GitHub Pages cannot redirect feeds.
- The owner's accounts (affiliate programmes, support page, GoatCounter) are not set up; those channels are off (`docs/phases/phase-4/d6/ENABLE.md`).
- The essays are still the placeholder set. Only Riemann (vi) and Nash (en) use the D3 citation protocol; no essay uses the D2 blocks yet.
