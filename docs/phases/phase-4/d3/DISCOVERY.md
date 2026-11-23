# D3 — Citation & research protocol: discovery

**Status:** IN PROGRESS (discovery; no code). Started 2026-11-24 after D4 was verified on production.

## Current state (2026-11-24)
| Item | Today |
|---|---|
| In-text citations | Typed by hand, author–date: "(Nash, 1950)", "(Aumann, 1974)", "(Hardy, 1914)", "(Conrey, 1989)". Plain text, not linked. |
| Reference lists | One essay (English Nash) has a hand-numbered "References" list. The Riemann essay cites without a list. |
| Footnotes | None used. Goldmark footnotes are enabled (`config/_default/markup.toml`). |
| Source data | Three overlapping places: the essays' own lists, `data/resources.yaml` (Discover, D4) and `data/d1_resources.yaml` (D1 Curated Reading). |
| Known gaps | "(Aumann, 1974)" is cited in the Nash essay but missing from its references. Riemann citations have no list. |

## Questions for the owner
Recorded below with the answers.

## Owner decisions (2026-11-24)
1. **Author–date citations** in the sentence: "(Nash, 1950)", narrative "Nash (1950)".
2. **Explanatory notes as sidenotes** in the right margin on wide screens; on narrow screens the number opens the note in place. The margin is used only where an essay has notes.
3. **One A–Z reference list** by first author, each entry labelled with its type.
4. **A shared source library**: each source is entered once (verified), and essays cite it by key with `{{< cite key >}}`. The site builds citations, the reference list and the links. BibTeX/Zotero import is a later convenience.

## Findings while building the sample
- *Pre-existing content issue (owner):* the English Nash essay attributes "2-player general-sum: PPAD-complete" to Daskalakis, Goldberg & Papadimitriou (2009). That paper proves the result for three or more players; the two-player case is due to Chen & Deng. The sample keeps the essay's wording; correcting it is an editorial change.
- *Database records differ from common citations:* zbMATH records de la Vallée Poussin (1896) in *Annales de la Société Scientifique de Bruxelles* **21 B**; many secondary sources cite volume 20. The library follows the database and says so in `verified`.
- *A work in the old Nash list was never cited in the text* (Shoham & Leyton-Brown, 2008). Under the protocol the reference list holds cited works only; further reading belongs in D1 Curated Reading.
