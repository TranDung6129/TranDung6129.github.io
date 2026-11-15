# The Epistemic Diary

An independent publication on mathematics, economics, computer science, philosophy and how we know what we know. Static site built with [Hugo](https://gohugo.io/) and deployed to GitHub Pages: <https://trandung6129.github.io/>.

## Requirements

- Hugo **Extended 0.149.0** (the version CI installs; minimum 0.147.7)
- Node.js 20+ and npm (React and Recharts build the Nash equilibrium simulation)

No theme, Git submodule or Hugo module is needed: templates, styles, scripts and translation strings live in this repository.

## Develop

```sh
npm ci
npm run server      # http://localhost:1313, drafts included
npm run build       # production build into public/
```

## Layout

| Path | Purpose |
|---|---|
| `config/_default/` | All site configuration (one file per Hugo root key) |
| `content/` | Markdown articles; `name.md` is Vietnamese, `name.en.md` English |
| `layouts/` | Templates: base shell, home, article, lists, partials, render hooks, shortcodes |
| `assets/css/` | SCSS: `style.scss` entry point, `_custom.scss` site palette and typography, `home.scss` home page |
| `assets/js/` | `theme.js` (navigation, search, theme switch, code blocks), React components |
| `assets/lib/`, `static/lib/` | Bundled third-party libraries |
| `i18n/` | Interface strings |
| `static/` | Files published as-is |
| `db/`, `compose.yaml` | Local PostgreSQL foundation; not used by the site build (see `db/README.md`) |
| `docs/` | Plans, decisions, task board, codebase map and audit evidence |

Start with [`AGENTS.md`](AGENTS.md) and [`docs/CODEBASE_MAP.md`](docs/CODEBASE_MAP.md) before changing anything.

## Deployment

`.github/workflows/deploy.yml` builds and publishes on pushes to `main` that touch site sources, or on manual dispatch.

## Licenses

Site code: [MIT](LICENSE). Templates and styles derived from the FixIt theme and the bundled libraries are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
