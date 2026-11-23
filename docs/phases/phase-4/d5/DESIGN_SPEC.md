# D5 — Visual identity & asset library: design specification

**Status:** VISUAL BOARD READY FOR OWNER REVIEW (2026-11-24). Nothing is live. Decisions: `DISCOVERY.md`. Prototype: `prototype/`, built with `scripts/preview-overlay.sh docs/phases/phase-4/d5/prototype <dir>`; the board is at `/d5-board/` in that build. Screenshots: `docs/audits/d5/screenshots/`. Checks: `docs/audits/d5/tools/d5-check.cjs` (12 states: no overflow, no errors, axe 0, every visible ornament has a size).

## 1. Design system
- **Unchanged:** the Phase 2 tokens (paper/ink/terracotta, midnight dark), Newsreader / Source Serif 4 / sans, the spacing and the rules. D5 adds no colour.
- **Ornaments:** use the accent token at fixed low opacities:
  - headpiece 0.7;
  - flower 0.85, the woodcut line is itself light;
  - landscape 0.35.

## 2. Botanical asset library (starter set, all verified)
| Role | Asset | Creator (Commons metadata) | Licence |
|---|---|---|---|
| Headpiece (mirrored pair) | Vetch sprig, hand-coloured woodcut | Pier Andrea Mattioli | Public domain |
| Below the contents | Cowslip, hand-coloured woodcut | Leonhart Fuchs | Public domain |
| Below the contents | Sun spurge (*Wolffsmilch*), hand-coloured woodcut | Leonhart Fuchs | Public domain |
| Footer strip | Rhine near Bonn, etching, 1643–1644 | Rijksmuseum (institution field) | CC0 |
| Footer strip | Coblenz and Harmenstein, etching | Wenceslaus Hollar (The Met) | CC0 |

- **Processing** (`docs/phases/phase-4/d5/process.py`): darkest ink → alpha mask; paper illumination flattened; printed captions cropped or blanked; plate borders cropped. Nothing is redrawn.
- **Delivery:** as a CSS mask filled with the accent colour, so it follows light/dark. WebP at 2× the display size: 20–100 KB each.
- **Manifest:** `data/d1_ornaments.yaml`. Every descriptive field is copied from the file's Commons metadata, together with the source URL, licence and check date.
- **Rotation:** deterministic per article (md5 of the content path), as in D1, now also for the headpiece.
- **Growth:** the target pool is about 12–16 flowers, 6–8 branches and 4–6 landscapes, added in small verified batches. The two hand-drawn D1 SVGs retire.

## 3. Logo (three options, shown in the board at lockup, 48, 32 and 16 px, light and dark)
- **A. Refined quill:** a cleaner single-weight feather. Closest to the current interim mark.
- **B. "Ed" seal:** a double ring, italic "Ed" and a small laurel. Reads well at 32 px or larger; at 16 px it becomes a ring. The final version would be outlined paths, not live text.
- **C. Engraved sprig:** traced from the same Mattioli woodcut as the headpiece, so the identity and the ornaments share one hand. Rich at 48 px; muddy at 16 px, so the favicon would need a simplified cut.

## 4. Hero illustrations
- **Producer:** the owner, with AI, following `HERO_GUIDE.md`. The guide covers fixed style, prompt template, sizes, delivery, labelling and checklist.
- **Optional:** only for articles that need one.
- **Implementation:** an essay names its image with `art: <key>` (already supported by `page-art.html`); provenance and an "Minh hoạ" caption are required.

## 5. Owner review
1. The ornament library and how it sits in the article (`ctx-*.png`).
2. Logo option A, B or C (or changes).
3. The hero guide.
