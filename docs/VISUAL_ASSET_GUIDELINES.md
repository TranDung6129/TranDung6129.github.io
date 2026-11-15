# Visual Asset Guidelines — The Epistemic Diary

**Decision:** use a hybrid of original illustrations, AI-assisted artwork, code-generated scientific figures, and appropriately licensed documentary/product photography. These guidelines govern Phase 2 components and future content; **the reference concept board is visual inspiration, not a final approved homepage layout**.

## Brand look
- Warm paper (#F7F5F0), brown ink (#332E28), terracotta (#8C4A32); matching thoughtful dark theme.
- Editorial, minimal, intelligent, gently playful, subtle texture and tactile print-like design.
- Prefer crafted composition, meaningful subject, restrained palette, ample negative space, and consistent crop. Avoid generic tech stock imagery (random glowing robots, neon brains, irrelevant laptop hands).
- Use original illustrations to establish signature look. No imitation of a living creator's proprietary artwork or a source's recognizable style without permission.

## Choose source based on purpose
| Use | Preferred source | Reason |
|---|---|---|
| Cover art, essays, Volumes, Films | Original commissioned/handmade artwork or AI-assisted original concepts | Coherent identity |
| Mathematics, algorithms, experiment figures | Source-driven SVG, Manim, Python plot, verified diagram | Reproducibility and factual truth |
| Real news events, people, devices, product reviews | Actual licensed photos or original photographs | Documentary accuracy |
| Product listing / affiliate card | Accurate manufacturer image used with explicit permission/partner terms or original product photo | Product fidelity |
| Ambient secondary editorial imagery | License-verified stock (e.g. Unsplash/Pexels) | Efficiency |
| Logos and wordmarks | Original owned asset designed for trademark appropriateness | Distinct brand |

## Absolute constraints
- Never use AI-generated imagery as photographic evidence of real events, experiments, product details or actual individuals.
- Label material synthetic/illustrative imagery when confusing it with documentary fact is plausible. Follow platform-specific AI labeling rules for YouTube/TikTok.
- No hotlinking third-party images by default: download and host assets only where terms permit. Capture origin and license before publication.
- Do not scrape Google Images or assume search-result images are freely reusable.
- Do not assume image-generator output is exclusive or trademarkable; inspect tool/provider terms for commercial use and asset provenance.
- Beware visible trademarks/people, model releases, third-party design rights. Stock commercial-use licenses do not erase these rights.
- No copying other publications' charts or image compositions without rights; redraw original figures from underlying data with attribution to source data.
- No logos from stock libraries in core trademark. Never imply endorsement.

## Mandatory asset manifest
Create a simple data manifest for shipped editorial assets (YAML/JSON/CSV), ideally fields:
`id, filePath, usePage, kind, creator, sourceUrl, licenseIdOrTermsUrl, licenseCheckedAt, attributionText, modificationNotes, aiGenerated, altText, width, height, editorialReviewStatus`.
Mark `kind`: original-photo | original-illustration | original-data-figure | licensed-stock | manufacturer | ai-illustration.
If source/license cannot be established, do not ship the asset.

## Image workflow
1. Choose page intent, visual thesis, subject and image type.
2. For original illustration, create 1–3 sketches consistent with palette; for photo, verify licensing/rights first.
3. Verify facts: math equations, charts, products, event pictures; ensure captions cannot misrepresent actuality.
4. Optimize responsive variants and modern formats (AVIF/WebP as appropriate, with fallback where needed); store master separate from deployment derivative.
5. Supply meaningful alt text for informative assets; decorative assets use empty alt. Include caption/credit when editorial context requires.
6. Set explicit dimensions or aspect ratio, responsive sizes; lazy-load below-fold assets and prioritize above-fold LCP image.
7. Review both light/dark themes and 360px / 768px / desktop crops.
8. Record provenance and license in manifest; review any terms changes before new usage.

## Suggested reusable compositions
- **Cover / featured story:** cinematic editorial art, 16:9 landscape and 4:5 social crop; subject placed to leave title safe area.
- **Article preview:** 3:2 or 16:10 with consistent editorial crops.
- **Volumes:** distinctive cover system with volume number, thematic motif, consistent typography.
- **Film thumbnails:** 16:9, legible at small sizes, one clear idea, original composition.
- **Lab/diagrams:** SVG/Canvas for interactive or crisp plots; include noninteractive fallback and textual explanation.
- **Affiliate products:** accurate unmanipulated product shots; do not hallucinate device ports/specs.

## SEO and licensing
Google image search benefits from discoverable assets, descriptive alt text and relevant landing-page context. For owned/licensed photographs, consider accurate IPTC licensing metadata or structured data where appropriate, avoiding unsubstantiated rights claims.

## Source references (checked 2026-11-15)
- Unsplash license: https://unsplash.com/license
- Pexels license: https://www.pexels.com/license/
- Google image SEO: https://developers.google.com/search/docs/appearance/google-images
- Google image rights metadata: https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata
These are starting references, not a blanket legal guarantee.
