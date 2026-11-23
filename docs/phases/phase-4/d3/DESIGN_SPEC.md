# D3 — Citation & research protocol: design specification

**Status:** PROTOTYPE READY FOR OWNER REVIEW (2026-11-24). Nothing is live. Decisions: `DISCOVERY.md`. Prototype: `prototype/`, built with `scripts/preview-overlay.sh docs/phases/phase-4/d3/prototype <dir>`. Screenshots: `docs/audits/d3/screenshots/`. Checks: `docs/audits/d3/tools/d3-check.cjs` → `docs/audits/d3/d3-results.json` (18/18).

Samples: the Vietnamese Riemann essay (3 sources, one cited twice, one narrative citation, one note) and the English Nash essay (5 sources, one note).

## 1. Citations in the sentence
- **Form:** `(Hardy, 1914)`, `(Hardy, 1914; Conrey, 1989)`, narrative `de la Vallée Poussin (1896)`, locator `(Nash, 1950, p. 48)`.
- **Authors:** 1 → family name; 2 → "A & B"; 3+ → "A et al.". The same form is used in both languages.
- **Appearance:** a quiet underline in the text colour; accent on hover/focus.
- **Preview:** hover or keyboard focus shows the full reference in a small card below the citation. The card is visual only (`aria-hidden`) and follows the citation when the page scrolls.
- **Navigation:** activating the citation jumps to the entry (a calm highlight marks it); the entry's ↩ links return to each citation (↩¹ ↩² when cited twice).
- Screenshots: `*-preview.png`, `*-references.png`.

## 2. Sidenotes
- **Wide screens (≥ 1240 px):** the note sits in the right margin beside its line, 13rem wide, with a thin rule, small sans type and its number.
- **Narrow screens:** the superscript number is a button (`aria-expanded`) that opens the note in place under the line.
- **Without JavaScript:** the note shows inline.
- Screenshots: `*-1440-*-sidenote.png`, `*-390-*-note-closed.png`, `*-390-*-note-open.png`.

## 3. Reference list
- **Placement:** under the essay's own "References / Tài liệu tham khảo" heading (so it is in the contents), via `{{< references >}}`.
- **Content:** only the works cited in the essay. One list, A–Z by the first author's family name, then year.
- **Entry layout:** type label (Bài báo, Sách, Hội nghị, Trang web, Báo cáo, Luận văn, Chương sách), then "Authors (Year). Title. *Container*, volume(issue), pages. Publisher.", then a DOI link, otherwise the URL, otherwise the zbMATH record.
- **Titles:** keep their language (`lang`), e.g. French titles are marked French.

## 4. Source library (`data/bibliography.yaml`)
- **Key:** first author + year (`nash1950`).
- **Fields:** `type`, `authors` ("Family, Given" as in the database), `year`, `title`, `title_lang`, `container`, `volume`, `issue`, `pages`, `publisher`, `doi` / `url` / `zbmath`, `note {vi,en}`, `accessed` (web), and `verified` (database and date).
- **Rule:** an entry is added only after it is checked against Crossref, zbMATH or the publisher/author page. Never from memory.
- **Build check:** an unknown key fails the build.

## 5. Authoring
```
Tồn tại vô hạn zeros trên critical line {{< cite "hardy1914" >}}.
Classical result — {{< cite key="delavalleepoussin1896" form="t" >}}:
GUE.{{< note >}}GUE: *Gaussian Unitary Ensemble*…{{< /note >}}
## Tài liệu tham khảo
{{< references >}}
```
Numbering comes from positions in the Markdown file, so it is stable however often Hugo renders the page.

## 6. Owner review
1. Approve the citation, sidenote and reference-list designs from the screenshots.
2. **Implementation scope (proposed):**
   - Move the protocol into production.
   - Convert the two sample essays.
   - Make D1 Curated Reading and Discover read their bibliographic fields from the same library, so titles and authors cannot disagree. Today Curated Reading shows "Equilibrium Points in n-Person Games" and the library "Equilibrium points in n-person games".
   - Leave other essays unchanged until they are rewritten (D4: new essay set).
