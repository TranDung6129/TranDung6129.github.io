# D2 — Content & media protocol: design specification

**Status:** EXAMPLE SET READY FOR OWNER REVIEW (2026-11-24). Nothing is live. Decisions: `DISCOVERY.md`. Prototype: `prototype/`, built with `scripts/preview-overlay.sh docs/phases/phase-4/d2/prototype <dir>`; sample at `/kinh-te/d2-mau-matching-pennies/`. Screenshots: `docs/audits/d2/screenshots/`. Checks: `docs/audits/d2/tools/d2-check.cjs` → 11/11.

The example is one real problem, Matching Pennies, worked through with every block. Its mathematics is checked:
- the indifference condition gives q* = ½;
- the best responses cross only at (½, ½);
- the code prints 1/2.

## 1. Text blocks
- **Callouts:** `{{< callout definition|theorem|example|note|warning "Title" >}}`. Each is a semantic `<aside>` with a localised small-caps label and a left rule; no filled box behind long text.
  - Theorem text is italic.
  - Note and example are quieter (grey rule).
  - Warning has a heavier rule.
- **Numbered tables:** `{{< table caption="…" >}}` wraps a Markdown table and adds a real `<caption>` "Bảng n." that is announced with the table. The table is centred in the measure (owner, 2026-11-24); its wrapper scrolls on narrow screens.
- **Code:** the existing block (language label, copy button, line numbers). Unchanged.
- Paragraphs, quotes and lists are unchanged (Phase 2/D1). D3 notes and citations work inside every block.

## 2. Mathematics
- **Typesetting:** standard MathJax, never handwriting (owner).
- **Numbered equations:** `\begin{equation} … \label{eq:key} \end{equation}` is numbered (1), (2)… (AMS tags) at the right margin; `$$…$$` stays unnumbered.
- **References:** `{{< eqref "eq:key" >}}` writes "(1)" as an ordinary link to the equation.
  - Not MathJax `\eqref`: that link sits inside MathJax's `aria-hidden` output, and axe flags it as a focusable element hidden from screen readers.
  - The number is computed from the source, so it shows without JavaScript.
- **Inline maths and overflow:** as in D1 (display maths scrolls inside its own box on small screens).

## 3. Scientific plots (one style for web, Python and Manim)
- **Palette:** ink, terracotta, slate, olive, ochre. Each series colour is ≥ 4.3:1 against both page backgrounds; the grid is deliberately faint.
- **Type:** the site's serif for labels and Patrick Hand (OFL, Vietnamese) for handwritten annotations only.
- **matplotlib (`plotstyle/`):**
  - `epistemic.mplstyle` and `epistemic_plot.py`: `use()`, `note()` (handwritten annotation), `save_web()`, `save_print()`.
  - `save_web` writes an SVG whose colours become CSS variables, so one file follows light/dark. Text stays text (readable, translatable); the fonts map to the site's.
  - Rule for web figures: no `$…$` mathtext in labels (TeX fonts are missing in the browser, and mathtext drops Vietnamese letters). Use Unicode (p, BR₁, ½) and put formulas in the caption.
- **On the page:** `{{< plot src="name.svg" caption="…" alt="…" >}}` inlines the SVG with `role="img"` and a text alternative, numbered "Hình n.".
- **Example:** `plotstyle/matching_pennies_br.py`.

## 4. Video (Manim)
- **Theme** `manim/epistemic_theme.py`: ivory background `#F7F5F0`, ink text, terracotta/slate accents, Source Serif 4 for text, LaTeX (`MathTex`) for maths in ink, and a `hand()` helper for handwritten annotations.
- **Fonts:** registered from `manim/fonts/` (OFL), so renders do not depend on the machine.
- **Storyboard:** `manim/d2_storyboard.py` gives three still frames (title, payoff matrix with annotation, best responses with equilibrium); see `storyboard-*.png`.
- **Not decided yet:** pacing and transitions for full films are set when the next film is made. There is no narrator character (owner).

## 5. Interactive content
Unchanged by decision P4-04: labs and films are their own pages, linked from essays with cards, never embedded in essay text.

## 6. Owner review
1. The example page (`d2-1440-light.png`, `d2-1440-dark.png`, `d2-390-light.png`), the plot in both themes, and the three storyboard frames.
2. **After approval, the implementation will:**
   - move the shortcodes, CSS, MathJax and passthrough changes into production;
   - put `plotstyle/` and the Manim theme under `scripts/` and `manim/`;
   - retheme the existing Nash film;
   - keep the sample page out of the public site.
