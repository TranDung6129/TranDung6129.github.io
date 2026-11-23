# D5 — Visual identity & asset library: discovery

**Status:** IN PROGRESS (discovery; no code). Started 2026-11-24 after D3 was verified on production.

## Current state
| Item | Today | Source / rights |
|---|---|---|
| Palette, type, spacing | Phase 2 tokens (`assets/css/editorial/tokens.css`): warm paper/ink/terracotta, midnight dark mode; Newsreader + Source Serif 4 + sans | Repository |
| Brand mark, favicon | Quill/leaf vector (`layouts/_partials/site/brand.html`, `static/images/favicon.svg`): interim, D1 | Repository-authored |
| Editorial illustrations | Hero, two featured-essay images, Volume I cover (`data/art.yaml`) | Owner-supplied, AI-generated (`docs/design/ASSET-PROVENANCE.md`); generator terms not independently verified |
| Ornaments | 5 line-art SVGs: branch, 2 flowers, 2 landscapes (`static/ornaments/d1/`, `data/d1_ornaments.yaml`), status *prototype* | Repository-authored |
| Owner concept pack | `ORNAMENT_PROTOTYPES_V0_OPTIONAL.zip` (27 SVGs: header branches, footer landscapes, paper backgrounds…), untracked | Status unconfirmed; not used |
| Rules | `docs/VISUAL_ASSET_GUIDELINES.md`: manifest per asset, no asset without established source/licence, synthetic imagery labelled where confusion is plausible | — |

## Questions for the owner
Recorded below with the answers.

## Owner decisions (2026-11-24)
1. **Ornaments:** historical public-domain engravings, verified one by one and converted to theme-coloured line masks.
2. **Hero illustrations:** created by the owner with AI, following a fixed style guide; optional per article.
3. **Logo:** three options to choose from.

## Notes from sourcing
- Wikimedia Commons rate-limited downloads (HTTP 429) and asked for standard thumbnail sizes. Assets were taken at standard widths (960–1920 px), with pauses between requests.
- Hand-coloured woodcuts (Fuchs, Mattioli) give the cleanest lines once the colour wash is dropped. The Loudon leaf studies (1875) were too heavy and large for small ornaments and were not used.
- Some descriptive data is thin on Commons (e.g. no date on the Fuchs/Mattioli sheets; the Rijksmuseum print lists the museum as "Artist"). The manifest records exactly what the metadata says.
