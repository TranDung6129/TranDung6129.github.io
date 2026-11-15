# Quality Gates & Acceptance Evidence

## Before changing code (P1-01 / P1-02)
- Inspect actual Hugo version and configuration merge precedence.
- Record baseline build command/output and site routes (including English/other language variants).
- Record article, image, shortcode, math, code, search, RSS, sitemap, TOC, dark mode behavior.
- Identify build artifacts, generated assets and existing links; back up production branch ref.
- Note website visual capture may be unavailable; do not claim visual parity without evidence.

## Per PR
0. If adding, moving, deleting or reassigning code responsibilities, update docs/CODEBASE_MAP.md with new owner, entry point, impact and verification. A stale codebase map fails review.
1. Run project build (current package script: npm run build; underlying Hugo command may also be used), documenting environment and failures.
2. Check generated URL list before/after; zero unintended disappeared URLs.
3. Check rendered HTML for unique title, correct language, metadata, headings and image references.
4. Confirm math/complex code pages and embedded simulation functionality if touched.
5. Verify keyboard navigation, focus visibility, interactive component state and reduced motion where relevant.
6. Smoke-test mobile at 360px and 768px, tablet 1024px and desktop; light and dark.
7. Check accessibility and console error regressions; record actual test method/tool.
8. Document every deletion with proof of non-use or tested replacement.
9. For changed visual assets: validate manifest, rights/provenance, captions/alt, crop, responsive formats, dimensions, LCP/CLS impact and synthetic-media honesty.
10. For changes involving accounts, external APIs, analytics, or commerce: review secret handling, authorization, personal data flows, payment idempotency and appropriate legal requirements.

## Phase 1 exit
- Build green in CI and GitHub Pages preview/deployment smoke verified.
- Old public content and URL mapping safe; languages and key functionalities intact.
- No dependence on FixIt remains, **only after** feature parity verified.
- README and architecture match actual implementation; rollback path recorded.

## Phase 2 exit
- Color tokens validated for contrast in target context.
- Typography specimen read and reviewed (Vietnamese diacritics, math, code, captions).
- Shared components have responsive and keyboard states and usage documentation.
- Long-form writing remains comfortable; no intrusive monetization widgets.
- Image specimens are grounded in the visual guide, with correct provenance; **a concept board is reference, not proof of implementation**.
- Performance tested with method and actual observations; targets are aspirations, not fabricated results.
- Maintainer review/sign-off; no premature full homepage redesign.

## SEO validation
- Sitemap and robots render, canonical/base URL correct, relevant schema passes validation.
- No accidental noindex, duplicate pages or incorrect hreflang.
- Links, structured data and social card previews are checked.
- Images have meaningful alt text when informative and decorative images do not add noise.
- Real image URLs are crawlable where appropriate; descriptive filenames and truthful rights/credit metadata are used.

## Task evidence format
Paste into AGENT_LOG.md:
- exact commands and pass/fail; artifact URLs or screenshots if available;
- URL diff count, links checked, manual QA coverage;
- known failures and follow-up task ID;
- code commit SHA and PR URL.
A generic "tested" without command/result is NOT sufficient.
