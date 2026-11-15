# Design System — Editorial Research (V1 specification)

**Stage:** Phase 2 design target, NOT a final approved homepage design. **Mandatory creative brief:** [VISUAL_DIRECTION.md](VISUAL_DIRECTION.md). Token correctness alone does not imply design acceptance.

## Desired experience
A thoughtfully produced journal and multi-volume book: premium-level polish without glossy excess. Minimal, warm, literary and technical; consistent, restrained interactions. Inspired by quality of execution, not a copy of Apple or any named creator. Preserve quiet long-form reading.

## Semantic palettes
| Token | Light | Dark | Use |
|---|---|---|---|
| background | #F7F5F0 | #1A1816 | page |
| foreground | #332E28 | #E2DCD0 | body text |
| accent | #8C4A32 | #D4A373 | links, primary action |
| surface | #E8E2D7 | #292521 | restrained panels |
| muted | #7A7265 | #A69A8B | secondary metadata |
Test WCAG contrast in the actual pairing. Derive focus/borders/disabled/selection colors through semantic variables, not scattered hex values. Avoid color as the sole indicator of state.

## Typography candidates (test before adoption)
- Editorial heading: Newsreader.
- Long-form body: Source Serif 4 or existing Lora, whichever handles Vietnamese diacritics/math spacing/legibility best.
- Interface/meta: Inter.
- Code: JetBrains Mono.
- Retain sensible fallback stacks. Use few font weights; subset responsibly; avoid font load/layout shift.
- Target prose measure roughly 65–75 characters desktop, sensible mobile gutters and breathing space.
- Consistent heading scale, body line-height, caption and code/table rhythm.

## Layout and interaction rules
- Reading-first: uncluttered prose, sensible TOC, linkable headings, evidence and references.
- Editorial variety: featured stories and compact lists; not a monotonous grid of identical cards.
- Mobile-first; clear navigation and touch targets; visible focus and keyboard functionality.
- Dark mode retains warmth; respects OS preference and user choice.
- No gratuitous parallax, autoplay audio, scroll hijacks or aggressive popups.
- Motion subtle and disabled under prefers-reduced-motion; loading/layout should not jump.
- Any affiliation/support label must be understandable without clicking.

## Component inventory and required states
| Group | Examples | Required states |
|---|---|---|
| Foundation | container, stack, grid, spacing, surface, divider | desktop/mobile |
| Typography | H1–H6, prose, lead, quote, code, math, caption, citations | light/dark, long text |
| Navigation | header, nav, breadcrumbs, search button, mobile menu | hover/focus/open/closed/keyboard |
| Editorial | article card, featured article, topic tag, author byline, TOC, chapter navigation | missing image, long title |
| Media | film card, transcript, embedded figure, lab/embed | fallback/loading/accessible |
| Monetization previews | SupportAuthor, MembershipCard, AffiliateProduct, disclosure, premium preview, AdSlot | demo-only, **no fake checkout** |

## Prototype gate
Create and visually review a **real screenshot-based specimen** before reusing a new visual language across the publication. Follow VISUAL_DIRECTION.md for editorial hierarchy, imagery, article/volume/film composition and prohibited generic-template patterns. Require maintainer visual acceptance; if unavailable, record UNTESTED, not DONE.

## Design review rubric
Check discoverability, reading rhythm, content hierarchy, contrast, keyboard navigation, responsive design (360/768/1024/desktop), SEO semantics and perceived quality. Screenshot specimens in both themes. Record design choices and rejected alternatives in DECISIONS.md.

## Out of scope until later
No final homepage layout; user has explicitly **not approved** the earlier homepage wireframes. No active subscription, affiliate checkout or ads. Build system/components, not marketing theatrics.
