# Visual Direction — The Epistemic Diary

**Approved as design direction; not a signed-off homepage composition.** Read with [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [VISUAL_ASSET_GUIDELINES.md](VISUAL_ASSET_GUIDELINES.md), and [EDITORIAL_VOICE.md](EDITORIAL_VOICE.md).

## North star

Build a **beautiful independent science/technology publication that feels like a premium magazine and a book of many chapters** — not a generic Hugo template, standard news portal, sales landing page, or developer portfolio.

The experience should be **editorial, minimalist, warm, intelligent, curious, and reading-first**. Product polish should resemble the *care and consistency* found in great consumer products, not copy Apple's interface or trademark style. The voice inside the restrained design can be playful and witty.

## Reference concept board

The project owner liked the generated **The Epistemic Diary UI moodboard** shown in the design discussion: it arranged a homepage/featured story, long-form reading, Volume/Chapter, Films, Discover, a voluntary Support card, mobile screens and a warm dark mode alongside a palette and typography reference.

The approved board is **a visual direction**, not a pixel-perfect blueprint. The final homepage design remains unapproved and belongs to Phase 3. **The image file is not currently checked into this repository**, so agents cannot claim to have viewed it. When the owner supplies the board as a repo asset, add its exact tracked path below and link it from the PR:

- Approved reference image path: **PENDING — not tracked yet**.
- Approval level: **visual direction only**.
- Desired layout fidelity: principles and visual polish, **not copying each panel literally**.

Do not invent a file path or claim the reference image was verified.

## Five design principles

### 1. Editorial hierarchy, not a grid of widgets
- A lead idea should create immediate curiosity; secondary content is arranged with varied hierarchy and density.
- Mix spacious highlights, compact text-rich story lists, considered images and intentional whitespace.
- Avoid six identical category tiles, uniformly elevated cards, a dashboard-like page or busy magazine columns by default.
- Avoid generic "hero + 3 feature cards + CTA" templates. Editorial storytelling comes before sales widgets.

### 2. Book-like reading at the center
- Long-form article screens are calm, approachable and typographically deliberate, with a sensible text measure (~65–75 characters), comfortable leading, consistent rhythm and excellent Vietnamese diacritics.
- Math, code, interactive figures, quotes, media and citations are authored as first-class content, not accidental embeds.
- For Volume/Chapter: a recognizable cover language, meaningful chapter index, navigation and sense of progression.
- Preserve existing working content/URLs; do not introduce new UI that interrupts reading.

### 3. Warm, tactile restraint
- Light palette baseline: paper #F7F5F0; ink #332E28; terracotta #8C4A32; surface #E8E2D7; muted #7A7265.
- Dark baseline: #1A1816, #E2DCD0, #D4A373, #292521, #A69A8B.
- These are identity anchors, not an excuse to use every color on every element. Use quiet backgrounds, careful borders and low-noise UI.
- No neon, heavy gradients, glassmorphism, arbitrary illustrations, excessive shadows or decorative shapes solely to fill space.

### 4. Crafted typography and imagery
- Heading candidate: Newsreader; prose: Source Serif 4 or existing Lora; interface: Inter; code: JetBrains Mono. **Test** Vietnamese/English, math and real articles before deciding.
- Visible hierarchy: strong editorial headline, readable decks, discrete metadata, careful byline, thoughtful image captions.
- Art direction: original/AI-assisted editorial illustration for abstract covers, verified photos for real events/products, source-derived figures for math/science; record provenance.
- Never use a fabricated picture as real documentary evidence.

### 5. Polished interaction, accessible on every screen
- Desktop, 360px mobile, 768px tablet, 1024px and wider desktop all need intentional arrangements, not a squashed desktop.
- Keyboard focus, hover, active, empty, loading and error states are designed; light/dark typography and image contrast tested.
- Minimize layout shifts. Use restrained motion respecting reduced-motion. Never autoplay sound, scroll hijack or overuse sticky widgets.
- Support/affiliate is polite and explicit. No fake working purchase/auth links in specimen pages.

## Experience signatures (direction, not full-page implementation order)

| Experience | What it should FEEL like | Good implementation signs | Avoid |
|---|---|---|---|
| Journal | A contemporary independent magazine | One strong editorial story; varied supporting hierarchy; byline and date legible | Identical cards in uniform rows, news clutter |
| Article | A beautifully edited book page | Restrained measure, seamless text/figures/math/citations; good mobile line-breaks | Giant sidebar, noisy info chips, cramped code |
| Volume | Reading a carefully structured book | Themed cover, table of contents, ordered chapters, next/prev | Random tag collection marketed as a volume |
| Films | A curated documentary library | Large expressive thumbnail, precise title/duration, transcript and sources | Generic video embed wall |
| Discover | Product discovery with a trusted engineering editor | Relevant rich visuals, who it suits, tradeoffs, disclosure | Price-first ad grid or untested product claims |
| Support | Reader-funded independent publishing | Optional warm invitation, transparent benefit to research | Coercive paywall, fake urgency |
| Mobile | A purposeful pocket magazine | Distinct content hierarchy and ergonomic nav | Desktop cards merely stacked with excessive gaps |

## Visual composition examples

### Article card
Use a clear story hierarchy: editorial category and meaningful thumbnail (if available), thoughtful headline, concise deck, accurate metadata. Most cards should use little or no container shadow. Provide text-only variants when images are absent.

### Headline treatment
Use beautiful serif headlines balanced against readable sans-serif metadata, moderate line-length, deliberate line breaks at wider widths and semantic headings. Good titles can be witty; the page must remain composed, not visually loud.

### Media balance
One important image may dominate a section. Avoid forcing an image onto every story or mixing unrelated stock-photo aesthetics within a row. For chapter/science figures, use informative captions and reproducible illustrations.

### Palette discipline
Think quiet paper, dark ink and a **single accent**, not a site full of brown buttons and beige rectangles. Contrast and interaction indication matter more than decorative consistency.

## Prototype-first workflow — MUST FOLLOW IN PHASE 2
1. Before implementing a large page layout, create a **small design specimen**: typography, navigation, article card, one real long-form article excerpt, Volume header and mobile article view.
2. Render **real browser screenshots** on desktop and mobile, both light and dark. Show at least one real article with diacritics, code and math. If visual browser capture is unavailable, report BLOCKED for visual approval; do not claim parity.
3. Compare screenshots against this brief and the moodboard **only if the moodboard file is actually accessible**. Inspect visual rhythm, whitespace, typography, cropping, alignment and perceived craft.
4. Ask for maintainer's visual acceptance before repeating a component design across all pages. Record approval and requested changes in DECISIONS/AGENT_LOG.
5. Implement shared tokens and components after approval; do not build an entire homepage as a surprise. Phase 3 homepage layout requires its own approval.
6. Preserve performance, accessibility, URLs and existing behavior; visual beauty is not a justification to break the site.

## Acceptance rubric (each category assessed with screenshot evidence)
- **Editorial identity:** feels like a publication, not a generic software template.
- **Visual hierarchy:** obvious what to read first; supporting content has meaningful rhythm.
- **Typography and readability:** strong typographic contrast, Vietnamese glyph quality, comfortable reading, code/math legibility.
- **Imagery:** unified art direction, source rights, accurate product/news imagery, well-chosen crop.
- **Craft:** consistent alignment, spacing, proportion, useful micro-interactions and mobile composition.
- **Restraint:** no visual clutter, unnecessary gradients, overframed card grids or aggressive commercial interruptions.
- **Accessibility and performance:** readable contrast, keyboard/touch usability, limited CLS and reasonable asset weight.

Treat each as **PASS / NEEDS REVISION / UNTESTED**, with screenshot URL and review note. Agent self-assessment alone is not final acceptance.

## Explicit anti-goals
- "It builds, so the redesign is complete."
- "It uses the right hex codes, so it matches the concept."
- "I implemented all components mechanically, therefore it looks premium."
- "I couldn't capture screenshots, so I marked visual approval complete."
- "The homepage mockup from the conversation is a final signed-off specification."
