# Phase 4 — Information architecture and reading experience

Owner decisions of 2026-11-15, following the Phase 3 review.

| ID | Task | Owner decision | Status |
|---|---|---|---|
| P4-01 | Article page layout: use the empty right margin (marginal notes/sidenotes) and let figures, tables and media extend beyond the text column | Direction (b)+(c) agreed, but **"leave the article page alone for now; Phase 4 decides"** | DEFERRED — prototype with screenshots and owner approval before any change |
| P4-02 | Retire the four FixIt sample collections; fold the "series" concept (collections taxonomy) into Volumes | Agreed, accepting 404 for the sample URLs | DONE |
| P4-03 | About becomes a page about the publication; personal name only as byline (D-001) | Agreed | DONE |
| P4-04 | Labs and films become their own pages; essays link to them with cards instead of embedding | Agreed ("tách luôn") | DONE |
| — | Keep Archives, Categories, Tags (utility pages in the footer) and Offline | Agreed | kept |

## P4-02 details
- Removed `content/collections/` (four sample collections plus the collections index) and the `collections` taxonomy; the inert `collections:` front-matter key was removed from the ten "Toán Cơ Bản Cho Kinh Tế" files.
- The real series is Volume I. Its former URLs redirect there with Hugo aliases: `/collections/`, `/collections/toán-cơ-bản-cho-kinh-tế/`, `/en/collections/`, `/en/collections/basic-mathematics-for-economics/`, `/en/collections/toán-cơ-bản-cho-kinh-tế/`.
- Removed with the samples (only the sample pages used them): categories `education`, `programming`, `travel`, `tutorial` and 18 sample tags, in vi and en. Their URLs now return 404, as agreed.
- Article pages no longer show the series box; the volume position (chapter n of N) replaces it. Footer "Series" link → "Volumes".

## P4-03 details
`content/about/index.md` and `index.en.md` rewritten from the editorial docs: what the publication is, the five sections, editorial principles (EDITORIAL_VOICE), honest early-stage note, author byline, contact via GitHub issues. URL `/about/` unchanged; the page images stay published at their URLs but are no longer shown.

## P4-04 details
- `/labs/nash-explorer/` (vi, en) holds the React simulation, its explanation and suggested experiments; `/films/nash-animation/` (vi, en) holds the video, poster and duration. Front matter `related:` names the companion essay; `tech`/`requires` (labs), `video`/`poster`/`duration`/`youtube` (films).
- Essays link with `{{< lab "id" >}}` and `{{< film "id" >}}` cards (missing id fails the build). The Nash essay now uses both; it no longer embeds React or video.
- `/labs/` and `/films/` list the section pages; `data/labs.yaml` and `data/films.yaml` were removed.

Tests: `docs/audits/p3-07/tools/p3-smoke.cjs` (updated for the new pages), `docs/audits/p1-06/tools/seo-check.py`, `docs/audits/p1-02/static/analyze.py`.
