# D4 — Content Architecture: discovery

**Status:** IN PROGRESS (discovery and design, no code). Started 2026-11-23 after D1 (PR #40) and D-017 (PR #41) were merged and verified on production.
**Process:** discovery questions → sitemap and content model (this file, draft) → owner approval → `DESIGN_SPEC.md` (navigation and archive/series mockups) → implementation plan.

## 1. What the site has today (2026-11-23, after D-017)

| Area | Today | Notes |
|---|---|---|
| Journal | 15 Vietnamese essays, 2 English | Owner: the current essays are largely placeholders; a new essay set will be written. |
| Topics (categories) | 6: Toán học (6), Kinh tế (8), Khoa học máy tính (3), Triết học (1), Vật lý (0), Cá nhân (0) | Category pages are plain lists. Two topics are empty. |
| Tags | 37 | Shown as title-cased slugs ("Ly-Thuyet-Tro-Choi"), not as readable labels. |
| Volumes | 1: Volume I, a "preview" arranging 6 existing essays | P4-02 folded the old "series" concept into Volumes. |
| Films | 1 (Nash, Manim, 65 s) | Linked from its essay with a card (P4-04). |
| Labs | 1 (Nash 2×2 explorer, React) | Same. |
| Discover | 7 works cited by the Nash essays | Non-commercial; affiliate fields reserved. |
| Utility pages | About, Archive, Topics, Tags, RSS, search | In the footer. |
| Languages | vi (default), en; ja and zh-CN interfaces exist with no content | D-017: each essay only in the language it is written in. |
| Main navigation | Journal · Volumes · Films · Labs · Discover | Section names are English on every language. |

## 2. Owner decisions (2026-11-23)

1. **Language: Vietnamese first, English selectively.** Essays are written in Vietnamese. Only essays worth it get an English edition, translated carefully as its own file. The English site is smaller but of even quality. (Builds on D-017.)
2. **Volumes are purposeful books.** A volume is planned as a book: chapters written for it, in order, with an introduction and a conclusion. The Journal holds standalone essays. A **Series** is a lighter, ongoing chain of related essays inside the Journal. This revisits P4-02, which folded series into Volumes: Volume I as it stands (an arrangement of existing essays) fits the Series definition better than the Volume one.
3. **Discover is a resource library.** Books, papers, courses and tools, chosen per topic, each with an editorial reason and links to the essays it relates to. Affiliate links may come later (D6), always labelled. This is broader than today's "works cited only".

## 3. Proposed sitemap (draft for owner review)

```
/                     Home: latest essays, featured, current volume, a resource pick
├── Journal           all essays, newest first; filters by topic and by series
│   ├── <essay>
│   └── Series        list of series → each series page (ordered essays, progress)
├── Volumes           books; each volume: cover, introduction, chapters, status
│   └── <volume> → <chapter>
├── Films             each film: video, its essay(s), transcript
├── Labs              each lab: the tool, what to try, its essay(s)
├── Discover          resource library: by topic and by type (book, paper, course, tool)
│   └── <resource>    (only if a resource needs its own page; otherwise cards)
├── Topics            hub per topic: short introduction, essays, series, volumes, films, labs, resources
└── About · Archive · Tags · RSS · Search   (footer)
```

Open in this draft: whether **Topics** joins the main navigation or stays in the footer (question for the owner, §6).

## 4. Content types and relationships (draft)

| Type | What it is | Belongs to | Links out to |
|---|---|---|---|
| Essay | A standalone long-form piece (Journal) | 1 main topic; 0–1 series; 0–1 volume (as a chapter) | Films, Labs, Resources (0–n each) |
| Series | An ordered chain of essays on one question | 1 topic | its essays (ordered) |
| Volume | A planned book | 1+ topics | its chapters (ordered); resources |
| Film | A video explainer | — | the essay(s) it accompanies |
| Lab | An interactive tool or experiment | — | the essay(s) it accompanies |
| Resource | A book, paper, course or tool in Discover | 1+ topics | the essays that cite or recommend it |
| Topic | A subject area hub | — | everything above, filtered |

Rules carried over:
- Films and Labs are separate destinations; essays link to them and do not embed them (P4-04).
- No content type requires every relationship. An essay may have no series, volume, film, lab or resource.

## 5. Metadata per type (draft, to be fixed in DESIGN_SPEC)

- **Essay:**
  - Required: title, subtitle/summary, author, date, updated date, main topic, language.
  - Optional: tags, series and position, volume and chapter number, related films/labs/resources, reading level, artwork, translation link.
  - Computed: reading time.
- **Series:** title, summary, topic, ordered essays, status (ongoing/complete).
- **Volume:** title, numeral, subtitle, cover, introduction, ordered chapters, status (planned/in progress/published), edition date.
- **Resource:**
  - Fields: title, type, authors, publisher/source, year, identifier (DOI/ISBN/URL), topics, editorial note, related essays, cover (only with a reuse right).
  - Affiliate: a flag plus a disclosure (D6).
- **Tags:** readable label per language (fixes the slug display).

## 6. Owner decisions, round 2 (2026-11-24)

4. **Topics: four.**
   - Toán học — absorbs Vật lý.
   - Kinh tế.
   - Khoa học máy tính.
   - Triết học — absorbs Cá nhân.

   Implementation note: the `vat-ly` and `ca-nhan` category URLs redirect to their new homes; the `categories:` front matter of affected essays is updated. Whether the merged topics are renamed (e.g. "Toán học & Vật lý") is left to DESIGN_SPEC, with the owner.
5. **Topic hubs live inside the Journal.** The main navigation keeps its five approved items. The Journal gets a topic filter, and each topic has a hub page: introduction, essays, series, volumes, films, labs, resources.
6. **Japanese and Chinese interfaces stay** as they are, although they have no content.
7. **Volume I becomes a Series.** "Toán cơ bản cho kinh tế" becomes a Series in the Journal. Volumes shows an honest "in preparation" state until the first purposeful book exists. The old Volume I URLs redirect to the series.

## 7. Sitemap after round 2 (for approval)

```
/                         Home: featured essays, latest essays, current series or volume, a resource pick
├── Journal               all essays; filter by topic; series list
│   ├── Topics (4)        Toán học · Kinh tế · Khoa học máy tính · Triết học   (hub pages)
│   ├── Series            Toán cơ bản cho kinh tế (from Volume I) …
│   └── <essay>
├── Volumes               "in preparation" until the first book
├── Films                 each film → its essay(s)
├── Labs                  each lab → its essay(s)
├── Discover              resource library by topic and type
└── Footer                About · Archive · Tags · RSS · Search
```

Next: DESIGN_SPEC with mockups (navigation and Journal filter, topic hub, series page, essay page showing its series/volume/film/lab/resources, Discover library). These go to the owner for approval before any implementation.
