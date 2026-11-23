# Architecture & Product Decision Log

## D-001 — Brand
**Accepted:** The Epistemic Diary. Not a personal-name primary publication. Author names belong in bylines/About. No final homepage concept accepted.

## D-002 — Technical foundation
**Accepted direction:** remain Hugo/GitHub Pages; migrate from FixIt to owned templates gradually, only after audited parity. No framework migration without fresh decision.

## D-003 — Visual identity
**Accepted direction:** warm paper/ink/terracotta with matching warm dark mode; editorial minimalism and premium-quality execution; comfortable long-form reading. Typography is a **candidate** set until tested.

## D-004 — Publishing structure
**Accepted direction:** magazine Journal + book-like Volumes/Chapters; Films, Labs, Discover and Resources. Current phase builds data model/components, not production feature pages.

## D-005 — Editorial voice
**Accepted direction:** rigorous, accessible, gently witty, question-driven; debate without falsehood or selective omission. Periodic high-effort YouTube videos and short-form distribution.

## D-006 — Revenue
**Accepted direction:** voluntary reader backing first; optional paid deep content later; contextual affiliate/product discovery; original digital goods; unobtrusive ads/AdSense when viable and compliant. No financial infrastructure in Phases 1–2.

## D-007 — Multi-agent execution
**Accepted:** TASK_BOARD.md is canonical. Claims, evidence, blockers and completion logs are mandatory; one branch/PR per narrow task; separate integration authority.

## D-008 — Visual asset provenance and original editorial style
**Accepted direction:** hybrid original/AI-assisted art, code-generated scientific figures and license-verified real photography. Never misrepresent synthetic imagery as documentary evidence. Maintain a provenance/license manifest. No final homepage wireframe approved. See [VISUAL_ASSET_GUIDELINES.md](VISUAL_ASSET_GUIDELINES.md).

## D-009 — Architecture proportional to product needs
**Superseded in part by D-010:** Hugo public reading remains static and independent of database availability. Git, small changes, server-side authorization for future protected features, backups/migrations, CI/CD and privacy/legal review remain mandatory. See [ENGINEERING_STANDARDS.md](ENGINEERING_STANDARDS.md).

## D-010 — PostgreSQL foundation from Phase 1
**Accepted:** Prepare an extensible PostgreSQL database early, with a local reproducible environment, reviewed schema/migrations, example data and verification/restore instructions (P1-09). Supabase PostgreSQL is a favored managed provider, not yet provisioned. Hugo/Pages articles remain static and must work without database connection. Real accounts, member entitlements, billing, private assets and customer personal data processing remain deferred to separately approved phases. See [DATABASE_FOUNDATION.md](DATABASE_FOUNDATION.md).

## D-011 — Editorial visual direction and prototype-first review
**Accepted direction:** Phase 2 visual standard is defined in [VISUAL_DIRECTION.md](VISUAL_DIRECTION.md): premium magazine × multi-chapter book, warm restraint, intentional editorial hierarchy, strong type, curated illustrations and pixel-level care. User liked the concept moodboard as a *reference*, but has not approved a final homepage layout. Require browser screenshots and maintainer review of a specimen before widespread implementation; automatic checks alone cannot validate aesthetic fit. The moodboard file is not yet checked into the repository; agents must not claim to have inspected it.

## Decision proposal template
### D-XXX — Name
- Status: PROPOSED / ACCEPTED / REJECTED / SUPERSEDED
- Context:
- Options:
- Choice and rationale:
- Consequences and migration:
- Approved by/date:

Agents may propose choices; changes to accepted product direction require maintainer review.

## D-012 — Owned Hugo templates and incremental compatibility
**Status:** ACCEPTED for P1-03 implementation direction, subject to normal PR review; this does not approve a homepage composition or deployment.

- **Context:** P1-01 establishes both configuration families and theme mounts are active. P1-02 captures 645 emitted files and existing defects; FixIt supplies layout, search, feeds, math, code, TOC and appearance. React/Recharts powers Nash. D-010 and D-011 remain in force.
- **Choice:** Keep Hugo Extended 0.149.0 and GitHub Pages. Introduce site-owned Hugo templates using the existing project-first lookup precedence while retaining pinned FixIt as fallback. `layouts/_default/baseof.html` owns the document shell and blocks; `layouts/_default/single.html` and `list.html` own generic article/section composition; reusable `layouts/_partials/` own head, header, navigation, footer, metadata and article utilities. Where Hugo lookup currently selects `layouts/posts/single.html` via content cascade, implement and test that explicit type override; generic templates alone do not override a more specific theme template. Keep existing home and its theme base until a deliberate compatibility test proves otherwise: a global base override can affect home, taxonomy and feeds, so introduce narrowly scoped templates and compare every affected kind before promotion. Exact file names are implementation targets, not existing files.
- **Boundaries:** Header/footer and reading primitives provide semantic HTML and progressive enhancement; CSS lives in focused owned assets, with semantic tokens introduced in P2, and JS islands only where behavior needs them. Keep `layouts/shortcodes/react.html`, existing Nash bundles and dependencies, heatmap, collection navigation, theme toggle, math, code-copy, RSS, search and language behavior until replacements pass equivalent tests. No page-wide redesign in P1-04; Phase 2 specimens require D-011 screenshot/maintainer gate. No homepage redesign without separate Phase 3 approval.
- **Configuration:** Retain root `hugo.toml` and `config/_default/` during P1-04. Treat effective configuration as contract: split config overrides conflicts, root supplies cascade/MathJax/passthrough/pagination; theme supplies defaults. In P1-05 migrate one key group at a time into documented site-owned `config/_default/` files, compare `hugo config` per language/environment and rendered output before removing duplicate keys. Preserve theme-specific compatibility settings until last consumer is retired; keep permalinks, output formats, language, markup and canonical settings stable. Do not silently normalize known canonical/title/menu defects: P1-06 must review fixes against route and SEO evidence.
- **Migration and gates:** P1-04 builds controlled shell and post/list adapters in small reversible changes, exercising home, post, section, taxonomy, aliases and all languages in production and development. Compare committed P1-02 route manifest and images, feed/search JSON, sitemap/robots, metadata, internal links and baseline defect counts. Browser-test Nash controls, math typesetting, code copy, TOC, theme persistence, keyboard and responsive states. P1-02's external MathJax/heatmap failures are unresolved: prove them in a trusted network-capable environment before claiming parity; do not bypass TLS. P1-05 consolidates only verified unused config/CSS. P1-06 handles metadata/translation defects with separately reviewed changes. P1-07 removes the bookmark injector and module together only after replacement and build tests; retire FixIt and its update workflow only after all feature/URL/asset gates pass. P1-08 verifies CI/Pages and rollback. Each change must retain an easy rollback to its preceding merged commit; no theme removal based on source-reference absence alone.
- **PostgreSQL boundary:** P1-09 follows this decision and D-010. Use PostgreSQL locally with provider-neutral, ordered versioned SQL migrations recorded in a migration ledger; each migration applies transactionally where supported, is applied exactly once and re-running the migration runner is a no-op. Schema rollback is a reviewed compensating migration or tested backup/restore, never editing an already-applied migration. Reserve stable editorial/author/product reference IDs with an explicit mapping to Hugo front matter only after review; do not move public text into the database. Minimal schema, names and tooling are selected in P1-09 with connection, repeated migration and restore tests; no real customer, payment or entitlement execution, hosted provisioning or secret in Git. Static build never requires the database.
- **Tradeoffs:** Keeping two configuration layers and a temporary theme dependency costs maintenance, but permits reversible per-kind migration. A big-bang theme deletion or framework migration would risk the baseline and is rejected. The output comparison must distinguish fixed existing defects from new regressions and document each intentional change; byte identity is not a permanent requirement for implementation changes.

## D-013 — Local PostgreSQL reference foundation
**Status:** ACCEPTED for P1-09 implementation, following D-010/D-012; hosted provisioning and production access remain separate decisions.

- **Choice:** PostgreSQL 16.10 in a local Compose service, bound to loopback with explicitly non-production demo credentials and a named persistent volume. A local-only runner uses gap-free numbered SQL migrations, SHA-256 ledger checks and a PostgreSQL advisory transaction lock; it validates history and applies pending files plus ledger entries in a transaction. Applied files are immutable. A reviewed compensating migration or tested backup/restore provides recovery.
- **Schema boundary:** Explicit UUIDs plus stable keys identify editorial objects, author references, catalog products and entitlement *types*. Join tables express article authorship and possible product capability types; there are no identities, granted entitlements, purchases or transactions. Synthetic seed data is opt-in. Hugo Markdown remains the content source and a future front-matter-to-key mapping requires separate review.
- **Security/operations:** Local container owner privileges and demo credentials are not a production model. Future managed deployment requires owner approval, scoped roles, reviewed RLS before any public data API, trusted server-side authorization, privacy/retention and backup/export/restore review. No database dependency is added to public Hugo generation.
- **Tradeoff:** Minimal provider-neutral SQL avoids a premature ORM or service. Locking, checksums and tests add operational work, but reject altered history and enable repeatable recovery. Local restore evidence does not prove hosted disaster recovery.

## D-013 — FixIt retired by owning the files in use
- **Status:** ACCEPTED on merge of the P1-07 PR (implements D-002 and D-012).
- **Context:** after P1-04 to P1-06 the site still took most templates, all base styles and scripts, interface strings and many config defaults from the pinned FixIt submodule, which a daily workflow also advanced without review.
- **Options:** (a) rewrite every template and stylesheet from scratch before removing the theme; (b) move exactly the files the build uses into the site, unchanged, and remove the theme; (c) keep the pinned submodule indefinitely.
- **Choice and rationale:** (b). It removes the external dependency and the unreviewed update path now, with byte-level proof that readers see no difference, and leaves the redesign to Phase 2 where each file can be replaced deliberately. (a) would mix a rewrite with a migration and could not be verified by output identity; (c) leaves the risk in place.
- **Consequences:** about 250 FixIt-derived files (MIT, attributed in `THIRD_PARTY_NOTICES.md`) are now ours to maintain; upstream fixes no longer arrive automatically. Features with no current use were not migrated. Phase 2 should replace these files progressively rather than restyle on top of them.

## D-014 — Phase 3: one site-owned editorial shell
- **Status:** ACCEPTED (owner-authorized autonomous Phase 3, 2026-11-15).
- **Context:** the approved Phase 2 design lived only in an isolated specimen; production still used the FixIt-derived shell, styles and scripts.
- **Choice:** replace the shell on every page at once with site-owned templates (`baseof`, masthead, footer), the Phase 2 component CSS (moved to `assets/css/editorial/`, shared by specimen and production) plus a production layer, and a small dependency-free `editorial.js`. Keep content rendering, SEO head partials, feeds, sitemaps, search index and every public content URL. New sections (Journal, Volumes, Films, Labs, Discover) are Hugo sections; curation is front matter and `data/`, never a database. Theme storage key and `data-theme="dark"` are kept so readers' saved choice survives. Dark paper is `#1A1816`.
- **Alternatives rejected:** restyling FixIt markup page by page (keeps two visual systems and the FixIt JS), or publishing the specimen page as the homepage (hard-coded demo content).
- **Consequences:** FixIt styles, scripts and libraries are no longer loaded and were removed with output-identity proof; FixIt asset URLs under `/css/`, `/js/`, `/lib/` (bundled) are gone (no content URL). Interface strings are vi/en; ja/zh-cn show English interface and link to English sections. Cookie banner, share buttons and Font Awesome icons are not part of the new design (no cookies or tracking are used).

## D-015 — Media live in their own sections; series are volumes
- **Status:** ACCEPTED by the owner, 2026-11-15.
- **Choice:** interactive experiments and films are standalone pages in `/labs/` and `/films/`, maintained independently of essays; essays link to them with `lab`/`film` shortcode cards. The `collections` taxonomy is retired: a curated sequence of essays is a Volume. Sample content inherited from the FixIt starter is removed even though its URLs then 404.
- **Consequences:** editing a simulation or video no longer touches essay Markdown (or both language copies); one source of truth per media item. Readers click through to interact. Old series URLs redirect to Volume I via aliases.

## D-016 — D1 academic article reading layer
- **Status:** ACCEPTED for implementation review, 2026-11-16; merge and deployment remain subject to PR review.
- **Choice:** retain the Phase 3 site shell and existing content URLs, then add a narrow D1 layer for article reading. The prose measure is centred against the viewport independently of a left TOC rail; the rail becomes normal flow at tablet widths and a disclosure on mobile. Headings remain source-generated and existing anchors are preserved. H3 discovery is a progressively enhanced, reader-controlled disclosure; progress is derived only from the prose region.
- **Identity and ornament policy:** use a reusable local vector brand mark and favicon. D1 ornamental vectors are original repository-authored decorative SVGs with empty alt text. Concept-prototype assets supplied in the handoff are not production assets unless their rights/status are confirmed separately. Dark mode retains artwork colour; no automatic inversion.
- **Discovery boundary:** related essays use actual Hugo content. Resource records are explicit data records and may expose only verifiable bibliographic links; no merchant, price, affiliate, purchase language, invented cover or product data is introduced.
- **Consequences:** D1 changes article presentation and adds a small no-dependency enhancement in `assets/js/editorial.js`; it does not change the homepage, database boundary, subscription/payment scope, content ownership, or public route set. D2–D8 remain non-implemented future constraints.
- **Refinement, 2026-11-22 (Claude Code):** the contents panel is sticky inside an aside that spans the article body; H3 lists fold to the section being read unless the reader toggled one. The article footer has one discovery block — Further Essays (a featured essay shown with artwork it already owns, else text-only; up to two supporting; never the older/newer essays) then Curated Reading (verified entries from the essay's references, same width and weight) — and no separate related list. Ornaments are inline `currentColor` SVGs chosen by an md5 of the content path per role (`data/d1_ornaments.yaml`, front-matter override), never behind text and never on the homepage; the current five are prototypes. Evidence: `docs/audits/d1/README.md`.
- **Owner decision, 2026-11-23:** the brand mark, favicon and navigation flourishes stay in D1 as interim identity; D5 (Visual Identity & Asset Library) replaces them with the approved final set. The reading-progress bar is visual only (`aria-hidden`): exposed as a progressbar it made Orca interrupt reading with "N percent" on every scroll, and the contents list already marks the current section with `aria-current`. Evidence: `docs/audits/d1/README.md` (final acceptance pass). The owner reviewed the right side on 2026-11-23 and judged the composition balanced: no right-side ornament is added.

## D-017 — Each essay in the language it is written in
- **Status:** ACCEPTED by the owner, 2026-11-23 ("tách biệt lại tiếng Anh và tiếng Việt"; the current essays are largely placeholders and may be removed).
- **Problem:** 17 content files carried the wrong language: ten `.en.md` essays and six English category pages contained Vietnamese text, and the Vietnamese `game_theory_nash.md` was English. Readers saw Vietnamese on the English site and the reverse, and screen readers read English with a Vietnamese voice (Orca, D1 final pass).
- **Choice:**
  - Wrong-language essay copies are removed, not machine-translated.
  - Their URLs redirect to the original (front-matter `aliases`).
  - The six English category pages are translated: they are structure, not essays.
  - Generated listings left empty in a language redirect to the same listing in the other language (`data/redirects.yaml`).
  - Templates that reference essays by path accept a list of alternatives, so curation can name the right essay per language.
- **Consequences:**
  - The English site has two essays: *Basic Mathematics for Economics (Part 1)* and *Game Theory & Nash Equilibrium*.
  - English Volume I lists those two and says Parts 2–5 are Vietnamese only.
  - Vietnamese Volume I's Nash chapter is now the Vietnamese Nash essay.
  - The Vietnamese film and lab link to the Vietnamese essay.
  - 37 term RSS feeds end.
  - A new essay set (D4) should be written per language; a translation is a separate file, added only when it exists.
- **Evidence:** `docs/audits/d-017/URL_MAP.md`; route diff against `main`.

## D-018 — D4 content architecture: topics, series, resource library
- **Status:** ACCEPTED by the owner. Discovery 2026-11-23/24; prototype screenshots approved 2026-11-24 ("Duyệt, triển khai"). Record: `docs/phases/phase-4/d4/DISCOVERY.md`, `DESIGN_SPEC.md`, `docs/audits/d4/`.
- **Choices:**
  - Vietnamese first, English selectively (builds on D-017).
  - **Four topics** (the `categories` taxonomy):
    - Kinh tế;
    - Khoa học cơ bản (`toan-hoc`, absorbs Vật lý);
    - Khoa học máy tính;
    - Triết học & Suy ngẫm (`triet-hoc`, absorbs Cá nhân).

    The slugs are unchanged. An essay's first category is its main topic.
  - Topic hubs live under the Journal; the five-item navigation is unchanged.
  - **Series** (`content/series/`, ordered `essays` paths) are lighter chains in the Journal.
  - **Volumes** are purposeful books. Volume I became the series "Toán cơ bản cho kinh tế"; Volumes shows "Đang biên soạn" until the first book exists. The homepage slot shows the current series meanwhile.
  - **Discover** is a resource library (`data/resources.yaml`, replaces `data/discover.yaml`), grouped by each resource's main topic, with only verified links and no affiliate links (D6 later).
  - The publishing heatmap stays at the end of the Journal.
  - The ja/zh interfaces stay.
- **URLs:**
  - Volume I and the older series URLs are aliases of the series.
  - `vat-ly` and `ca-nhan`, the English-only category names, and the no-longer-paginated `categories/*/page/1/` redirect through `data/redirects.yaml`.
  - 0 HTML routes lost against `main`; 7 term feeds end.
- **Rule:** metadata-only edits to an essay pin `lastmod` to its last real edit (no false "updated" dates).
- **Masthead subject strip (owner, 2026-11-24):** now the four topics as links (vi "Khoa học cơ bản · Kinh tế · Máy tính · Triết học", en "Sciences · Economics · Computing · Philosophy") in a labelled `nav` ("Duyệt theo chủ đề"). This also fixes Orca reading the tagline and the subjects as one word (D1 final pass). `ed_subjects` was replaced by `ed_subject_*`.

## D-019 — D3 citation and research protocol
- **Status:** ACCEPTED by the owner. Decisions 2026-11-24; sample essays approved 2026-11-24 ("Duyệt, triển khai"). Record: `docs/phases/phase-4/d3/`, evidence `docs/audits/d3/`.
- **Choices:**
  - Author–date citations via `{{< cite key >}}`: parenthetical, narrative `form="t"`, locator `p=`.
  - A hover/focus preview, and two-way links between each citation and its entry.
  - Explanatory notes via `{{< note >}}`: sidenotes in the right margin from 1240 px, a button-revealed note below that, inline without JS.
  - One A–Z reference list of the cited works only, via `{{< references >}}` under the essay's own heading, with type labels and DOI/URL/zbMATH links.
  - A single verified source library `data/bibliography.yaml`: never from memory; `verified` records the database and date; an unknown key fails the build. D1 Curated Reading and Discover take their bibliographic fields from it (`editorial/bib-resolve.html`).
- **Numbering:** from positions in the Markdown source (`editorial/shortcode-source.html`; byte-safe), because Hugo can render a page several times and `.Store` counters would drift.
- **Scope:** the Riemann (vi) and Nash (en) essays use the protocol. The other essays keep plain text until they are rewritten (D4 new essay set).
- **Content correction (owner):** in the Nash essay, two-player PPAD-completeness is now cited to Chen, Deng & Teng (2009) and three-player to Daskalakis, Goldberg & Papadimitriou (2009). Both claims were verified against the papers' Crossref abstracts.

## D-020 — D5 visual identity: engraved ornament library and the sprig mark
- **Status:** ACCEPTED by the owner. Decisions 2026-11-24; visual board approved 2026-11-24 (logo option **C**, library "Duyệt, triển khai"). Record: `docs/phases/phase-4/d5/`, evidence `docs/audits/d5/`.
- **Ornaments:**
  - Historical public-domain/CC0 engravings (Mattioli, Fuchs, Hollar, Rijksmuseum), each verified from its Wikimedia Commons metadata.
  - Separated into alpha masks by `docs/phases/phase-4/d5/process.py` (captions and plate borders removed, nothing redrawn).
  - Drawn as CSS masks in the accent colour, so they follow light/dark.
  - Manifest `data/d1_ornaments.yaml` (fields copied from metadata only).
  - Deterministic rotation per article now also covers the headpiece.
  - The five hand-drawn D1 SVG prototypes are retired; no template, content or data referenced them after the change.
- **Brand mark:**
  - The Mattioli vetch sprig, traced to `static/images/brand-sprig.svg` and shown as a CSS mask (cached, theme-aware) beside the wordmark.
  - A hand-simplified favicon (`static/images/favicon.svg`, with a dark-scheme colour) for 16–32 px.
  - The interim D1 quill is retired.
- **Hero illustrations:** owner-made AI art following `docs/phases/phase-4/d5/HERO_GUIDE.md`; optional per essay, labelled "Minh hoạ", with provenance recorded.
- **Not changed:** design tokens, fonts and spacing (Phase 2).
