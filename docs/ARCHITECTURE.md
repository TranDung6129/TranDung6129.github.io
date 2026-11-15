# Architecture & Cleanup Specification

## Existing baseline (observed; must verify)
Hugo + FixIt via submodule; GitHub Pages action deploying main; root hugo.toml and config/_default TOML; layouts/index.html with inline CSS; assets/css/_custom.scss and _override.scss; Markdown content with Vietnamese/English variants; React/Recharts declared in package.json and JSX simulations in assets/js/components. Canonical baseURL set to https://trandung6129.github.io/.

## Technical direction
- Remain **Hugo static + GitHub Pages** for editorial/public website.
- Build owned layouts in repository, ideally following the installed Hugo version conventions. No new theme dependency by default.
- Reusable Hugo partials, focused CSS modules and lightweight JS islands where useful. Prefer progressive enhancement.
- Do NOT move to Next.js/Astro, add Tailwind, or install a CMS without documenting concrete benefits and approval.
- **Approved Phase 1 database foundation:** PostgreSQL with local development setup, migrations, env template, seed/demo data, tests and backup/restore instructions. Supabase-managed PostgreSQL is the preferred future deployment option, pending maintainer provisioning, price/privacy review and secure credentials.
- No database reads during Hugo build, no client-side database secrets, and no runtime dependency for reading public articles.
- Future payments/membership access require a separate trusted server/provider; public HTML cannot protect premium content.

## Database boundary
- P1-09 starts only after P1-03 approves schema and migration conventions. Create local Docker/Postgres schema, versioned migrations and minimal example entities (e.g., author/member identity reference, support tier, product reference) without enabling real authentication, subscription billing or order processing.
- All private tables are protected on any future public data API; never expose owner, service-role or database credentials in Hugo output. No real customer data in Git.
- Production-managed database provisioning is a separate step requiring account owner action; completing a local database foundation does NOT claim hosted database deployment.
- Keep database-related changes in a separate PR; preserve Hugo's static deployment and editorial content as source of truth.

## Migration order
1. Capture baseline: build, rendered output snapshot, routes, images, RSS, search, math, syntax highlight, shortcode inventory, language behavior, website preview.
2. Identify FixIt-specific partials/shortcodes actually used by content; map to replacements.
3. Set up owned base templates and CSS tokens in parallel, avoiding main.
4. Move article/section rendering behind compatibility tests; retain legacy permalinks.
5. Remove duplicate inline CSS/override layers after replacements exist.
6. Remove npm dependencies only if audit shows no runtime/build need. JSX simulations require special consideration.
7. Retire theme submodule(s), old update job and obsolete config only after smoke tests pass.
8. Confirm production build and links; document rollback to preceding commit.

## Cleanup ledger template (P1-01 fills this)

The verified P1-01 inventory and populated KEEP/REPLACE/REMOVE ledger are in [the audit report](audits/P1-01.md), with file manifests and build evidence. Recommendations remain deferred until their stated migration gates pass.
| Candidate | Current purpose | Evidence | Decision KEEP/REPLACE/REMOVE | Migration & risk |
|---|---|---|---|---|
| themes/FixIt | Site templates and shortcodes | verify usage | REPLACE after parity | high |
| themes/shortcode-docs-bookmark | Bookmark shortcode | verify usage | TBD | medium |
| layouts/index.html | Home layout and inline CSS | file inspection | REWRITE later, preserve current home until Phase 3 | high |
| assets/css/_custom.scss | Visual customization | file inspection | REFACTOR | medium |
| assets/css/_override.scss | Theme overrides | file inspection | AUDIT | medium |
| config/_default/*.toml | Theme/site settings | inspect precedence | SIMPLIFY | high |
| package.json React/Recharts | Interactive simulations | inspect consumers | AUDIT before removal | high |
| content/collections/* | Editorial collections & template remnants | review references | CURATE; no blind deletion | medium |
| .github/workflows/update-theme.yml | Theme updater | inspect triggers | REMOVE after migration | medium |

## URL and content requirements
- Generate and commit before/after public path lists, compare them mechanically.
- Favor preserving existing paths over HTTP redirects; GitHub Pages cannot provide arbitrary server-side 301 rules.
- Track translation equivalents and hreflang; do not presume all language variants are real translations.
- Keep mathematical typesetting, fenced code, code-copy, RSS/search and accessible reading features.
- Keep existing journal content intact unless content edits are separately reviewed.

## Suggested structure (adapt to Hugo conventions of chosen version)
- assets/css: tokens, base, typography, components, page-specific styles
- assets/js: navigation, search, themes, isolated interactive widgets
- layouts: base, home, single, section, partials, shortcode replacements
- content: preserve old section slugs; add metadata only as needed
- data: future curated feature flags/catalogs, no secrets

## Security/performance
- No payment keys/secrets in Hugo repo.
- No server-side auth simulated by hiding markup client-side.
- Respect accessibility, third-party script budgets, consent and disclosures.
- Never auto-update themes/dependencies without version-aware testing.
