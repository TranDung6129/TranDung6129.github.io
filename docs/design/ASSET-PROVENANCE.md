# Editorial artwork provenance — v2 review

The four PNG files in `assets/editorial-source/` were supplied by the owner in `epistemic_editorial_assets_v2.zip` for this design review. The owner identifies them as AI-generated editorial artwork. The originals are retained byte-for-byte; neither image regeneration nor content-aware editing was used. SHA-256, dimensions, description, intended use and derivatives are recorded in [owner-art-v2.json](owner-art-v2.json). The earlier AI-assisted feature SVG partials remain in the repository but are no longer used; the previous inline hero is retained in Git history.

| Original | Pixels | Use | Derivative widths |
|---|---:|---|---|
| `epistemic_hero.png` | 1672 × 941 | Hero | 640, 960, 1400, 1672 |
| `epistemic_probability_v2.png` | 592 × 708 | Probability featured essay | 320, 592 |
| `epistemic_decision_v2.png` | 775 × 574 | Decision featured essay | 400, 775 |
| `epistemic_volume_1_cover.png` | 1024 × 1536 | Volume cover | 256, 512, 1024 |

`scripts/process-editorial-art.py` uses Pillow 13.0.0 and its WebP encoder (quality 84, method 6) to generate `assets/editorial-art/`; it resizes proportionally without cropping or enlargement. The template serves responsive WebP with original PNG fallback, intrinsic dimensions, descriptive alt text and captions. All subjects are contained, including both dice and the full book cover; image proportions are preserved in both themes, with no dark-mode inversion. A small figure-label strip sits outside each essay artwork. Local preview only: no production image route is emitted.

## Accuracy and rights

The probability illustration contains two dice; the supplied background includes wavy ground lines. The decision artwork shows an empty historic library, without a human figure or visible formulas. These are illustrative, not documentary photographs. The hero's readable integral `∫Ω f(x)dμ(x)` and metric expression `ds² = g_{μν} dx^{μ} dx^{ν}` are recognizable standard notation (the latter conventionally uses Einstein summation). The decorative φ/spiral, tiny instrument graduations and paper markings are not an evidence-backed mathematical construction; the preview caption calls the geometric marks decorative and must not present them as precise scientific measurements. Fine pseudo-markings are not independently verified. No source pixels were altered or represented as a real historical artifact.

The owner supplied these images for review; the generator/model, source terms and any third-party rights are not independently verified. Complete rights, trademark and editorial review remain necessary before production publication. No visual owner sign-off or production deployment is implied. See the separate [font comparison](typography-comparison/README.md) for licensed typeface provenance.

The previously supplied concept image was a directional reference and is not embedded as an asset. The owner-approved layout remains unchanged as a design direction; final artwork, fonts and production use remain awaiting owner review.
