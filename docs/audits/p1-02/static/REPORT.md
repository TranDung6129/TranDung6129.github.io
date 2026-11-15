# P1-02 offline output baseline

Contributor: Codex baseline_static. Read-only analyzer, no source/config/content changes.

Command from repository root:

```sh
python3 /tmp/p1-02-static/analyze.py /tmp/p1-01-accepted /tmp/p1-02-static docs/audits/p1-01/routes-after.txt docs/audits/p1-01/content-pages.csv
```

PASS exit 0 for baseline capture/route invariants/structured output syntax. Existing defects below were captured, not asserted as successes or fixed.

- 645 emitted files; zero routes added/removed compared to frozen P1-01 list.
- 347 HTML: 201 non-alias pages plus 146 refresh aliases. Non-alias languages vi91/en96/ja7/zh-cn7. Source content CSV: vi24/en24 Markdown files. Four language shells do not imply full translated content.
- All 201 non-alias HTML have a title, canonical, description; no noindex. Four duplicate canonical groups: each language home canonical is shared by its home, archives and offline pages (12 affected pages total). This existing metadata defect is captured, not fixed. 24 duplicate-title groups mostly across languages are recorded in summary; title presence is not a unique-title/translation quality pass.
- 156 XML files parse: 151 RSS documents (236 item occurrences across feeds) and 5 sitemap documents. RSS counts include empty taxonomy feeds. Four JSON search indexes parse: vi20/en20 entries, ja0/zh-cn0. Entries contain title/uri.
- Emitted markers: MathJax script 199, TOC 24, highlighted code blocks6/code elements12, React mounts2. Script inclusion is not math or React execution proof; browser contributor owns that.
- 19 published image files; image size/hash inventory in image-files.json. PNG/GIF dimensions parsed only; other formats intentionally not decoded. HTML images all have nonempty alt attributes; no semantic alt-text approval is implied.
- robots.txt exists, 1,484 bytes. XML/JSON syntax validation is not policy/content semantics approval.

## Link findings

11,202 internal HTML references checked (`href`, `src`, `poster`, `data-src`), including same-host absolute URLs and percent-decoded paths; HTML target fragments checked against IDs/named anchors. **745 missing target occurrences; 210 unique missing normalized targets; zero missing fragments**. Relative branding path resolves to many route-specific missing targets. See machine reports for full provenance.

| Literal reference | Missing occurrences | Interpretation |
|---|---:|---|
| `static/images/logoted.png` | 201 | Relative branding/icon metadata path includes source `static/` prefix; public file is exposed at `/images/logoted.png`. Recorded defect; no fix here. |
| `/apple-touch-icon.png` | 201 | Default touch icon referenced but missing |
| `/safari-pinned-tab.svg` | 201 | Default pinned-tab icon referenced but missing |
| `/images/game_theory_nash_poster.png` | 2 | Existing missing poster in Nash vi/en |
| Five ja menu destinations | 70 | About plus four collection subpages missing; 14 menu references per destination |
| Five zh-cn menu destinations | 70 | Same missing menu destination set |

Eight distinct external URLs are enumerated but **not requested**, 1,113 non-HTTP references skipped (javascript/mailto/etc.). This scan does not check CSS url(), dynamically produced JS requests, external targets, or fragments within non-HTML resources. Browser runtime/CDN evidence is separate. Zero bad fragments does not establish all real-world URLs work.

## Artifacts and knowledge capture

`analyze.py`: read-only stdlib generator; `summary.json`: aggregate results and categorized defects; `html-metadata.json`: title/canonical/lang/headings/images/hreflang/features per HTML; `missing-targets.json` and `missing-fragments.json`: full reference provenance; `xml-validation.json`, `search-indexes.json`, `image-files.json`, `routes.txt`, `external-urls-unchecked.txt`: corresponding captures.

`read-files.json` records exact Git blobs of all tracked files inspected by this contributor. Docs purposes/dependencies: AGENTS defines scope/claim/evidence and registry protocol; CODEBASE_MAP routes feature owners and cautions; INSPECTED_FILES contains audit-backed partial summaries plus revision protocol; QUALITY_GATES defines baseline/SEO/accessibility requirements. Existing unchanged summaries were reused; no application source was reread. P1-01 route list is frozen output-path proof; content CSV contains source path/date/slug/permalink rows, used only for source-language counts. Both are PARTIAL semantic coverage. Group-level generated output inspection is exhaustive for the listed parser fields only: generated HTML/assets/XML/JSON are not source; depend on Hugo/FixIt plus current config/content. No browser, live network, full SEO schema or content translation assessment by this contributor.
