# D2 — Content & media protocol: discovery

**Status:** IN PROGRESS (discovery; no code). Started 2026-11-24 after D5 was verified on production.

## Current state
| Area | Today |
|---|---|
| Text blocks | Paragraphs, lists, blockquotes, tables (D1 scroll on overflow), code with copy button (3 essays), D3 sidenotes and citations. No callout or figure component; no essay has an inline figure. |
| Mathematics | MathJax 3 from jsDelivr (`assets/js/lib/mathjax.js`); inline and display math; display math scrolls on overflow (D1). No numbered equations or `\eqref` in any essay. Screen readers read MathJax output symbol by symbol (D1 Orca pass). |
| Plots | None in essays. One React/Recharts lab (`assets/js/components/NashEquilibriumSim.jsx`). |
| Video | One Manim film (`manim/game_theory_nash.py`): black background, white text, neon blue/red/green. Not themed (D1 handoff: avoid unthemed black Manim). |
| Interactive | Labs and Films are separate pages linked by cards (P4-04); not embedded in essays. |

## Questions for the owner
Recorded below with the answers.
