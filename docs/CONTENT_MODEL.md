# Editorial Content Model

The brand is **The Epistemic Diary**. People are bylined individually but the brand is not author-named.

## Editorial experiences
- **Journal:** timely news/context, analysis, perspectives, explainers, tutorials and reviews.
- **Volumes & chapters:** curated narrative learning paths, like a book; sequential chapter navigation and TOC.
- **Films:** long-form educational YouTube episodes plus transcripts, sources, companion writing.
- **Labs:** runnable demonstrations, math animation, datasets and reproducible experiments.
- **Discover:** curated tools and product explainers, with clear affiliate disclosures.
- **Resources:** downloads, original code, guides, ebooks; some future paid.
- **Support:** voluntary donations or recurring member backing, not necessarily paywalled reading.

## Content semantics
Use a lean shared front matter schema across pages rather than proliferating eight incompatible templates. Preserve existing Hugo URLs and taxonomies until a reviewed migration.

Suggested fields (future optional additions; do not force mass edits):
- title, description, date, lastmod, draft, slug (if existing)
- contentType: news | analysis | tutorial | explainer | review | project | resource | film | chapter
- topics, authors (stable author IDs), series, volume, chapterOrder
- evidence: references, reviewedAt, versionTested (where relevant)
- video: youtubeId, transcript, duration (if film)
- access: free | premium (default free); supportEnabled boolean
- disclosure: affiliate boolean + link to disclosure policy
- heroImage and alt text; featured flags controlled editorially

## Example (specimen, NOT an instruction to migrate URLs)
```yaml
---
title: "Why does gradient descent work?"
description: "A visual explanation and its limits."
date: 2026-11-15
contentType: explainer
topics: [machine-learning, mathematics]
authors: [editor]
series: mathematics-for-ml
access: free
supportEnabled: true
affiliate: false
draft: true
---
```

## Editorial rendering rules
- News pages distinguish event date, publish date, update date; cite primary and independent sources.
- Guides clearly identify software/hardware versions and prerequisites and include verified steps.
- Reviews disclose affiliate arrangements, testing method, samples and limitations.
- Chapters permit previous/next and volume index, without forcing every article into a series.
- Film pages embed player, transcript, references, corrections and companion material.
- Premium article text MUST NOT be emitted into public static HTML merely hidden by CSS/JS.
- Support is voluntary by default; supporting a free article does not imply paywall status.
- Preserve meaning of translated pages; verify before assigning hreflang.

## Initial editorial approach
Publish a small number of unusually good evergreen essays and companion videos before investing in paid features. Deep, fun and accurate: a meal-time-friendly narrative can still have rigorous notes/citations.
