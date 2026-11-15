# Third-party notices

The site's own code and content are covered by [LICENSE](LICENSE). The following third-party work is included in this repository.

## FixIt theme (MIT)

Templates under `layouts/`, styles under `assets/css/` (except `_custom.scss` and `home.scss`), scripts `assets/js/theme.js`, `assets/js/util.js`, `assets/js/head/`, `assets/js/lib/mathjax.js`, images under `assets/images/` and translation strings under `i18n/` are derived from [FixIt](https://github.com/hugo-fixit/FixIt) at commit `f5fb989ad1a157dc0e7ac30d0a66b18194b1bea4` (v0.4.0-alpha). FixIt was a Git submodule until P1-07; the files the site uses are now maintained here. The MIT license and copyright notices are kept in [LICENSE-FixIt.txt](LICENSE-FixIt.txt).

## Bundled libraries

Unmodified copies shipped with FixIt, under `assets/lib/` and `static/lib/`. Each keeps its upstream license.

| Library | Version | Path | Upstream |
|---|---|---|---|
| animate.css | 4.1.1 | `assets/lib/animate/` | https://github.com/daneden/animate.css |
| autocomplete.js | 0.38.1 | `assets/lib/autocomplete/` | https://github.com/algolia/autocomplete |
| cookieconsent | 3.1.1 | `assets/lib/cookieconsent/` | https://github.com/osano/cookieconsent |
| Font Awesome Free | 6.7.1 | `assets/lib/fontawesome-free/`, `static/lib/webfonts/` | https://github.com/FortAwesome/Font-Awesome |
| Fuse.js | 6.6.2 | `assets/lib/fuse/` | https://github.com/krisk/fuse |
| lightGallery | 2.7.2 | `assets/lib/lightgallery/`, `static/lib/lightgallery/` | https://github.com/sachinchoolur/lightgallery |
| normalize.css | 8.0.1 | `assets/lib/normalize/` | https://github.com/necolas/normalize.css |
| sharer.js | 0.5.1 | `assets/lib/sharer/` | https://github.com/ellisonleao/sharer.js |
| KaTeX (fonts and CSS only, published but not used by current pages) | 0.16.22 | `static/lib/katex/` | https://github.com/KaTeX/KaTeX |

## Loaded from CDNs at runtime (not in this repository)

MathJax 3 (`cdn.jsdelivr.net`), D3 3 (`d3js.org`), Cal-Heatmap 3.3.10 (`cdn.jsdelivr.net`), Google Fonts (Inter, Lora, Caveat, JetBrains Mono).

## npm dependencies

React, React DOM and Recharts (see `package.json`) build the Nash equilibrium simulation.
