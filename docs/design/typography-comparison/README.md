# Typeface comparison — review only

This standalone artifact compares Newsreader, Source Serif 4 and Lora at identical sizes with English, Vietnamese diacritics, numerals, italics and mathematical text/MathML. It is independent of the Hugo production font stack and makes no final typography decision. The three columns stack on small screens; use the button to compare light and dark.

Run from the repository root after placing this directory at `docs/design/typography-comparison`:

```sh
python3 -m http.server 1338 --bind 127.0.0.1 --directory docs/design/typography-comparison
```

Open `http://127.0.0.1:1338/` on that machine. Four full-page screenshots (390/1440 × light/dark) are in `screenshots/`. These are not owner sign-off. The marked sample text is illustrative. Native MathML and glyphs outside the selected font subsets can use browser/system fallback; the specimen does not prove full math-glyph coverage.

## Font provenance

Downloaded without bypassing verification from the npm registry using Fontsource variable packages:

| Family | Package | Version | License |
|---|---|---|---|
| Newsreader | `@fontsource-variable/newsreader` | 5.3.0 | SIL Open Font License 1.1 |
| Source Serif 4 | `@fontsource-variable/source-serif-4` | 5.3.1 | SIL Open Font License 1.1 |
| Lora | `@fontsource-variable/lora` | 5.3.0 | SIL Open Font License 1.1 |

Exact tarball URLs and npm integrity values are retained in `font-sources.json`; complete unmodified individual licenses/copyright notices are in `fonts/<family>/LICENSE.txt`. Normal and italic weight-variable WOFF2 for Vietnamese, Latin and Latin Extended are included; the package CSS was filtered to these available subsets. Font files are unchanged. No third-party requests occur when viewing this artifact. Reassess font licensing, performance, glyph coverage and loading strategy before any production adoption.

## Validation

Headless Chromium 156.0.8078.79 with Playwright 1.65.1: 390 and 1440 CSS px in light/dark (4 cases) each HTTP 200, three distinct loaded custom families, Vietnamese text/italic faces, nonzero MathML layout, no horizontal document overflow or failed requests. Chrome DevTools font inspection confirms Vietnamese glyphs resolve to each named custom font and italic headings resolve to each actual italic face; output is in `results.json`. Actual math symbols can still fall back. Axe-core 4.10.2 reported zero automatically identified violations in all four cases, with 7 mobile / 8 desktop contrast cases marked incomplete for manual review; see `axe-results.json`. This is not a complete accessibility audit.

Reproduce from a separate shell with the local server running. Install test dependencies outside the checkout, for example `npm install --prefix /tmp/p2-type-tools --no-save playwright@1.65.1 @axe-core/playwright@4.10.2`, then:

```sh
export NODE_PATH=/tmp/p2-type-tools/node_modules
export TYPE_COMPARE_URL=http://127.0.0.1:1338/
export TYPE_COMPARE_OUTPUT=/tmp/p2-type-results
node docs/design/typography-comparison/test.cjs
node docs/design/typography-comparison/axe.cjs
```

The tests use `/usr/bin/chromium` and write output/screenshots under the temporary output directory; they do not edit content or production fonts.
