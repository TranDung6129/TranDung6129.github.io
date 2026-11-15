# Third-party notices

The site's own code and content are covered by [LICENSE](LICENSE). The following third-party work is included in this repository.

## FixIt theme (MIT)

Since Phase 3 the page shell, styles and site scripts are the site's own (`layouts/_default/baseof.html`, `layouts/_partials/site/`, `layouts/_partials/editorial/`, `assets/css/editorial/`, `assets/js/editorial.js`). Still derived from [FixIt](https://github.com/hugo-fixit/FixIt) at commit `f5fb989ad1a157dc0e7ac30d0a66b18194b1bea4` (v0.4.0-alpha): the SEO head partials (`layouts/_partials/head/`), initialisation and helper partials (`layouts/_partials/init/`, `function/`, `plugin/`), Markdown render hooks (`layouts/_markup/`), feed, sitemap, search-index and Markdown-output templates, `assets/js/lib/mathjax.js`, `assets/images/fixit.svg` and the FixIt interface strings in `i18n/`. The MIT licence and copyright notices are kept in [LICENSE-FixIt.txt](LICENSE-FixIt.txt).

## Fonts (SIL Open Font License 1.1)

Self-hosted variable WOFF2 files, Vietnamese, Latin and Latin Extended subsets, from the `@fontsource-variable` packages; unmodified. Licences are next to the files.

| Family | Use | Path |
|---|---|---|
| Newsreader | Headings and display | `assets/editorial-fonts/newsreader/` |
| Source Serif 4 | Reading text | `assets/editorial-fonts/source-serif-4/` |

## Editorial artwork

Owner-supplied illustrations in `assets/editorial-source/` (originals) and `assets/editorial-art/` (WebP derivatives). Provenance and limits: [docs/design/ASSET-PROVENANCE.md](docs/design/ASSET-PROVENANCE.md).

## Published library files kept for URL stability

Unmodified files under `static/lib/`, shipped with FixIt and still published so existing URLs keep working; no current page loads them.

| Library | Version | Path | Upstream |
|---|---|---|---|
| Font Awesome Free (webfonts) | 6.7.1 | `static/lib/webfonts/` | https://github.com/FortAwesome/Font-Awesome |
| lightGallery | 2.7.2 | `static/lib/lightgallery/` | https://github.com/sachinchoolur/lightgallery |
| KaTeX (fonts and CSS) | 0.16.22 | `static/lib/katex/` | https://github.com/KaTeX/KaTeX |

## Loaded from CDNs at runtime (not in this repository)

MathJax 3 (`cdn.jsdelivr.net`, pages with mathematics), D3 3 (`d3js.org`) and Cal-Heatmap 3.3.10 (`cdn.jsdelivr.net`, journal page).

## npm dependencies

React, React DOM and Recharts (see `package.json`) build the Nash equilibrium simulation.
